export interface Options {
  // 公式Web
  SHOW_ON_TIMELINE: TooiBoolean;
  SHOW_ON_TWEET_DETAIL: TooiBoolean;
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: TooiBoolean;
  SHOW_ON_TWEETDECK_TWEET_DETAIL: TooiBoolean;
  // 画像ページ
  STRIP_IMAGE_SUFFIX: TooiBoolean;
}

export type OptionsMaybe = { [key in keyof Options]?: TooiBoolean };

/**
 * userjs 用の設定項目
 * 'isfalse' とすると、その設定がオフになる
 */
export const userjsOptions: Options = {
  // 公式Web
  SHOW_ON_TIMELINE: 'istrue',
  SHOW_ON_TWEET_DETAIL: 'istrue',
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: 'istrue',
  SHOW_ON_TWEETDECK_TWEET_DETAIL: 'istrue',
  // 画像ページ
  STRIP_IMAGE_SUFFIX: 'istrue',
};

// 設定取得メッセージ
export const OPTION_UPDATED = 'OPTION_UPDATED';
export const GET_LOCAL_STORAGE = 'GET_LOCAL_STORAGE';

// 公式Web
export const HOST_TWITTER_COM = 'twitter.com';
export const HOST_MOBILE_TWITTER_COM = 'mobile.twitter.com';
export const SHOW_ON_TIMELINE = 'SHOW_ON_TIMELINE';
export const SHOW_ON_TWEET_DETAIL = 'SHOW_ON_TWEET_DETAIL';
// TweetDeck
export const HOST_TWEETDECK_TWITTER_COM = 'tweetdeck.twitter.com';
export const SHOW_ON_TWEETDECK_TIMELINE = 'SHOW_ON_TWEETDECK_TIMELINE';
export const SHOW_ON_TWEETDECK_TWEET_DETAIL = 'SHOW_ON_TWEETDECK_TWEET_DETAIL';
// 画像ページ
export const HOST_PBS_TWIMG_COM = 'pbs.twimg.com';
export const STRIP_IMAGE_SUFFIX = 'STRIP_IMAGE_SUFFIX';

/** 公式Webかどうか */
export const isTwitter = (): boolean =>
  window.location.hostname === HOST_TWITTER_COM ||
  window.location.hostname === HOST_MOBILE_TWITTER_COM;
/** Tweetdeckかどうか */
export const isTweetdeck = (): boolean =>
  window.location.hostname === HOST_TWEETDECK_TWITTER_COM;
/** 画像ページかどうか */
export const isImageTab = (): boolean =>
  window.location.hostname === HOST_PBS_TWIMG_COM;

/** これ自体がChrome拡張機能かどうか */
export const isNativeChromeExtension = (): boolean =>
  window.chrome !== undefined &&
  window.chrome.runtime !== undefined &&
  window.chrome.runtime.id !== undefined;

// 設定

// 設定に使う真偽値
export const isTrue = 'istrue';
export const isFalse = 'isfalse';
type TooiBoolean = typeof isTrue | typeof isFalse;

export const OPTION_KEYS = [
  SHOW_ON_TIMELINE,
  SHOW_ON_TWEET_DETAIL,
  SHOW_ON_TWEETDECK_TIMELINE,
  SHOW_ON_TWEETDECK_TWEET_DETAIL,
  STRIP_IMAGE_SUFFIX,
] as const;
export const OPTIONS_TEXT: { [key in keyof Options]: string } = {
  // 公式Web
  SHOW_ON_TIMELINE: 'タイムラインにボタンを表示',
  SHOW_ON_TWEET_DETAIL: 'ツイート詳細にボタンを表示',
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: 'タイムラインにボタンを表示',
  SHOW_ON_TWEETDECK_TWEET_DETAIL: 'ツイート詳細にボタンを表示',
  // 画像ページ
  STRIP_IMAGE_SUFFIX: '[Ctrl]+[s]で拡張子を校正',
};