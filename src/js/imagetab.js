/* imagetab.js */

// twitterの画像を表示したときのC-sを拡張
// 拡張子を「.jpg-orig」「.png-orig」ではなく「.jpg」「.png」にする

// キー押下状態を保存する変数
var keysC = [];

var options = {
	'STRIP_IMAGE_SUFFIX': 'isfalse'
};

// エラーメッセージの表示(予期せぬ状況の確認)
function printException(tooiException) {
	console.log('tooitd: ' + tooiException);
}

// キーを押したとき
document.addEventListener('keydown', function(e) {
	chrome.runtime.sendMessage({method: 'GET_LOCAL_STORAGE', key: 'STRIP_IMAGE_SUFFIX'},
		function(response) {
			options['STRIP_IMAGE_SUFFIX'] = response.data;
		}
	);
	// if 設定が有効なら
	// かつ 押されたキーがC-s の状態なら
	// かつ 開いているURLが画像URLの定形なら(pbs.twimg.comを使うものは他にも存在するので)
	if( options['STRIP_IMAGE_SUFFIX'] != 'isfalse'
		 && e.keyCode == 83
		 && e.ctrlKey
		 && window.location.href.match(/https:\/\/pbs\.twimg\.com\/media\/[^.]+\.(jpg|png)(|:[a-z]+)$/)) {
		// もとの挙動(ブラウザが行う保存)をしないよう中止
		e.preventDefault();
		// download属性に正しい拡張子の画像名を入れたaタグをつくってクリックする
		var a = document.createElement('a');
		var imgSrc = document.querySelector('img').src;
		var matcher = /https:\/\/pbs\.twimg\.com\/media\/([^.]+)(\.[^:]+)(|:)([a-z]*)$/;
		var imageName = imgSrc.replace(matcher,'$1');
		var imageSuffix = imgSrc.replace(matcher,'$2');
		var imageSize = imgSrc.replace(matcher,'$4');
		if(imageSize != '') {
			imageSize = '-' + imageSize;
		}
		a.href = window.location.href;
		a.setAttribute('download', imageName + imageSize + imageSuffix);
		a.dispatchEvent(new CustomEvent('click'));
	}
});
