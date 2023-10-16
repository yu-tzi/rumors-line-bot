import { t } from 'ttag';
import choosingArticle from './handlers/choosingArticle';
import choosingReply from './handlers/choosingReply';
import askingArticleSubmissionConsent from './handlers/askingArticleSubmissionConsent';
import askingArticleSource from './handlers/askingArticleSource';
import defaultState from './handlers/defaultState';
import { ManipulationError } from './handlers/utils';
import tutorial from './handlers/tutorial';
import {
  ChatbotEvent,
  ChatbotState,
  ChatbotStateHandlerParams,
  ChatbotStateHandlerReturnType,
  PostbackActionData,
} from 'src/types/chatbotState';
import { Message } from '@line/bot-sdk';

/**
 * Given input event and context, outputs the new context and the reply to emit.
 *
 * @param context The current context of the bot
 * @param state The input state
 * @param event The input event
 * @param userId LINE user ID that does the input
 */
export default async function handlePostback(
  { data = {} },
  postbackData: PostbackActionData<unknown>,
  event: ChatbotEvent,
  userId: string
) {
  let replies: Message[] = [];

  let params: ChatbotStateHandlerParams | ChatbotStateHandlerReturnType = {
    data,
    state: postbackData.state,
    event,
    userId,
    replies,
  };

  // Sets data and replies
  //
  try {
    switch (params.state) {
      case 'CHOOSING_ARTICLE': {
        params = await choosingArticle(params);
        break;
      }
      case 'CHOOSING_REPLY': {
        params = await choosingReply(params);
        break;
      }
      case 'TUTORIAL': {
        params = tutorial(params);
        break;
      }
      case 'ASKING_ARTICLE_SOURCE': {
        params = await askingArticleSource(params);
        break;
      }
      case 'ASKING_ARTICLE_SUBMISSION_CONSENT': {
        params = await askingArticleSubmissionConsent(params);
        break;
      }
      default: {
        params = defaultState(params);
        break;
      }
    }
  } catch (e) {
    if (e instanceof ManipulationError) {
      params = {
        ...params,
        replies: [
          {
            type: 'flex',
            altText: e.toString(),
            contents: {
              type: 'bubble',
              header: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: `⚠️ ${t`Wrong usage`}`,
                    color: '#ffb600',
                    weight: 'bold',
                  },
                ],
              },
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: e.message,
                    wrap: true,
                  },
                ],
              },
              styles: {
                body: {
                  separator: true,
                },
              },
            },
          },
        ],
      };
    } else {
      throw e;
    }
  }

  ({ data, replies } = params);

  return {
    context: { data },
    replies,
  };
}
