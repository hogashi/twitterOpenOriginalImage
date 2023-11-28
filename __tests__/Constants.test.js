import {
  GET_LOCAL_STORAGE,
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
  ORIGINAL_BUTTON_TEXT_OPTION_KEY,
  INITIAL_ORIGINAL_BUTTON_TEXT,
  initialOptionsBool,
  isNativeChromeExtension,
  isReactView,
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

  it('初期設定', () => {
    expect(initialOptionsBool).toStrictEqual({
      SHOW_ON_TIMELINE: true,
      SHOW_ON_TWEET_DETAIL: true,
      SHOW_ON_TWEETDECK_TIMELINE: true,
      SHOW_ON_TWEETDECK_TWEET_DETAIL: true,
      ORIGINAL_BUTTON_TEXT_OPTION_KEY: INITIAL_ORIGINAL_BUTTON_TEXT,
    });
  });

  it('設定ページの設定ごとのキーと日本語', () => {
    expect(OPTION_KEYS).toStrictEqual([
      SHOW_ON_TIMELINE,
      SHOW_ON_TWEET_DETAIL,
      SHOW_ON_TWEETDECK_TIMELINE,
      SHOW_ON_TWEETDECK_TWEET_DETAIL,
      ORIGINAL_BUTTON_TEXT_OPTION_KEY,
    ]);

    expect(OPTIONS_TEXT).toStrictEqual({
      SHOW_ON_TIMELINE: 'タイムライン',
      SHOW_ON_TWEET_DETAIL: '(旧表示で)ツイート詳細',
      SHOW_ON_TWEETDECK_TIMELINE: 'タイムライン',
      SHOW_ON_TWEETDECK_TWEET_DETAIL: '(旧表示で)ツイート詳細',
      ORIGINAL_BUTTON_TEXT_OPTION_KEY: 'ボタンのテキスト',
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
    });
    describe('TweetDeck', () => {
      it('tweetdeck.twitter.com', () => {
        window.location = new URL('https://tweetdeck.twitter.com');
        expect(isTwitter()).toBeFalsy();
        expect(isTweetdeck()).toBeTruthy();
      });
      it('pro.twitter.com', () => {
        window.location = new URL('https://pro.twitter.com');
        expect(isTwitter()).toBeFalsy();
        expect(isTweetdeck()).toBeTruthy();
      });
    });
    it('画像ページ', () => {
      window.location = new URL('https://pbs.twimg.com');
      expect(isTwitter()).toBeFalsy();
      expect(isTweetdeck()).toBeFalsy();
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
