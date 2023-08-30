import { ListArticlesInProcessMediaQuery } from 'typegen/graphql';

export const oneImageArticle: GqlResponse<ListArticlesInProcessMediaQuery> = {
  data: {
    ListArticles: {
      edges: [
        {
          score: 87,
          node: {
            articleType: 'IMAGE',
            attachmentUrl: 'http://foo/image.jpeg',
            id: 'image-article-1',
          },
          mediaSimilarity: 0.87,
          highlight: null,
        },
      ],
    },
  },
};

export const oneIdenticalImageArticle: GqlResponse<ListArticlesInProcessMediaQuery> =
  {
    data: {
      ListArticles: {
        edges: [
          {
            score: 100,
            node: {
              articleType: 'IMAGE',
              attachmentUrl: 'http://foo/image.jpeg',
              id: 'image-article-1',
            },
            mediaSimilarity: 1,
            highlight: null,
          },
        ],
      },
    },
  };

export const twelveImageArticles: GqlResponse<ListArticlesInProcessMediaQuery> =
  {
    data: {
      ListArticles: {
        edges: Array.from(Array(6)).reduce(
          (arr) =>
            arr.concat([
              {
                score: 100,
                mediaSimilarity: 1,
                node: {
                  articleType: 'IMAGE',
                  attachmentUrl: 'http://foo/image.jpeg',
                  id: 'image-article-1',
                  highlight: null,
                },
              },
              {
                score: 87.6656,
                mediaSimilarity: 0.87,
                node: {
                  articleType: 'IMAGE',
                  attachmentUrl: 'http://foo/image2.jpeg',
                  id: 'image-article-2',
                  highlight: null,
                },
              },
            ]),
          []
        ),
      },
    },
  };

export const notFound: GqlResponse<ListArticlesInProcessMediaQuery> = {
  data: {
    ListArticles: {
      edges: [],
    },
  },
};
