// import * as main from '../src/main';

import { chrome } from 'jest-chrome';

import { ButtonSetter } from '../src/ButtonSetter';
import { ButtonSetterTweetDeck } from '../src/ButtonSetterTweetDeck';
import { OPTION_KEYS, initialOptionsBool } from '../src/constants';
import {
  collectUrlParams,
  downloadImage,
  formatUrl,
  getButtonSetter,
  getImageFilenameByUrl,
  onOriginalButtonClick,
  openImages,
  printException,
  setStyle,
  updateOptions,
} from '../src/utils';

const testParams = {
  protocol: 'https:',
  host: 'pbs.twimg.com',
  basename: 'hogefuga123',
  pathname: '/media/hogefuga123',
};
const makeTestBaseURL = () => {
  const { protocol, host, pathname } = testParams;
  return `${protocol}//${host}${pathname}`;
};
const makeResultParams = ({ format, name }) => {
  const { protocol, host, pathname } = testParams;
  return {
    protocol,
    host,
    pathname,
    format,
    name: name || null,
  };
};

describe('Utils', () => {
  describe('printException', () => {
    it('エラーメッセージの表示(予期せぬ状況の確認)', () => {
      /* eslint-disable no-console */
      console.log = jest.fn();
      printException('exception message');
      expect(console.log.mock.calls[0][0]).toBeInstanceOf(Error);
      /* eslint-enable no-console */
    });
  });

  describe('URLのツール', () => {
    // URLの変換のテストの場合たち
    const cases = [
      {
        title: '何もなし',
        url: `${makeTestBaseURL()}`,
        params: { format: 'jpg' },
        filename: `${testParams.basename}.jpg`,
      },
      {
        title: '.jpg',
        url: `${makeTestBaseURL()}.jpg`,
        params: { format: 'jpg' },
        filename: `${testParams.basename}.jpg`,
      },
      {
        title: '.png',
        url: `${makeTestBaseURL()}.png`,
        params: { format: 'png' },
        filename: `${testParams.basename}.png`,
      },
      {
        title: '.jpg:orig',
        url: `${makeTestBaseURL()}.jpg:orig`,
        params: { format: 'jpg', name: 'orig' },
        filename: `${testParams.basename}-orig.jpg`,
      },
      {
        title: '.jpg:large',
        url: `${makeTestBaseURL()}.jpg:large`,
        params: { format: 'jpg', name: 'large' },
        filename: `${testParams.basename}-large.jpg`,
      },
      {
        title: '?format=jpg',
        url: `${makeTestBaseURL()}?format=jpg`,
        params: { format: 'jpg' },
        filename: `${testParams.basename}.jpg`,
      },
      {
        title: '?format=png',
        url: `${makeTestBaseURL()}?format=png`,
        params: { format: 'png' },
        filename: `${testParams.basename}.png`,
      },
      {
        title: '.jpg?format=jpg',
        url: `${makeTestBaseURL()}.jpg?format=jpg`,
        params: { format: 'jpg' },
        filename: `${testParams.basename}.jpg`,
      },
      {
        title: '.jpg?format=png',
        url: `${makeTestBaseURL()}.jpg?format=png`,
        params: { format: 'jpg' },
        filename: `${testParams.basename}.jpg`,
      },
      {
        title: '.png?format=jpg',
        url: `${makeTestBaseURL()}.png?format=jpg`,
        params: { format: 'png' },
        filename: `${testParams.basename}.png`,
      },
      {
        title: '.jpg?name=large',
        url: `${makeTestBaseURL()}.jpg?name=large`,
        params: { format: 'jpg', name: 'large' },
        filename: `${testParams.basename}-large.jpg`,
      },
      {
        title: '?format=jpg&name=large',
        url: `${makeTestBaseURL()}?format=jpg&name=large`,
        params: { format: 'jpg', name: 'large' },
        filename: `${testParams.basename}-large.jpg`,
      },
      {
        title: '.png?format=jpg&name=orig',
        url: `${makeTestBaseURL()}.png?format=jpg&name=orig`,
        params: { format: 'png', name: 'orig' },
        filename: `${testParams.basename}-orig.png`,
      },
      {
        title: '?format=webp&name=4096x4096',
        url: `${makeTestBaseURL()}?format=webp&name=4096x4096`,
        params: { format: 'webp', name: '4096x4096' },
        filename: `${testParams.basename}-4096x4096.webp`,
      },
    ];

    describe('collectUrlParams 画像urlの要素を集める', () => {
      cases.forEach((singleCase) => {
        const { title, url, params } = singleCase;
        it(`${title}`, () => {
          expect(collectUrlParams(url)).toStrictEqual(makeResultParams(params));
        });
      });

      it('twitterの画像URLでないときnull', () => {
        expect(collectUrlParams('https://twitter.com/tos')).toBe(null);
      });
    });

    describe('formatUrl 画像URLを https～?format=〜&name=orig に揃える', () => {
      cases.forEach((singleCase) => {
        const { title, url, params } = singleCase;
        it(`${title}`, () => {
          if (params.format === 'webp') {
            expect(formatUrl(url)).toBe(
              `https://pbs.twimg.com/media/hogefuga123?format=${params.format}&name=4096x4096`,
            );
          } else {
            expect(formatUrl(url)).toBe(`https://pbs.twimg.com/media/hogefuga123?format=${params.format}&name=orig`);
          }
        });
      });

      it('twitterの画像URLでないときそのまま', () => {
        expect(formatUrl('https://twitter.com/tos')).toBe('https://twitter.com/tos');
      });

      it('空文字渡すと null が返る', () => {
        expect(formatUrl('')).toBeNull();
      });
    });

    describe('getImageFilenameByUrl 画像のファイル名をつくる', () => {
      cases.forEach((singleCase) => {
        const { title, url, filename } = singleCase;
        it(`${title}`, () => {
          expect(getImageFilenameByUrl(url)).toBe(filename);
        });
      });

      it('twitterの画像URLでないときnull', () => {
        expect(getImageFilenameByUrl('https://twitter.com/tos')).toBe(null);
      });
    });
  });

  describe('openImages 画像を開く', () => {
    it('画像URLを1つ渡したとき開く', () => {
      window.open = jest.fn();
      openImages(['https://pbs.twimg.com/media/1st?format=jpg&name=orig']);
      expect(window.open.mock.calls.length).toBe(1);
      expect(window.open.mock.calls[0][0]).toBe('https://pbs.twimg.com/media/1st?format=jpg&name=orig');
    });

    it('画像URLを2つ渡したとき逆順に開く', () => {
      window.open = jest.fn();
      openImages([
        'https://pbs.twimg.com/media/1st?format=jpg&name=orig',
        'https://pbs.twimg.com/media/2nd?format=jpg&name=orig',
      ]);
      expect(window.open.mock.calls.length).toBe(2);
      expect(window.open.mock.calls[0][0]).toBe('https://pbs.twimg.com/media/2nd?format=jpg&name=orig');
      expect(window.open.mock.calls[1][0]).toBe('https://pbs.twimg.com/media/1st?format=jpg&name=orig');
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
      expect(window.open.mock.calls[0][0]).toBe('https://pbs.twimg.com/media/4th?format=jpg&name=orig');
      expect(window.open.mock.calls[1][0]).toBe('https://pbs.twimg.com/media/3rd?format=jpg&name=orig');
      expect(window.open.mock.calls[2][0]).toBe('https://pbs.twimg.com/media/2nd?format=jpg&name=orig');
      expect(window.open.mock.calls[3][0]).toBe('https://pbs.twimg.com/media/1st?format=jpg&name=orig');
    });

    it('画像URLでないURLを1つ渡したときもそのまま開く', () => {
      window.open = jest.fn();
      openImages(['https://twitter.com/tos']);
      expect(window.open.mock.calls.length).toBe(1);
      expect(window.open.mock.calls[0][0]).toBe('https://twitter.com/tos');
    });

    it('空文字を1つ渡したとき開かない', () => {
      window.open = jest.fn();
      openImages(['']);
      expect(window.open.mock.calls.length).toBe(0);
    });

    it('URLとundefinedを混ぜたときURLだけ開いてundefinedは開かない', () => {
      window.open = jest.fn();
      openImages([
        'https://pbs.twimg.com/media/1st?format=jpg&name=orig',
        '',
        'https://twitter.com/tos',
        'https://pbs.twimg.com/media/2nd?format=jpg&name=orig',
      ]);
      expect(window.open.mock.calls.length).toBe(3);
      expect(window.open.mock.calls[0][0]).toBe('https://pbs.twimg.com/media/2nd?format=jpg&name=orig');
      expect(window.open.mock.calls[1][0]).toBe('https://twitter.com/tos');
      expect(window.open.mock.calls[2][0]).toBe('https://pbs.twimg.com/media/1st?format=jpg&name=orig');
    });

    it('要素0個の配列を渡したとき開かない', () => {
      window.open = jest.fn();
      openImages([]);
      expect(window.open.mock.calls.length).toBe(0);
    });
  });

  describe('updateOptions', () => {
    describe('Chrome拡張機能のとき', () => {
      chrome.runtime.id = 'mock';

      it('初期設定を取得できる', async () => {
        chrome.runtime.sendMessage.mockImplementation((_, callback) => callback({ data: initialOptionsBool }));
        await expect(updateOptions()).resolves.toStrictEqual(initialOptionsBool);
      });

      it('設定した値を取得できる', async () => {
        const expected = { ...initialOptionsBool };
        OPTION_KEYS.forEach((key, i) => {
          expected[key] = i % 2 === 0;
        });
        chrome.runtime.sendMessage.mockImplementation((_, callback) => callback({ data: { ...expected } }));
        await expect(updateOptions()).resolves.toStrictEqual(expected);
      });

      it('設定が取得できなかったら初期設定', async () => {
        chrome.runtime.sendMessage.mockImplementation((_, callback) => callback({}));
        await expect(updateOptions()).resolves.toStrictEqual(initialOptionsBool);
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

      it('初期設定を取得できる', async () => {
        await expect(updateOptions()).resolves.toStrictEqual(initialOptionsBool);
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

  describe('downloadImage 画像をダウンロードする', () => {
    let img;
    let event = {};
    beforeEach(() => {
      img = document.createElement('img');
      img.src = 'https://pbs.twimg.com/media/hogefuga123.jpg';
      document.querySelector('body').appendChild(img);

      event = {
        preventDefault: jest.fn(),
      };
    });
    afterEach(() => {
      img.parentNode.removeChild(img);
    });

    it('Ctrl-s', () => {
      event.ctrlKey = true;
      event.key = 's';
      downloadImage(event);
      // 便宜上event.preventDefaultまで到達したのでダウンロードされているはずとしてテスト
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });
    it('Cmd-s', () => {
      event.metaKey = true;
      event.key = 's';
      downloadImage(event);
      // 便宜上event.preventDefaultまで到達したのでダウンロードされているはずとしてテスト
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });
    it('ただのsなら何もしない', () => {
      event.key = 's';
      downloadImage(event);
      // 便宜上event.preventDefaultまで到達したのでダウンロードされているはずとしてテスト
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
    it('ただのCtrlなら何もしない', () => {
      event.ctrlKey = true;
      downloadImage(event);
      // 便宜上event.preventDefaultまで到達したのでダウンロードされているはずとしてテスト
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
    it('ただのCmdなら何もしない', () => {
      event.metaKey = true;
      downloadImage(event);
      // 便宜上event.preventDefaultまで到達したのでダウンロードされているはずとしてテスト
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
    it('imgのsrcがないときCtrl-sしても何もしない', () => {
      img.src = '';

      event.ctrlKey = true;
      event.key = 's';
      downloadImage(event);
      // 便宜上event.preventDefaultまで到達したのでダウンロードされているはずとしてテスト
      expect(event.preventDefault).not.toHaveBeenCalled();
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

    describe('古いTweetDeckではButtonSetterTweetDeck', () => {
      it('tweetdeck.twitter.com', () => {
        window.location = new URL('https://tweetdeck.twitter.com');
        expect(getButtonSetter()).toBeInstanceOf(ButtonSetterTweetDeck);
      });
      it('pro.twitter.com', () => {
        window.location = new URL('https://pro.twitter.com');
        expect(getButtonSetter()).toBeInstanceOf(ButtonSetterTweetDeck);
      });
    });
    it('公式WebではButtonSetter', () => {
      window.location = new URL('https://twitter.com');
      expect(getButtonSetter()).toBeInstanceOf(ButtonSetter);
    });
    it('公式Web(モバイル版)ではButtonSetter', () => {
      window.location = new URL('https://mobile.twitter.com');
      expect(getButtonSetter()).toBeInstanceOf(ButtonSetter);
    });
    describe('新しいTweetDeckではButtonSetter', () => {
      it('tweetdeck.twitter.com', () => {
        window.location = new URL('https://tweetdeck.twitter.com');
        document.querySelector('body').insertAdjacentHTML('beforeend', '<div id="react-root"></div>');
        expect(getButtonSetter()).toBeInstanceOf(ButtonSetter);
      });
      it('pro.twitter.com', () => {
        window.location = new URL('https://pro.twitter.com');
        document.querySelector('body').insertAdjacentHTML('beforeend', '<div id="react-root"></div>');
        expect(getButtonSetter()).toBeInstanceOf(ButtonSetter);
      });
    });
    it('どちらでもなかったらButtonSetter', () => {
      window.location = new URL('https://hoge.test');
      expect(getButtonSetter()).toBeInstanceOf(ButtonSetter);
    });
  });
});
