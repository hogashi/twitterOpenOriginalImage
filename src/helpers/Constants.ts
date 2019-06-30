// 定数

// 設定取得メッセージ
export const OPTION_UPDATED = 'OPTION_UPDATED';
export const GET_LOCAL_STORAGE = 'GET_LOCAL_STORAGE';

// 公式Web
export const HOST_TWITTER_COM = 'twitter.com';
export const SHOW_ON_TIMELINE = 'SHOW_ON_TIMELINE';
export const SHOW_ON_TWEET_DETAIL = 'SHOW_ON_TWEET_DETAIL';
// TweetDeck
export const HOST_TWEETDECK_TWITTER_COM = 'tweetdeck.twitter.com';
export const SHOW_ON_TWEETDECK_TIMELINE = 'SHOW_ON_TWEETDECK_TIMELINE';
export const SHOW_ON_TWEETDECK_TWEET_DETAIL = 'SHOW_ON_TWEETDECK_TWEET_DETAIL';
// 画像ページ
export const HOST_PBS_TWIMG_COM = 'pbs.twimg.com';
export const STRIP_IMAGE_SUFFIX = 'STRIP_IMAGE_SUFFIX';

// 設定

// 設定に使う真偽値
export const isTrue = 'istrue';
export const isFalse = 'isfalse';
export type TooiBoolean = 'istrue' | 'isfalse';

// 設定項目の初期値は「無効」(最初のボタン表示が早過ぎる/一旦表示すると消さないため)
// 有効だった場合はDOMが変更される間に設定が読み込まれて有効になる
// 無効だった場合はそのままボタンは表示されない
export interface Options {
  // 公式Web
  SHOW_ON_TIMELINE: TooiBoolean,
  SHOW_ON_TWEET_DETAIL: TooiBoolean,
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: TooiBoolean,
  SHOW_ON_TWEETDECK_TWEET_DETAIL: TooiBoolean,
  // 画像ページ
  STRIP_IMAGE_SUFFIX: TooiBoolean,
}
export type OptionsMaybe = { [key in keyof Options]?: TooiBoolean };
export const INITIAL_OPTIONS: Options = {
  // 公式Web
  SHOW_ON_TIMELINE: isFalse,
  SHOW_ON_TWEET_DETAIL: isFalse,
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: isFalse,
  SHOW_ON_TWEETDECK_TWEET_DETAIL: isFalse,
  // 画像ページ
  STRIP_IMAGE_SUFFIX: isFalse,
};
export const OPTIONS_TEXT: { [key: string]: string } = {
  // 公式Web
  SHOW_ON_TIMELINE: 'タイムラインにボタンを表示',
  SHOW_ON_TWEET_DETAIL: 'ツイート詳細にボタンを表示',
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: 'タイムラインにボタンを表示',
  SHOW_ON_TWEETDECK_TWEET_DETAIL: 'ツイート詳細にボタンを表示',
  // 画像ページ
  STRIP_IMAGE_SUFFIX: '[Ctrl]+[s]で拡張子を校正',
};
