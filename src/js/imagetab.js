/* imagetab.js */

// twitterの画像を表示したときのC-sを拡張
// 拡張子を「.jpg-orig」「.png-orig」ではなく「.jpg」「.png」にする

// キー押下状態を保存する変数
var keysC = [];

// キーを押したとき
document.addEventListener('keydown', function(e) {
	// console.log('dn: ' + e.keyCode); // debug
	keysC[e.keyCode] = 1;
	// if 押されたキーが83(s)キーだったら
	if(e.keyCode == 83){
		//console.log('C: ' + keysC[17]); // debug
		// if 17(Ctrl)キーが押され続けていたら すなわち C-s の状態なら
		// かつ 開いているURLが画像URLの定形なら(pbs.twimg.comを使うものは他にも存在するので)
		if(keysC[17] && window.location.href.match(/https:\/\/pbs\.twimg\.com\/media\/[^.]+\.(jpg|png):[a-z]+$/)) {
			// もとの挙動(ブラウザが行う保存)をしないよう中止
			e.preventDefault();
			//console.log('C-s: ' + e.keyCode); // debug
			// download属性に正しい拡張子の画像名を入れたaタグをつくってクリックする
			var a = document.createElement('a');
			var url = document.querySelector('img').src.replace(/(https:\/\/pbs\.twimg\.com\/media\/[^:]+):[a-z]+$/,'$1');
			a.href = url + ':orig';
			a.setAttribute('download', url.replace(/.+\/([^/]+$)/, '$1'));
			a.dispatchEvent(new CustomEvent('click'));
		}
	}
});

// キーを離したとき
document.addEventListener('keyup', function(e) {
	keysC[e.keyCode] = 0;
	//console.log('up: ' + e.keyCode + ', keysC: ' + keysC[e.keyCode]); // debug
});

