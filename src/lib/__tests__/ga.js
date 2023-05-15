import ua from 'universal-analytics';
import ga from '../ga';

jest.mock('universal-analytics', () => {
  const mockVisitor = {
    screenview: jest.fn(),
    set: jest.fn(),
  };

  return jest.fn().mockReturnValue(mockVisitor);
});

const insertEventBatchMock = jest.fn;

jest.mock('../bq', () => {
  return { insertEventBatch: insertEventBatchMock };
});

beforeEach(() => {
  ua.mockClear();
  ua().screenview.mockClear();
  ua().set.mockClear();
  insertEventBatchMock.mockClear();
});

it('returns visitor', () => {
  expect(ga('userId')).toHaveProperty('send');
  expect(ua().screenview.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "N/A",
      "rumors-line-bot",
    ]
  `);
  expect(ua().set.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "cd1",
        "user",
      ],
    ]
  `);
});

it('sets title when title is given', () => {
  // 3000 emoji title. When slicing, it should not break emoji.
  const longTitle = Array.from(Array(1000))
    .map(() => '👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦')
    .join('');

  ga('userId', '__INIT__', longTitle);
  expect(ua().screenview.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "__INIT__",
      "rumors-line-bot",
    ]
  `);
  expect(ua().set.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "dt",
      "👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧👩‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👨‍👧‍👧",
    ]
  `);
});
