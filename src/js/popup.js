/* popup.js */
// ツールバー右に表示される拡張機能のボタンをクリック、または
// [設定]->[拡張機能]の[オプション]から出る設定画面

let options = ['SHOW_ON_TWEET_DETAIL',
	'SHOW_ON_TIMELINE',
	'OPEN_WITH_KEY_PRESS',
	'SHOW_ON_TWEETDECK_TIMELINE',
	'STRIP_IMAGE_SUFFIX'];

// 各設定項目について
options.map((v, i) => {
	// 最初はどっちも機能オンであってほしい
	// 最初は値が入っていないので、「if isfalseでないなら機能オン」とする
	document.getElementsByClassName(v)[0].checked = (localStorage[v] != 'isfalse');
});

document.getElementById('save').addEventListener('click', (e) => {
	options.map((v, i) => {
		localStorage[v] = `is${document.getElementsByClassName(v)[0].checked.toString()}`;
	});
	chrome.tabs.query({}, (result) => {
		result.map((v, i) => {
			// console.log(v.id);
			chrome.tabs.sendMessage(v.id, {method: 'OPTION_UPDATED'}, null, (response) => {
				// console.log(`res: ${response}`)
			});
		});
	});
});
