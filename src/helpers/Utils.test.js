import {
  printException,
  collectUrlParams,
  formatUrl,
} from './Utils';

const makeResultParams = ({ format, name }) => {
  return {
    protocol: 'https:',
    host: 'pbs.twimg.com',
    pathname: '/media/hogefuga123',
    format,
    name: name || null,
  };
}

describe('Utils', () => {
  it('エラーメッセージの表示(予期せぬ状況の確認)', () => {
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://example.com/',
      },
    });
    console.log = jest.fn();
    printException('exception message');
    expect(console.log.mock.calls[0][0]).toBe('tooi: exception message at: http://example.com/');
  });

  describe('画像urlの要素を集める', () => {
    const cases = [
      {
        title: '何もなし',
        url: 'https://pbs.twimg.com/media/hogefuga123',
        params: { format: 'jpg' },
      },
      {
        title: '.jpg',
        url: 'https://pbs.twimg.com/media/hogefuga123.jpg',
        params: { format: 'jpg' },
      },
      {
        title: '.png',
        url: 'https://pbs.twimg.com/media/hogefuga123.png',
        params: { format: 'png' },
      },
      {
        title: '.jpg:orig',
        url: 'https://pbs.twimg.com/media/hogefuga123.jpg:orig',
        params: { format: 'jpg', name: 'orig' },
      },
      {
        title: '.jpg:large',
        url: 'https://pbs.twimg.com/media/hogefuga123.jpg:large',
        params: { format: 'jpg', name: 'large' },
      },
      {
        title: '?format=jpg',
        url: 'https://pbs.twimg.com/media/hogefuga123?format=jpg',
        params: { format: 'jpg' },
      },
      {
        title: '?format=png',
        url: 'https://pbs.twimg.com/media/hogefuga123?format=png',
        params: { format: 'png' },
      },
      {
        title: '.jpg?format=jpg',
        url: 'https://pbs.twimg.com/media/hogefuga123.jpg?format=jpg',
        params: { format: 'jpg' },
      },
      {
        title: '.jpg?format=png',
        url: 'https://pbs.twimg.com/media/hogefuga123.jpg?format=png',
        params: { format: 'jpg' },
      },
      {
        title: '.png?format=jpg',
        url: 'https://pbs.twimg.com/media/hogefuga123.png?format=jpg',
        params: { format: 'png' },
      },
      {
        title: '.jpg?name=large',
        url: 'https://pbs.twimg.com/media/hogefuga123.jpg?name=large',
        params: { format: 'jpg', name: 'large' },
      },
      {
        title: '?format=jpg&name=large',
        url: 'https://pbs.twimg.com/media/hogefuga123?format=jpg&name=large',
        params: { format: 'jpg', name: 'large' },
      },
      {
        title: '.png?format=jpg&name=orig',
        url: 'https://pbs.twimg.com/media/hogefuga123.png?format=jpg&name=orig',
        params: { format: 'png', name: 'orig' },
      },
    ];

    cases.forEach(singleCase => {
      const { title, url, params } = singleCase;
      it(title, () => {
        expect(collectUrlParams(url)).toStrictEqual(makeResultParams(params));
      });
    });
    it('twitterの画像URLでないときnull', () => {
      expect(collectUrlParams('https://twitter.com/tos')).toBe(null);
    });
  });
});
