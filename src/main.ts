import ButtonSetters from './helpers/ButtonSetters';
import {
  INITIAL_OPTIONS,
  OPTION_UPDATED,
  SHOW_ON_TIMELINE,
  SHOW_ON_TWEET_DETAIL,
} from './helpers/Constants';
import { updateOptions } from './helpers/Utils';

// 設定
const options = INITIAL_OPTIONS;

// ボタン設置クラス
const hostname = new URL(window.location.href).hostname;
const buttonSetters = ButtonSetters[hostname];

// ボタンを設置
const setButton = () => {
  // console.log('setButton: ' + options['SHOW_ON_TIMELINE'] + ' ' + options['SHOW_ON_TWEET_DETAIL'] + ' ' + options['OPEN_WITH_KEY_PRESS']) // debug
  // if タイムラインにボタン表示する設定がされていたら
  if (options[SHOW_ON_TIMELINE] !== 'isfalse') {
    buttonSetters.setButtonOnTimeline();
  }
  // if ツイート詳細にボタン表示する設定がされていたら
  if (options[SHOW_ON_TWEET_DETAIL] !== 'isfalse') {
    buttonSetters.setButtonOnTweetDetail();
  }
};

// ページ全体でDOMの変更を検知し都度ボタン設置
const observer = new MutationObserver(setButton);
const target = document.querySelector('body');
const config = { childList: true, subtree: true };
// ページ全体でDOMの変更を検知し都度ボタン設置
observer.observe(target, config);

// 設定読み込み
updateOptions(options).then(() => {
  // ボタンを(再)設置
  setButton();
});

// 設定反映のためのリスナー設置
chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  if (request.method === OPTION_UPDATED) {
    updateOptions(options).then(() => {
      // ボタンを(再)設置
      setButton();
      sendResponse({ data: 'done' });
    });
    return;
  }
  sendResponse({ data: 'yet' });
});
