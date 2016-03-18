/* main.js */

// 設定項目の初期値は「無効」(最初のボタン設置が早過ぎるため)
// 有効だった場合はDOMが変更される間に設定が読み込まれて有効になる
var options = {
	'SHOW_ON_TWEET_DETAIL': 'isfalse',
	'SHOW_ON_TIMELINE': 'isfalse',
	'OPEN_WITH_KEY_PRESS': 'isfalse'
};

// ページ全体でDOMの変更を検知し都度ボタン設置
var target = document.querySelector('html');
var observer = new MutationObserver(doTask);
var config = {childList: true, subtree: true};
observer.observe(target, config);

// document.addEventListener('DOMContentLoaded', function(e) {
// 	alert('loaded: ' + e);
// 	// 設定の読み込み
// 	updateOptions();
// 	// 設定反映のためのリスナー設置
// 	chrome.runtime.onMessage.addListener(
// 		function(request, sender, sendResponse) {
// 			switch(request.method) {
// 				case 'OPTION_UPDATED' :
// 					updateOptions();
// 					sendResponse({data: 'done'});
// 					break;
// 				default :
// 					sendResponse({data: 'yet'});
// 					break;
// 			}
// 		}
// 	);
// });

// キー押下時
document.addEventListener('keydown', function(e) {
	// if [RETURN(ENTER)]キーなら
	if(e.keyCode == 13) {
		// ツイート詳細にボタン表示する設定がされていたら
		// かつ ツイート入力ボックスがアクティブでないなら
		if((options['OPEN_WITH_KEY_PRESS'] != 'isfalse') && (document.activeElement.className.match(/rich-editor/) != "rich-editor")) {
			openFromDetailpage();
		}
	}
});

// 設定項目更新
function updateOptions() {
	console.log(options);
	new Map([['SHOW_ON_TIMELINE', 'isfalse'], ['SHOW_ON_TWEET_DETAIL', 'isfalse'], ['OPEN_WITH_KEY_PRESS', 'isfalse']]).forEach(function(value, key, map) {
			chrome.runtime.sendMessage({method: 'GET_LOCAL_STORAGE', key: key},
				function(response) {
					options[key] = response.data;
					console.log(response.data);
				}
			);
		});
	console.log(options + ' -> ');
	// chrome.runtime.sendMessage({method: 'GET_LOCAL_STORAGE', key: options},
	// 	function(response) {
	// 		options = response.data;
	// 		console.log(response.data['SHOW_ON_TIMELINE']);
	// 	}
	// );

	// chrome.runtime.sendMessage({method: 'GET_LOCAL_STORAGE', key: 'SHOW_ON_TWEET_DETAIL'},
	// 	function(response) {
	// 		options['SHOW_ON_TWEET_DETAIL'] = response.data;
	// 	}
	// );
	// chrome.runtime.sendMessage({method: 'GET_LOCAL_STORAGE', key: 'SHOW_ON_TIMELINE'},
	// 	function(response) {
	// 		options['SHOW_ON_TIMELINE'] = response.data;
	// 	}
	// );
	// chrome.runtime.sendMessage({method: 'GET_LOCAL_STORAGE', key: 'OPEN_WITH_KEY_PRESS'},
	// 	function(response) {
	// 		options['OPEN_WITH_KEY_PRESS'] = response.data;
	// 	}
	// );
} // updateOptions end

// 各機能の呼び出し
function doTask() {
	updateOptions();
	// if ツイート詳細にボタン表示する設定がされていたら
	if(options['SHOW_ON_TWEET_DETAIL'] != 'isfalse') {
		setButtonInDetailpage();
	}
	// タイムラインのボタン表示設定の読み込み
	// if タイムラインにボタン表示する設定がされていたら
	if(options['SHOW_ON_TIMELINE'] != 'isfalse') {
		setButtonInTimeline();
	}
} // doTask end

