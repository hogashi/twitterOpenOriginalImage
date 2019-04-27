/* imagetab.js */
// https://pbs.twimg.com/* で実行される

// twitterの画像を表示したときのC-sを拡張
// 画像のファイル名を「～.jpg-orig」「～.png-orig」ではなく「～-orig.jpg」「～-orig.png」にする

tooiInit();

// キーを押したとき
document.addEventListener('keydown', function(e) {
  updateOptions();
  // if 設定が有効なら
  // かつ 押されたキーがC-s の状態なら
  // かつ 開いているURLが画像URLの定形なら(pbs.twimg.comを使うものは他にも存在するので)
  if (
    options[STRIP_IMAGE_SUFFIX] !== 'isfalse' &&
    e.key === 's' &&
    (e.ctrlKey || e.metaKey) &&
    /https:\/\/pbs\.twimg\.com\/media\/[^.]+\.(jpg|png)(|:[a-z]+)$/.test(
      window.location.href
    )
  ) {
    // もとの挙動(ブラウザが行う保存)をしないよう中止
    e.preventDefault();
    // download属性に正しい拡張子の画像名を入れたaタグをつくってクリックする
    const a = document.createElement('a');
    const imageSrc = document.querySelector('img').src;
    const matcher = /https:\/\/pbs\.twimg\.com\/media\/([^.]+)(\.[^:]+)(?:|:([a-z]+))$/;
    const [_matched, imageName, imageSuffix, imageSize] = imageSrc.match(
      matcher
    );
    a.href = window.location.href;
    a.setAttribute(
      'download',
      `${imageName}${imageSize ? `-${imageSize}` : ''}${imageSuffix}`
    );
    a.dispatchEvent(new MouseEvent('click'));
  }
});
