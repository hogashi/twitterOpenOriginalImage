import {
  GET_LOCAL_STORAGE,
  HOST_PBS_TWIMG_COM,
  HOST_PRO_TWITTER_COM,
  HOST_TWEETDECK_TWITTER_COM,
  HOST_TWITTER_COM,
  OPTIONS_TEXT,
  OPTION_KEYS,
  OPTION_UPDATED,
  SHOW_ON_TIMELINE,
  SHOW_ON_TWEETDECK_TIMELINE,
  SHOW_ON_TWEETDECK_TWEET_DETAIL,
  SHOW_ON_TWEET_DETAIL,
  STRIP_IMAGE_SUFFIX,
  initialOptions,
  isFalse,
  isImageTab,
  isNativeChromeExtension,
  isReactView,
  isTrue,
  isTweetdeck,
  isTwitter,
} from '../src/constants';

describe('定数', () => {
  it('設定取得メッセージ', () => {
    expect(OPTION_UPDATED).toBe('OPTION_UPDATED');
    expect(GET_LOCAL_STORAGE).toBe('GET_LOCAL_STORAGE');
  });

  it('公式Web', () => {
    expect(HOST_TWITTER_COM).toBe('twitter.com');
    expect(SHOW_ON_TIMELINE).toBe('SHOW_ON_TIMELINE');
    expect(SHOW_ON_TWEET_DETAIL).toBe('SHOW_ON_TWEET_DETAIL');
  });

  it('TweetDeck', () => {
    expect(HOST_TWEETDECK_TWITTER_COM).toBe('tweetdeck.twitter.com');
    expect(HOST_PRO_TWITTER_COM).toBe('pro.twitter.com');
    expect(SHOW_ON_TWEETDECK_TIMELINE).toBe('SHOW_ON_TWEETDECK_TIMELINE');
    expect(SHOW_ON_TWEETDECK_TWEET_DETAIL).toBe('SHOW_ON_TWEETDECK_TWEET_DETAIL');
  });

  it('画像ページ', () => {
    expect(HOST_PBS_TWIMG_COM).toBe('pbs.twimg.com');
    expect(STRIP_IMAGE_SUFFIX).toBe('STRIP_IMAGE_SUFFIX');
  });

  it('設定に使う真偽値', () => {
    expect(isTrue).toBe('istrue');
    expect(isFalse).toBe('isfalse');
  });

  it('userjs用の設定項目の初期値は全部真', () => {
    expect(initialOptions).toStrictEqual({
      // 公式Web
      SHOW_ON_TIMELINE: isTrue,
      SHOW_ON_TWEET_DETAIL: isTrue,
      // TweetDeck
      SHOW_ON_TWEETDECK_TIMELINE: isTrue,
      SHOW_ON_TWEETDECK_TWEET_DETAIL: isTrue,
      // 画像ページ
      STRIP_IMAGE_SUFFIX: isTrue,
    });

    expect(OPTION_KEYS).toStrictEqual([
      SHOW_ON_TIMELINE,
      SHOW_ON_TWEET_DETAIL,
      SHOW_ON_TWEETDECK_TIMELINE,
      SHOW_ON_TWEETDECK_TWEET_DETAIL,
      STRIP_IMAGE_SUFFIX,
    ]);

    expect(OPTIONS_TEXT).toStrictEqual({
      SHOW_ON_TIMELINE: 'タイムライン',
      SHOW_ON_TWEET_DETAIL: '(旧表示で)ツイート詳細',
      // TweetDeck
      SHOW_ON_TWEETDECK_TIMELINE: 'タイムライン',
      SHOW_ON_TWEETDECK_TWEET_DETAIL: '(旧表示で)ツイート詳細',
      // 画像ページ
      STRIP_IMAGE_SUFFIX: '[Ctrl]+[s]で拡張子を校正',
    });
  });

  describe('どのページかのフラグ', () => {
    const originalLocation = window.location;
    beforeAll(() => {
      delete window.location;
    });
    afterAll(() => {
      window.location = originalLocation;
    });

    it('公式Web', () => {
      window.location = new URL('https://twitter.com');
      expect(isTwitter()).toBeTruthy();
      expect(isTweetdeck()).toBeFalsy();
      expect(isImageTab()).toBeFalsy();
    });
    describe('TweetDeck', () => {
      it('tweetdeck.twitter.com', () => {
        window.location = new URL('https://tweetdeck.twitter.com');
        expect(isTwitter()).toBeFalsy();
        expect(isTweetdeck()).toBeTruthy();
        expect(isImageTab()).toBeFalsy();
      });
      it('pro.twitter.com', () => {
        window.location = new URL('https://pro.twitter.com');
        expect(isTwitter()).toBeFalsy();
        expect(isTweetdeck()).toBeTruthy();
        expect(isImageTab()).toBeFalsy();
      });
    });
    it('画像ページ', () => {
      window.location = new URL('https://pbs.twimg.com');
      expect(isTwitter()).toBeFalsy();
      expect(isTweetdeck()).toBeFalsy();
      expect(isImageTab()).toBeTruthy();
    });
  });

  describe('Reactビューかどうかのフラグ', () => {
    it('isReactView', () => {
      expect(isReactView()).toBeFalsy();
      document.querySelector('body').insertAdjacentHTML('beforeend', '<div id="react-root"></div>');
      expect(isReactView()).toBeTruthy();
    });
  });

  describe('Chrome拡張機能かのフラグ', () => {
    const originalChrome = window.chrome;
    beforeAll(() => {
      delete window.chrome;
    });
    afterAll(() => {
      window.chrome = originalChrome;
    });

    it('Chrome拡張機能のとき真', () => {
      window.chrome = { runtime: { id: 'id' } };
      expect(isNativeChromeExtension()).toBeTruthy();
    });
    it('Chrome拡張機能でないとき偽', () => {
      window.chrome = undefined;
      expect(isNativeChromeExtension()).toBeFalsy();
      window.chrome = {};
      expect(isNativeChromeExtension()).toBeFalsy();
      window.chrome = { runtime: {} };
      expect(isNativeChromeExtension()).toBeFalsy();
    });
  });
});
