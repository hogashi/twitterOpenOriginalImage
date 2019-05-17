/* imagetab.ts */
// https://pbs.twimg.com/* で実行される

// twitterの画像を表示したときのC-sを拡張
// 画像のファイル名を「～.jpg-orig」「～.png-orig」ではなく「～-orig.jpg」「～-orig.png」にする

import { INITIAL_OPTIONS, STRIP_IMAGE_SUFFIX } from './helpers/Constants';
import { updateOptions, collectUrlParams } from './helpers/Utils';

const options = { ...INITIAL_OPTIONS };

const getImageFilenameByUrl = (imgUrl: string) => {
  const params = collectUrlParams(imgUrl);
  if (!params) {
    return null;
  }

  const { pathname, format, name } = params;
  const basename = pathname.match(/([^/.]*?)(?:\..+)?$/)![1];

  return `${basename}${name ? `-${name}` : ''}.${format}`;
};

document.addEventListener('DOMContentLoaded', () => {
  updateOptions(options);
});

// キーを押したとき
document.addEventListener('keydown', e => {
  // if 設定が有効なら
  // かつ 押されたキーがC-s の状態なら
  // かつ 開いているURLが画像URLの定形なら(pbs.twimg.comを使うものは他にも存在するので)
  if (
    options[STRIP_IMAGE_SUFFIX] !== 'isfalse' &&
    e.key === 's' &&
    (e.ctrlKey || e.metaKey)
  ) {
    const imageSrc = document.querySelector('img')!.src;
    const filename = getImageFilenameByUrl(imageSrc);
    if (!filename) {
      return;
    }
    // もとの挙動(ブラウザが行う保存)をしないよう中止
    e.preventDefault();

    // download属性に正しい拡張子の画像名を入れたaタグをつくってクリックする
    const a = document.createElement('a');
    a.href = window.location.href;
    a.setAttribute('download', filename);
    a.dispatchEvent(new MouseEvent('click'));
  }
});
