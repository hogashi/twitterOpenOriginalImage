/**
 * Constants */
// 定数

// 設定取得メッセージ
const OPTION_UPDATED = 'OPTION_UPDATED';
const GET_LOCAL_STORAGE = 'GET_LOCAL_STORAGE';

// 公式Web
const HOST_TWITTER_COM = 'twitter.com';
const SHOW_ON_TIMELINE = 'SHOW_ON_TIMELINE';
const SHOW_ON_TWEET_DETAIL = 'SHOW_ON_TWEET_DETAIL';
// TweetDeck
const HOST_TWEETDECK_TWITTER_COM = 'tweetdeck.twitter.com';
const SHOW_ON_TWEETDECK_TIMELINE = 'SHOW_ON_TWEETDECK_TIMELINE';
const SHOW_ON_TWEETDECK_TWEET_DETAIL = 'SHOW_ON_TWEETDECK_TWEET_DETAIL';
// 画像ページ
const HOST_PBS_TWIMG_COM = 'pbs.twimg.com';
const STRIP_IMAGE_SUFFIX = 'STRIP_IMAGE_SUFFIX';

// 設定

// 設定に使う真偽値
const isTrue = 'istrue';
const isFalse = 'isfalse';
type TooiBoolean = 'istrue' | 'isfalse';

// 設定項目の初期値は「無効」(最初のボタン表示が早過ぎる/一旦表示すると消さないため)
// 有効だった場合はDOMが変更される間に設定が読み込まれて有効になる
// 無効だった場合はそのままボタンは表示されない
interface Options {
  // 公式Web
  SHOW_ON_TIMELINE: TooiBoolean;
  SHOW_ON_TWEET_DETAIL: TooiBoolean;
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: TooiBoolean;
  SHOW_ON_TWEETDECK_TWEET_DETAIL: TooiBoolean;
  // 画像ページ
  STRIP_IMAGE_SUFFIX: TooiBoolean;
}
type OptionsMaybe = { [key in keyof Options]?: TooiBoolean };
const INITIAL_OPTIONS: Options = {
  // 公式Web
  SHOW_ON_TIMELINE: isFalse,
  SHOW_ON_TWEET_DETAIL: isFalse,
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: isFalse,
  SHOW_ON_TWEETDECK_TWEET_DETAIL: isFalse,
  // 画像ページ
  STRIP_IMAGE_SUFFIX: isFalse,
};
const OPTIONS_TEXT: { [key: string]: string } = {
  // 公式Web
  SHOW_ON_TIMELINE: 'タイムラインにボタンを表示',
  SHOW_ON_TWEET_DETAIL: 'ツイート詳細にボタンを表示',
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: 'タイムラインにボタンを表示',
  SHOW_ON_TWEETDECK_TWEET_DETAIL: 'ツイート詳細にボタンを表示',
  // 画像ページ
  STRIP_IMAGE_SUFFIX: '[Ctrl]+[s]で拡張子を校正',
};

/**
 * main */

import ButtonSetters from './helpers/ButtonSetters';
import { getOptions } from './helpers/Utils';

// 実行の間隔(ms)
const INTERVAL = 300;

// 設定
let options = { ...INITIAL_OPTIONS };

// ボタンを設置
export const setButton = (_options: Options) => {
  // console.log('setButton');

  // ボタン設置クラス
  const hostname = new URL(window.location.href).hostname;
  const buttonSetters = ButtonSetters[hostname];

  // console.log('setButton: ' + _options['SHOW_ON_TIMELINE'] + ' ' + _options['SHOW_ON_TWEET_DETAIL'] + ' ' + _options['OPEN_WITH_KEY_PRESS']) // debug
  buttonSetters.setButtonOnTimeline(_options);
  buttonSetters.setButtonOnTweetDetail(_options);
};

let isInterval = false;
let deferred = false;
const setButtonWithInterval = () => {
  // 短時間に何回も実行しないようインターバルを設ける
  if (isInterval) {
    deferred = true;
    return;
  }
  isInterval = true;
  setTimeout(() => {
    isInterval = false;
    if (deferred) {
      setButton(options);
      deferred = false;
    }
  }, INTERVAL);

  setButton(options);
};

// ページ全体でDOMの変更を検知し都度ボタン設置
const observer = new MutationObserver(setButtonWithInterval);
const target = document.querySelector('body')!;
const config = { childList: true, subtree: true };
observer.observe(target, config);

// 設定読み込み
getOptions().then(newOptions => {
  Object.keys(newOptions).forEach((key: keyof Options) => {
    options[key] = newOptions[key] as TooiBoolean;
  });
  // ボタンを(再)設置
  setButtonWithInterval();
});

// 設定反映のためのリスナー設置
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  console.log(chrome.runtime.lastError);
  if (request.method === OPTION_UPDATED) {
    getOptions().then(newOptions => {
      Object.keys(newOptions).forEach((key: keyof Options) => {
        options[key] = newOptions[key] as TooiBoolean;
      });
      // ボタンを(再)設置
      setButtonWithInterval();
      sendResponse({ data: 'done' });
    });
    return true;
  }
  sendResponse({ data: 'yet' });
  return true;
});
