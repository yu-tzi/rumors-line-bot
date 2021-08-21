export const ArticleReplyCard_articleReply = /* GraphQL */ `
  fragment ArticleReplyCard_articleReply on CofactsAPIArticleReply {
    articleId
    replyType
    reply {
      id
      text
      reference
    }
    user {
      name
      avatarUrl
      level
    }
    postitiveFeedbackCount
    negativeFeedbackCount
    ownVote
    createdAt
  }
`;
