import {
  OPTION_UPDATED,
  GET_LOCAL_STORAGE,
  HOST_TWITTER_COM,
  SHOW_ON_TIMELINE,
  SHOW_ON_TWEET_DETAIL,
  HOST_TWEETDECK_TWITTER_COM,
  SHOW_ON_TWEETDECK_TIMELINE,
  SHOW_ON_TWEETDECK_TWEET_DETAIL,
  HOST_PBS_TWIMG_COM,
  STRIP_IMAGE_SUFFIX,
  isTrue,
  isFalse,
  OPTION_KEYS,
  OPTIONS_TEXT,
  options,
  isTwitter,
  isTweetdeck,
  isImageTab,
  isNativeChromeExtension,
} from '../src/main';

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
    expect(SHOW_ON_TWEETDECK_TIMELINE).toBe('SHOW_ON_TWEETDECK_TIMELINE');
    expect(SHOW_ON_TWEETDECK_TWEET_DETAIL).toBe(
      'SHOW_ON_TWEETDECK_TWEET_DETAIL'
    );
  });

  it('画像ページ', () => {
    expect(HOST_PBS_TWIMG_COM).toBe('pbs.twimg.com');
    expect(STRIP_IMAGE_SUFFIX).toBe('STRIP_IMAGE_SUFFIX');
  });

  it('設定に使う真偽値', () => {
    expect(isTrue).toBe('istrue');
    expect(isFalse).toBe('isfalse');
  });

  it('設定項目の初期値', () => {
    // 設定項目の初期値は「無効」(最初のボタン表示が早過ぎる/一旦表示すると消さないため)
    // 有効だった場合はDOMが変更される間に設定が読み込まれて有効になる
    // 無効だった場合はそのままボタンは表示されない
    expect(options).toStrictEqual({
      // 公式Web
      SHOW_ON_TIMELINE: 'isfalse',
      SHOW_ON_TWEET_DETAIL: 'isfalse',
      // TweetDeck
      SHOW_ON_TWEETDECK_TIMELINE: 'isfalse',
      SHOW_ON_TWEETDECK_TWEET_DETAIL: 'isfalse',
      // 画像ページ
      STRIP_IMAGE_SUFFIX: 'isfalse',
    });

    expect(OPTION_KEYS).toStrictEqual([
      SHOW_ON_TIMELINE,
      SHOW_ON_TWEET_DETAIL,
      SHOW_ON_TWEETDECK_TIMELINE,
      SHOW_ON_TWEETDECK_TWEET_DETAIL,
      STRIP_IMAGE_SUFFIX,
    ]);

    expect(OPTIONS_TEXT).toStrictEqual({
      // 公式Web
      SHOW_ON_TIMELINE: 'タイムラインにボタンを表示',
      SHOW_ON_TWEET_DETAIL: 'ツイート詳細にボタンを表示',
      // TweetDeck
      SHOW_ON_TWEETDECK_TIMELINE: 'タイムラインにボタンを表示',
      SHOW_ON_TWEETDECK_TWEET_DETAIL: 'ツイート詳細にボタンを表示',
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
    it('TweetDeck', () => {
      window.location = new URL('https://tweetdeck.twitter.com');
      expect(isTwitter()).toBeFalsy();
      expect(isTweetdeck()).toBeTruthy();
      expect(isImageTab()).toBeFalsy();
    });
    it('画像ページ', () => {
      window.location = new URL('https://pbs.twimg.com');
      expect(isTwitter()).toBeFalsy();
      expect(isTweetdeck()).toBeFalsy();
      expect(isImageTab()).toBeTruthy();
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
