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
export const HOST_PRO_TWITTER_COM = 'pro.twitter.com';
export const SHOW_ON_TWEETDECK_TIMELINE = 'SHOW_ON_TWEETDECK_TIMELINE';
export const SHOW_ON_TWEETDECK_TWEET_DETAIL = 'SHOW_ON_TWEETDECK_TWEET_DETAIL';

/**
 * 設定項目
 */
export interface OptionsBool {
  // 公式Web
  SHOW_ON_TIMELINE: boolean;
  SHOW_ON_TWEET_DETAIL: boolean;
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: boolean;
  SHOW_ON_TWEETDECK_TWEET_DETAIL: boolean;
}

export const initialOptionsBool: OptionsBool = {
  // 公式Web
  SHOW_ON_TIMELINE: true,
  SHOW_ON_TWEET_DETAIL: true,
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: true,
  SHOW_ON_TWEETDECK_TWEET_DETAIL: true,
};

export const OPTION_KEYS = [
  SHOW_ON_TIMELINE,
  SHOW_ON_TWEET_DETAIL,
  SHOW_ON_TWEETDECK_TIMELINE,
  SHOW_ON_TWEETDECK_TWEET_DETAIL,
] as const;
export const OPTIONS_TEXT: { [key in keyof OptionsBool]: string } = {
  // 公式Web
  SHOW_ON_TIMELINE: 'タイムライン',
  SHOW_ON_TWEET_DETAIL: '(旧表示で)ツイート詳細',
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: 'タイムライン',
  SHOW_ON_TWEETDECK_TWEET_DETAIL: '(旧表示で)ツイート詳細',
};

/** 公式Webかどうか */
export const isTwitter = (): boolean =>
  window.location.hostname === HOST_TWITTER_COM || window.location.hostname === HOST_MOBILE_TWITTER_COM;
/** Tweetdeckかどうか */
export const isTweetdeck = (): boolean =>
  window.location.hostname === HOST_TWEETDECK_TWITTER_COM || window.location.hostname === HOST_PRO_TWITTER_COM;

/** Reactビューかどうか */
export const isReactView = (): boolean => !!document.getElementById('react-root');

/** これ自体がChrome拡張機能かどうか */
export const isNativeChromeExtension = (): boolean => chrome?.runtime?.id !== undefined;

// chrome.storateへの移行が済んだかどうかのキー
export const MIGRATED_TO_CHROME_STORAGE = 'MIGRATED_TO_CHROME_STORAGE';
