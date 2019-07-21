import { INITIAL_OPTIONS, isTrue, isFalse } from '../../src/helpers/Constants';
import {
  printException,
  collectUrlParams,
  formatUrl,
  openImages,
  getOptions,
} from '../../src/helpers/Utils';

const makeResultParams = ({ format, name }) => {
  return {
    protocol: 'https:',
    host: 'pbs.twimg.com',
    pathname: '/media/hogefuga123',
    format,
    name: name || null,
  };
};

describe('Utils', () => {
  describe('printException', () => {
    it('エラーメッセージの表示(予期せぬ状況の確認)', () => {
      console.log = jest.fn();
      printException('exception message');
      expect(console.log.mock.calls[0][0]).toBe(
        'tooi: exception message at: http://localhost/'
      );
    });
  });

  describe('URLのツール', () => {
    // URLの変換のテストの場合たち
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

    describe('collectUrlParams 画像urlの要素を集める', () => {
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

    describe('formatUrl 画像URLを https～?format=〜&name=orig に揃える', () => {
      cases.forEach(singleCase => {
        const { title, url, params } = singleCase;
        it(title, () => {
          expect(formatUrl(url)).toBe(
            `https://pbs.twimg.com/media/hogefuga123?format=${
              params.format
            }&name=orig`
          );
        });
      });

      it('twitterの画像URLでないときそのまま', () => {
        expect(formatUrl('https://twitter.com/tos')).toBe(
          'https://twitter.com/tos'
        );
      });
    });
  });

  describe('openImages 画像を開く', () => {
    it('画像URLを1つ渡したとき開く', () => {
      window.open = jest.fn();
      openImages(['https://pbs.twimg.com/media/1st?format=jpg&name=orig']);
      expect(window.open.mock.calls.length).toBe(1);
      expect(window.open.mock.calls[0][0]).toBe(
        'https://pbs.twimg.com/media/1st?format=jpg&name=orig'
      );
    });

    it('画像URLを2つ渡したとき逆順に開く', () => {
      window.open = jest.fn();
      openImages([
        'https://pbs.twimg.com/media/1st?format=jpg&name=orig',
        'https://pbs.twimg.com/media/2nd?format=jpg&name=orig',
      ]);
      expect(window.open.mock.calls.length).toBe(2);
      expect(window.open.mock.calls[0][0]).toBe(
        'https://pbs.twimg.com/media/2nd?format=jpg&name=orig'
      );
      expect(window.open.mock.calls[1][0]).toBe(
        'https://pbs.twimg.com/media/1st?format=jpg&name=orig'
      );
    });

    it('画像URLを4つ渡したとき逆順に開く', () => {
      window.open = jest.fn();
      openImages([
        'https://pbs.twimg.com/media/1st?format=jpg&name=orig',
        'https://pbs.twimg.com/media/2nd?format=jpg&name=orig',
        'https://pbs.twimg.com/media/3rd?format=jpg&name=orig',
        'https://pbs.twimg.com/media/4th?format=jpg&name=orig',
      ]);
      expect(window.open.mock.calls.length).toBe(4);
      expect(window.open.mock.calls[0][0]).toBe(
        'https://pbs.twimg.com/media/4th?format=jpg&name=orig'
      );
      expect(window.open.mock.calls[1][0]).toBe(
        'https://pbs.twimg.com/media/3rd?format=jpg&name=orig'
      );
      expect(window.open.mock.calls[2][0]).toBe(
        'https://pbs.twimg.com/media/2nd?format=jpg&name=orig'
      );
      expect(window.open.mock.calls[3][0]).toBe(
        'https://pbs.twimg.com/media/1st?format=jpg&name=orig'
      );
    });

    it('画像URLでないURLを1つ渡したときもそのまま開く', () => {
      window.open = jest.fn();
      openImages(['https://twitter.com/tos']);
      expect(window.open.mock.calls.length).toBe(1);
      expect(window.open.mock.calls[0][0]).toBe('https://twitter.com/tos');
    });

    it('undefinedを1つ渡したとき開かない', () => {
      window.open = jest.fn();
      openImages([undefined]);
      expect(window.open.mock.calls.length).toBe(0);
    });

    it('URLとundefinedを混ぜたときURLだけ開いてundefinedは開かない', () => {
      window.open = jest.fn();
      openImages([
        'https://pbs.twimg.com/media/1st?format=jpg&name=orig',
        undefined,
        'https://twitter.com/tos',
        'https://pbs.twimg.com/media/2nd?format=jpg&name=orig',
      ]);
      expect(window.open.mock.calls.length).toBe(3);
      expect(window.open.mock.calls[0][0]).toBe(
        'https://pbs.twimg.com/media/2nd?format=jpg&name=orig'
      );
      expect(window.open.mock.calls[1][0]).toBe('https://twitter.com/tos');
      expect(window.open.mock.calls[2][0]).toBe(
        'https://pbs.twimg.com/media/1st?format=jpg&name=orig'
      );
    });

    it('要素0個の配列を渡したとき開かない', () => {
      window.open = jest.fn();
      openImages([]);
      expect(window.open.mock.calls.length).toBe(0);
    });
  });

  describe('getOptions', () => {
    it('初期設定を取得できる', () => {
      const expected = {};
      Object.keys(INITIAL_OPTIONS).forEach(key => {
        expected[key] = isTrue;
      });
      window.chrome = {
        runtime: {
          sendMessage: jest.fn((_, callback) => callback({ data: {} })),
        },
      };
      expect(getOptions()).resolves.toStrictEqual(expected);
    });

    it('設定した値を取得できる', () => {
      const expected = {};
      Object.keys(INITIAL_OPTIONS).forEach((key, i) => {
        expected[key] = i % 2 === 0 ? isTrue : isFalse;
      });
      window.chrome = {
        runtime: {
          sendMessage: jest.fn((_, callback) => callback({ data: expected })),
        },
      };
      return getOptions().then(options => {
        return expect(options).toStrictEqual(expected);
      });
    });

    it('設定が取得できなかったらreject', () => {
      const expected = {};
      Object.keys(INITIAL_OPTIONS).forEach(key => {
        expected[key] = isTrue;
      });
      window.chrome = {
        runtime: {
          sendMessage: jest.fn((_, callback) => callback({})),
        },
      };
      expect(getOptions()).rejects.toBeUndefined();
    });
  });
});
