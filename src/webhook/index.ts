import { t } from 'ttag';
import Router from 'koa-router';

import rollbar from 'src/lib/rollbar';
import ga from 'src/lib/ga';
import redis from 'src/lib/redisClient';
import { groupEventQueue, expiredGroupEventQueue } from 'src/lib/queues';

import lineClient from './lineClient';
import checkSignatureAndParse from './checkSignatureAndParse';
import handleInput from './handleInput';
import handlePostback from './handlePostback';
import GroupHandler from './handlers/groupHandler';
import {
  createGreetingMessage,
  createTutorialMessage,
} from './handlers/tutorial';
import processMedia from './handlers/processMedia';
import UserSettings from '../database/models/userSettings';
import { Request } from 'koa';
import { WebhookEvent } from '@line/bot-sdk';
import { Result } from 'src/types/result';
import { ChatbotEvent, Context } from 'src/types/chatbotState';

const userIdBlacklist = (process.env.USERID_BLACKLIST || '').split(',');

const singleUserHandler = async (
  req: Request,
  /** @deprecated: Just use webhookEvent.type, which enables narrowing */
  type: WebhookEventType,
  replyToken: string,
  timeout: number,
  userId: string,
  webhookEvent: WebhookEvent
) => {
  // reply before timeout
  // the reply token becomes invalid after a certain period of time
  // https://developers.line.biz/en/reference/messaging-api/#send-reply-message
  let isReplied = false;
  const messageBotIsBusy = [
    {
      type: 'text',
      text: t`Line bot is busy, or we cannot handle this message. Maybe you can try again a few minutes later.`,
    },
  ];
  const timerId = setTimeout(function () {
    isReplied = true;
    console.log(
      `[LOG] Timeout ${JSON.stringify({
        userId,
        ...webhookEvent,
      })}\n`
    );
    lineClient.post('/message/reply', {
      replyToken,
      messages: messageBotIsBusy,
    });
  }, timeout);

  if (userIdBlacklist.indexOf(userId) !== -1) {
    // User blacklist
    console.log(
      `[LOG] Blocked user INPUT =\n${JSON.stringify({
        userId,
        ...webhookEvent,
      })}\n`
    );
    clearTimeout(timerId);
    return;
  }

  // Set default result
  //
  let result: Result = {
    context: { data: {} },
    replies: [
      {
        type: 'text',
        text: t`I cannot understand messages other than text.`,
      },
    ],
  };

  // Handle follow/unfollow event
  if (webhookEvent.type === 'follow') {
    await UserSettings.setAllowNewReplyUpdate(userId, true);

    if (process.env.RUMORS_LINE_BOT_URL) {
      const data = { sessionId: Date.now() };
      result = {
        context: { data },
        replies: [
          createGreetingMessage(),
          createTutorialMessage(data.sessionId),
        ],
      };

      const visitor = ga(userId, 'TUTORIAL');
      visitor.event({
        ec: 'Tutorial',
        ea: 'Step',
        el: 'ON_BOARDING',
      });
      visitor.send();
    } else {
      clearTimeout(timerId);
      return;
    }
  } else if (webhookEvent.type === 'unfollow') {
    await UserSettings.setAllowNewReplyUpdate(userId, false);
    clearTimeout(timerId);
    return;
  }

  const context = (await redis.get(userId)) || {};
  // React to certain type of events
  //
  if (webhookEvent.type === 'message' && webhookEvent.message.type === 'text') {
    // normalized "input"
    const input = webhookEvent.message.text;

    // Debugging: type 'RESET' to reset user's context and start all over.
    //
    if (input === 'RESET') {
      redis.del(userId);
      clearTimeout(timerId);
      return;
    }

    result = await processText(context, webhookEvent.type, input, userId, req);
  } else if (
    webhookEvent.type === 'message' &&
    webhookEvent.message.type !== 'text'
  ) {
    result = await processMedia(context, webhookEvent, userId);
  } else if (webhookEvent.type === 'message') {
    // Track other message type send by user
    ga(userId)
      .event({
        ec: 'UserInput',
        ea: 'MessageType',
        el: webhookEvent.message.type,
      })
      .send();
  } else if (webhookEvent.type === 'postback') {
    const postbackData = JSON.parse(webhookEvent.postback.data);

    // Handle the case when user context in redis is expired
    if (!context.data) {
      lineClient.post('/message/reply', {
        replyToken,
        messages: [
          {
            type: 'text',
            text: '🚧 ' + t`Sorry, the button is expired.`,
          },
        ],
      });
      clearTimeout(timerId);
      return;
    }

    // When the postback is expired,
    // i.e. If other new messages have been sent before pressing buttons,
    // tell the user about the expiry of buttons
    //
    if (postbackData.sessionId !== context.data.sessionId) {
      console.log('Previous button pressed.');
      lineClient.post('/message/reply', {
        replyToken,
        messages: [
          {
            type: 'text',
            text:
              '🚧 ' +
              t`You are currently searching for another message, buttons from previous search sessions do not work now.`,
          },
        ],
      });
      clearTimeout(timerId);
      return;
    }

    const input = postbackData.input;
    result = await handlePostback(
      context,
      postbackData.state,
      { type: webhookEvent.type, input } as ChatbotEvent,
      userId
    );
  }

  if (isReplied) {
    console.log('[LOG] reply & context setup aborted');
    return;
  }
  clearTimeout(timerId);

  console.log(
    JSON.stringify({
      CONTEXT: context,
      INPUT: { userId, ...webhookEvent },
      OUTPUT: result,
    })
  );

  // Send replies. Does not need to wait for lineClient's callbacks.
  // lineClient's callback does error handling by itself.
  //
  lineClient.post('/message/reply', {
    replyToken,
    messages: result.replies,
  });

  // Set context
  //
  await redis.set(userId, result.context);
};

