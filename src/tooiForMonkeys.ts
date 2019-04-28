import ButtonSetters from './helpers/ButtonSetters';

// userjs生成スクリプト(scripts/make_user_script.js)でoptionsを書き込む

// ボタン設置クラス
const hostname = new URL(window.location.href).hostname;
const buttonSetters = ButtonSetters[hostname];

// ボタンを設置
const setButton = () => {
  // console.log('setButton: ' + options['SHOW_ON_TIMELINE'] + ' ' + options['SHOW_ON_TWEET_DETAIL'] + ' ' + options['OPEN_WITH_KEY_PRESS']) // debug
  // eslint-disable-next-line no-undef
  buttonSetters.setButtonOnTimeline(options || {});
  // eslint-disable-next-line no-undef
  buttonSetters.setButtonOnTweetDetail(options || {});
};

// ページ全体でDOMの変更を検知し都度ボタン設置
const observer = new MutationObserver(setButton);
const target = document.querySelector('body');
const config = { childList: true, subtree: true };
// ページ全体でDOMの変更を検知し都度ボタン設置
observer.observe(target, config);
