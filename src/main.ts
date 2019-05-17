import ButtonSetters from './helpers/ButtonSetters';
import { INITIAL_OPTIONS, OPTION_UPDATED, Options } from './helpers/Constants';
import { getOptions } from './helpers/Utils';

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
const setButtonWithInterval = () => {
  // 短時間に何回も実行しないようインターバルを設ける
  if (isInterval) {
    return;
  }
  isInterval = true;
  setTimeout(() => {
    isInterval = false;
  }, 300);

  setButton(options);
};

// ページ全体でDOMの変更を検知し都度ボタン設置
const observer = new MutationObserver(setButtonWithInterval);
const target = document.querySelector('body')!;
const config = { childList: true, subtree: true };
observer.observe(target, config);

// 設定読み込み
getOptions().then(newOptions => {
  options = { ...newOptions };
  // ボタンを(再)設置
  setButtonWithInterval();
});

// 設定反映のためのリスナー設置
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  console.log(chrome.runtime.lastError);
  if (request.method === OPTION_UPDATED) {
    getOptions().then(newOptions => {
      options = { ...newOptions };
      // ボタンを(再)設置
      setButtonWithInterval();
      sendResponse({ data: 'done' });
    });
    return true;
  }
  sendResponse({ data: 'yet' });
  return true;
});
