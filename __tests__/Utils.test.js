import * as main from '../src/main';
const {
  isTrue,
  isFalse,
  OPTION_KEYS,
  printException,
  collectUrlParams,
  formatUrl,
  openImages,
  getOptions,
  setStyle,
  onOriginalButtonClick,
  getButtonSetter,
  ButtonSetter,
  ButtonSetterTweetDeck,
} = main;

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
            `https://pbs.twimg.com/media/hogefuga123?format=${params.format}&name=orig`
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
    describe('Chrome拡張機能のとき', () => {
      const originalChrome = window.chrome;
      beforeAll(() => {
        delete window.chrome;
        window.chrome = { runtime: { id: 'id' } };
      });
      afterAll(() => {
        window.chrome = originalChrome;
      });

      it('初期設定を取得できる', () => {
        const expected = {};
        OPTION_KEYS.forEach(key => {
          expected[key] = isTrue;
        });
        window.chrome.runtime.sendMessage = jest.fn((_, callback) =>
          callback({ data: {} })
        );
        expect(getOptions()).resolves.toStrictEqual(expected);
      });

      it('設定した値を取得できる', () => {
        const expected = {};
        OPTION_KEYS.forEach((key, i) => {
          expected[key] = i % 2 === 0 ? isTrue : isFalse;
        });
        window.chrome.runtime.sendMessage = jest.fn((_, callback) =>
          callback({ data: { ...expected } })
        );
        return getOptions().then(options => {
          return expect(options).toStrictEqual(expected);
        });
      });

      it('設定が取得できなかったらreject', () => {
        const expected = {};
        OPTION_KEYS.forEach(key => {
          expected[key] = isTrue;
        });
        window.chrome.runtime.sendMessage = jest.fn((_, callback) =>
          callback({})
        );
        expect(getOptions()).rejects.toBeUndefined();
      });
    });

    describe('Chrome拡張機能でないとき', () => {
      const originalChrome = window.chrome;
      beforeAll(() => {
        delete window.chrome;
        window.chrome = undefined;
      });
      afterAll(() => {
        window.chrome = originalChrome;
      });

      it('初期設定を取得できる', () => {
        const expected = {};
        OPTION_KEYS.forEach(key => {
          expected[key] = isFalse;
        });
        expect(getOptions()).resolves.toStrictEqual(expected);
      });
    });
  });

  describe('setStyle DOM要素にスタイルを当てる', () => {
    it('スタイル当たる', () => {
      const div = document.createElement('div');
      expect(div).toMatchSnapshot();
      setStyle(div, {
        display: 'none',
        color: '#123',
        'background-color': 'rgba(12, 34, 56, 0.7)',
      });
      expect(div).toMatchSnapshot();
    });
    it('空のスタイル渡すと何もしない', () => {
      const div = document.createElement('div');
      expect(div).toMatchSnapshot();
      setStyle(div, {});
      expect(div).toMatchSnapshot();
    });
    it('すでにあるスタイルは上書きされるが消えることはない', () => {
      const div = document.createElement('div');
      div.style.color = '#456';
      div.style.backgroundColor = '#789abc';
      div.style.fontSize = '150px';
      expect(div).toMatchSnapshot();
      setStyle(div, {
        display: 'none',
        color: '#123',
        'background-color': 'rgba(12, 34, 56, 0.7)',
      });
      expect(div).toMatchSnapshot();
    });
  });

  describe('onOriginalButtonClick ボタンがクリックされたときのコールバック', () => {
    it('イベントを止める', () => {
      /* SKIP: なぜかうまくmockできないので飛ばす */
      // jest.spyOn(main, 'openImages');

      const event = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      };
      const imgSrcs = ['src1', 'src2'];
      onOriginalButtonClick(event, imgSrcs);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(event.stopPropagation).toHaveBeenCalledTimes(1);

      // expect(openImages).toHaveBeenCalledTimes(1);
      // expect(openImages.mock.calls[0][0]).toStrictEqual(imgSrcs);
    });
  });

  describe('getButtonSetter ボタン設置するクラスのゲッタ', () => {
    const originalLocation = window.location;
    beforeAll(() => {
      delete window.location;
    });
    afterAll(() => {
      window.location = originalLocation;
    });

    it('公式WebではButtonSetter', () => {
      window.location = new URL('https://twitter.com');
      expect(getButtonSetter()).toBeInstanceOf(ButtonSetter);
    });
    it('TweetDeckではButtonSetterTweetDeck', () => {
      window.location = new URL('https://tweetdeck.twitter.com');
      expect(getButtonSetter()).toBeInstanceOf(ButtonSetterTweetDeck);
    });
    it('どちらでもなかったらButtonSetter', () => {
      window.location = new URL('https://hoge.test');
      expect(getButtonSetter()).toBeInstanceOf(ButtonSetter);
    });
  });
});