// ツイート詳細にボタン表示
function setButtonInDetailpage() {
	var actionList = '',
		parentDiv = '',
		origButton = '';
	// if まだ処理を行っていないなら
	if(!document.getElementById('tooiInputDetailpage')) {
		// if ツイート詳細ページかつメインツイートが画像ツイートなら
		if(!!document.querySelector('.permalink-tweet-container .AdaptiveMedia-photoContainer')) {
			// Originalボタンの親の親となる枠
			actionList = document.querySelector('.permalink-tweet-container .ProfileTweet-actionList');
			// Originalボタンの親となるdiv
			parentDiv = document.createElement('div');
			parentDiv.id = 'tooiDivDetailpage';
			parentDiv.className = 'ProfileTweet-action';
			actionList.appendChild(parentDiv);
			// Originalボタン(input type='button')
			origButton = document.createElement('input');
			origButton.id = 'tooiInputDetailpage';
			origButton.type = 'button';
			origButton.value = 'Original';
			origButton.style.width = '70px';
			origButton.onclick = openFromDetailpage;
			document.getElementById('tooiDivDetailpage').appendChild(origButton);
		}
	}
} // setButtonInDetailpage end

// タイムラインにボタン表示
function setButtonInTimeline() {
	var tweets = [],
		actionList = [],
		parentDiv = [],
		origButton = [],
		i = 0;
	// if ツイートを取得できたら
	if(document.getElementsByClassName('js-stream-tweet').length != 0) {
		tweets = document.getElementsByClassName('js-stream-tweet');
		// 各ツイートに対して
		for(i=0; i<tweets.length; i++) {
			// if 画像ツイート
			// かつ まだ処理を行っていないなら
			if(!!tweets[i].querySelector('.AdaptiveMedia-container') && !!tweets[i].querySelector('.AdaptiveMedia-container').querySelector('img') && !(tweets[i].querySelector('.tooiDivTimeline'))) {
				// ボタンを設置
				// 操作ボタンの外側は様式にあわせる
				actionList[i] = tweets[i].querySelector('.ProfileTweet-actionList');
				parentDiv[i] = document.createElement('div');
				// parentDiv[i].id = '' + tweets[i].id;
				parentDiv[i].className = 'ProfileTweet-action tooiDivTimeline'
				actionList[i].appendChild(parentDiv[i]);
				// Originalボタン
				origButton[i] = document.createElement('input');
				// origButton[i].id = 'tooiInputTimeline' + tweets[i].id;
				// origButton[i].className = 'tooiInputTimeline';
				origButton[i].style.width = '70px';
				origButton[i].type = 'button';
				origButton[i].value = 'Original';
				origButton[i].onclick = openFromTimeline;
				tweets[i].querySelector('.tooiDivTimeline').appendChild(origButton[i]);
			}
		}
	}
} // setButtonInTimeline end

// ツイート詳細から画像を新しいタブに開く
function openFromDetailpage() {
	var mediatag = '',
		imgurls = [],
		i = 0;
	// .permalink-tweet-container: ツイート詳細ページのメインツイート
	// .AdaptiveMedia-photoContainer: 画像の親エレメント
	if(!!document.querySelector('.permalink-tweet-container')) {
		mediatag = document.querySelector('.permalink-tweet-container').getElementsByClassName('AdaptiveMedia-photoContainer');
		for(i=mediatag.length-1; i>=0; i--) {
			imgurls[i] = mediatag[i].getElementsByTagName('img')[0].src;
			// if 画像URLが取得できたなら
			if(!!imgurls[i]) {
				window.open(imgurls[i].replace(/(\.\w+)(:\w+|)$/, '$1:orig'));
			}
		}
	}
} // openFromDetailpage end

// タイムラインから画像を新しいタブに開く
function openFromTimeline(e) {
	var mediatags = [],
		imgurls = [],
		i = 0;
	// イベント(MouseEvent)による既定の動作をキャンセル
	e.preventDefault();
	// イベント(MouseEvent)の親要素への伝播を停止
	e.stopPropagation();
	// this.parentNode.parentNode.parentNode.parentNode.querySelector('.AdaptiveMedia-container'):
	// ツイートの画像の親エレメントの親まで遡り、ツイートの画像の親エレメントを取得
	if(this.parentNode.parentNode.parentNode.parentNode.querySelector('.AdaptiveMedia-container')) {
		mediatags = this.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('AdaptiveMedia-photoContainer');
		for(i=mediatags.length-1; i>=0; i--) {
			imgurls[i] = mediatags[i].getElementsByTagName('img')[0].src;
			// if 画像URLが取得できたなら
			if(!!imgurls[i]) {
				window.open(imgurls[i].replace(/(\.\w+)(:\w+|)$/, '$1:orig'));
			}
		}
	}
} // openFromTimeline end

// function openImage(urls) {
// 	if(openEach) {
// 		window.open(imgurls[i].replace(/(\.\w+)(:\w+|)$/, '$1:orig'));
// 	}
// }
