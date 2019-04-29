import ButtonSetters from './helpers/ButtonSetters';
import { INITIAL_OPTIONS, OPTION_UPDATED } from './helpers/Constants';
import { updateOptions } from './helpers/Utils';

// 設定
const options = INITIAL_OPTIONS;

// ボタン設置クラス
const hostname = new URL(window.location.href).hostname;
const buttonSetters = ButtonSetters[hostname];

let isInterval = false;

// ボタンを設置
const setButton = () => {
  // 短時間に何回も実行しないようインターバルを設ける
  if (isInterval) {
    return;
  }
  isInterval = true;
  setTimeout(() => {
    isInterval = false;
  }, 300);

  console.log('setButton');

  // console.log('setButton: ' + options['SHOW_ON_TIMELINE'] + ' ' + options['SHOW_ON_TWEET_DETAIL'] + ' ' + options['OPEN_WITH_KEY_PRESS']) // debug
  buttonSetters.setButtonOnTimeline(options);
  buttonSetters.setButtonOnTweetDetail(options);
};

// ページ全体でDOMの変更を検知し都度ボタン設置
const observer = new MutationObserver(setButton);
const target = document.querySelector('body');
const config = { childList: true, subtree: true };
observer.observe(target, config);

// 設定読み込み
updateOptions(options).then(() => {
  // ボタンを(再)設置
  setButton();
});

// 設定反映のためのリスナー設置
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  console.log(chrome.runtime.lastError);
  if (request.method === OPTION_UPDATED) {
    updateOptions(options).then(() => {
      // ボタンを(再)設置
      setButton();
      sendResponse({ data: 'done' });
    });
    return true;
  }
  sendResponse({ data: 'yet' });
  return true;
});
