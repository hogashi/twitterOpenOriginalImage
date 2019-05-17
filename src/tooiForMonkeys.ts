import { setButton } from './main';
import { downloadImage } from './imagetab';
import { STRIP_IMAGE_SUFFIX } from './helpers/Constants';

// 最終的にファイルの冒頭にuserjs生成スクリプト(scripts/make_user_script.js)でoptionsを書き込む

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

  // eslint-disable-next-line  no-undef
  setButton(options);
};

// ページ全体でDOMの変更を検知し都度ボタン設置
const observer = new MutationObserver(setButtonWithInterval);
const target = document.querySelector('body')!;
const config = { childList: true, subtree: true };
// ページ全体でDOMの変更を検知し都度ボタン設置
observer.observe(target, config);

// 画像ページのとき
if (/^pbs\.twimg\.com/.test(window.location.hostname)) {
  // キーを押したとき
  document.addEventListener('keydown', e => {
    // 設定が有効なら
    // eslint-disable-next-line  no-undef
    if (options[STRIP_IMAGE_SUFFIX] !== 'isfalse') {
      downloadImage(e);
    }
  });
}
