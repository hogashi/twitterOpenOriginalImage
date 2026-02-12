/**
 * 設定項目
 */

// 設定取得メッセージ
export const OPTION_UPDATED = 'OPTION_UPDATED';
export const GET_LOCAL_STORAGE = 'GET_LOCAL_STORAGE';

// 公式Web
export const HOST_TWITTER_COM = 'twitter.com';
export const HOST_MOBILE_TWITTER_COM = 'mobile.twitter.com';
export const HOST_X_COM = 'x.com';
export const HOST_MOBILE_X_COM = 'mobile.x.com';
export const SHOW_ON_TIMELINE = 'SHOW_ON_TIMELINE';
export const SHOW_ON_TWEET_DETAIL = 'SHOW_ON_TWEET_DETAIL';
// TweetDeck
export const HOST_TWEETDECK_TWITTER_COM = 'tweetdeck.twitter.com';
export const HOST_PRO_TWITTER_COM = 'pro.twitter.com';
export const HOST_PRO_X_COM = 'pro.x.com';
export const SHOW_ON_TWEETDECK_TIMELINE = 'SHOW_ON_TWEETDECK_TIMELINE';
export const SHOW_ON_TWEETDECK_TWEET_DETAIL = 'SHOW_ON_TWEETDECK_TWEET_DETAIL';

// Originalボタンのテキスト
export const ORIGINAL_BUTTON_TEXT_OPTION_KEY = 'ORIGINAL_BUTTON_TEXT_OPTION_KEY';
export const INITIAL_ORIGINAL_BUTTON_TEXT = 'Original';

export interface OptionsBool {
  // 公式Web
  SHOW_ON_TIMELINE: boolean;
  SHOW_ON_TWEET_DETAIL: boolean;
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: boolean;
  SHOW_ON_TWEETDECK_TWEET_DETAIL: boolean;
  // Originalボタンのテキスト
  ORIGINAL_BUTTON_TEXT_OPTION_KEY: string;
}

// インストールした直後の初期値
export const initialOptionsBool: OptionsBool = {
  // 公式Web
  SHOW_ON_TIMELINE: true,
  SHOW_ON_TWEET_DETAIL: true,
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: true,
  SHOW_ON_TWEETDECK_TWEET_DETAIL: true,
  // Originalボタンのテキスト
  ORIGINAL_BUTTON_TEXT_OPTION_KEY: INITIAL_ORIGINAL_BUTTON_TEXT,
};

export const OPTION_KEYS = [
  SHOW_ON_TIMELINE,
  SHOW_ON_TWEET_DETAIL,
  SHOW_ON_TWEETDECK_TIMELINE,
  SHOW_ON_TWEETDECK_TWEET_DETAIL,
  ORIGINAL_BUTTON_TEXT_OPTION_KEY,
] as const;
export const OPTIONS_TEXT: { [key in keyof OptionsBool]: string } = {
  // 公式Web
  SHOW_ON_TIMELINE: 'タイムライン',
  SHOW_ON_TWEET_DETAIL: '(旧表示で)ツイート詳細',
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: 'タイムライン',
  SHOW_ON_TWEETDECK_TWEET_DETAIL: '(旧表示で)ツイート詳細',
  // Originalボタンのテキスト
  ORIGINAL_BUTTON_TEXT_OPTION_KEY: 'ボタンのテキスト',
};

/** 公式Webかどうか */
export const isTwitter = (location: Location | URL = window.location): boolean =>
  location.hostname === HOST_TWITTER_COM ||
  location.hostname === HOST_MOBILE_TWITTER_COM ||
  location.hostname === HOST_X_COM ||
  location.hostname === HOST_MOBILE_X_COM;
/** Tweetdeckかどうか */
export const isTweetdeck = (location: Location | URL = window.location): boolean =>
  location.hostname === HOST_TWEETDECK_TWITTER_COM ||
  location.hostname === HOST_PRO_TWITTER_COM ||
  location.hostname === HOST_PRO_X_COM;

/** Reactビューかどうか */
export const isReactView = (): boolean => !!document.getElementById('react-root');

/** これ自体がChrome拡張機能かどうか */
export const isNativeChromeExtension = (): boolean => chrome?.runtime?.id !== undefined;

// chrome.storateへの移行が済んだかどうかのキー
export const MIGRATED_TO_CHROME_STORAGE = 'MIGRATED_TO_CHROME_STORAGE';