async function processText(
  context: { data: Partial<Context> },
  type: 'message' | 'postback',
  input: string,
  userId: string,
  req: Request
): Promise<Result> {
  let result: Result;
  try {
    result = await handleInput(
      context,
      { type, input } as ChatbotEvent,
      userId
    );
    if (!result.replies) {
      throw new Error(
        'Returned replies is empty, please check processMessages() implementation.'
      );
    }
  } catch (e) {
    console.error(e);
    rollbar.error(e as Error, req);
    result = {
      context: { data: {} },
      replies: [
        {
          type: 'text',
          text: t`Oops, something is not working. We have cleared your search data, hopefully the error will go away. Would you please send us the message from the start?`,
        },
      ],
    };
  }
  return result;
}

const router = new Router();

const groupHandler = new GroupHandler(groupEventQueue, expiredGroupEventQueue);
// Routes that is after protection of checkSignature
//
router.use('/', checkSignatureAndParse);
router.post('/', (ctx) => {
  // Allow free-form request handling.
  // Don't wait for anything before returning 200.

  (ctx.request.body as { events: WebhookEvent[] }).events.forEach(
    async (webhookEvent: WebhookEvent) => {
      let replyToken = '';
      if ('replyToken' in webhookEvent) {
        replyToken = webhookEvent.replyToken;
      }

      // set 28s timeout
      const timeout = 28000;
      if (webhookEvent.source.type === 'user') {
        singleUserHandler(
          ctx.request,
          webhookEvent.type,
          replyToken,
          timeout,
          webhookEvent.source.userId ?? '',
          webhookEvent
        );
      } else if (
        webhookEvent.source.type === 'group' ||
        webhookEvent.source.type === 'room'
      ) {
        const groupId =
          webhookEvent.source.type === 'group'
            ? webhookEvent.source.groupId
            : webhookEvent.source.roomId;

        groupHandler.addJob({
          type: webhookEvent.type,
          replyToken,
          groupId,
          webhookEvent,
        });
      }
    }
  );
  ctx.status = 200;
});

export default router;