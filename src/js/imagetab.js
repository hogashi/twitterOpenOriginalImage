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
	// console.log('dn: ' + e.keyCode); // debug
	keysC[e.keyCode] = 1;
	// if 押されたキーが83(s)キーだったら
	chrome.runtime.sendMessage({method: 'GET_LOCAL_STORAGE', key: 'STRIP_IMAGE_SUFFIX'},
		function(response) {
			options['STRIP_IMAGE_SUFFIX'] = response.data;
		}
	);
	if(e.keyCode == 83 && options['STRIP_IMAGE_SUFFIX'] != 'isfalse'){
		//console.log('C: ' + keysC[17]); // debug
		// if 17(Ctrl)キーが押され続けていたら すなわち C-s の状態なら
		// かつ 開いているURLが画像URLの定形なら(pbs.twimg.comを使うものは他にも存在するので)
		if(keysC[17] && window.location.href.match(/https:\/\/pbs\.twimg\.com\/media\/[^.]+\.(jpg|png)(|:[a-z]+)$/)) {
			// もとの挙動(ブラウザが行う保存)をしないよう中止
			e.preventDefault();
			//console.log('C-s: ' + e.keyCode); // debug
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
	}
});

// キーを離したとき
document.addEventListener('keyup', function(e) {
	keysC[e.keyCode] = 0;
	//console.log('up: ' + e.keyCode + ', keysC: ' + keysC[e.keyCode]); // debug
});
