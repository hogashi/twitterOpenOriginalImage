// 定数

// 設定取得メッセージ
export const OPTION_UPDATED    = 'OPTION_UPDATED';
export const GET_LOCAL_STORAGE = 'GET_LOCAL_STORAGE';

// 公式Web
export const HOST_TWITTER_COM     = 'twitter.com';
export const OPEN_WITH_KEY_PRESS  = 'OPEN_WITH_KEY_PRESS';
export const SHOW_ON_TIMELINE     = 'SHOW_ON_TIMELINE';
export const SHOW_ON_TWEET_DETAIL = 'SHOW_ON_TWEET_DETAIL';
// TweetDeck
export const HOST_TWEETDECK_TWITTER_COM     = 'tweetdeck.twitter.com';
export const SHOW_ON_TWEETDECK_TIMELINE     = 'SHOW_ON_TWEETDECK_TIMELINE';
export const SHOW_ON_TWEETDECK_TWEET_DETAIL = 'SHOW_ON_TWEETDECK_TWEET_DETAIL';
// 画像ページ
export const STRIP_IMAGE_SUFFIX = 'STRIP_IMAGE_SUFFIX';

// 設定

// 設定に使う真偽値
export const isTrue  = 'istrue';
export const isFalse = 'isfalse';

// 設定項目の初期値は「無効」(最初のボタン表示が早過ぎる/一旦表示すると消さないため)
// 有効だった場合はDOMが変更される間に設定が読み込まれて有効になる
// 無効だった場合はそのままボタンは表示されない
export interface Options {
  [key: string]: string;
}
export const INITIAL_OPTIONS = {
  // 公式Web
  OPEN_WITH_KEY_PRESS: isFalse,
  SHOW_ON_TIMELINE: isFalse,
  SHOW_ON_TWEET_DETAIL: isFalse,
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: isFalse,
  SHOW_ON_TWEETDECK_TWEET_DETAIL: isFalse,
  // 画像ページ
  STRIP_IMAGE_SUFFIX: isFalse,
};