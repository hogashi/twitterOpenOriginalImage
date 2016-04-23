/* tooitweetdeck.js */

// 設定項目の初期値は「無効」(最初のボタン表示が早過ぎる/一旦表示すると消さないため)
// 有効だった場合はDOMが変更される間に設定が読み込まれて有効になる
// 無効だった場合はそのままボタンは表示されない
var options = {
	// 'SHOW_ON_TIMELINE': 'isfalse',
	// 'SHOW_ON_TWEET_DETAIL': 'isfalse',
	// 'OPEN_WITH_KEY_PRESS': 'isfalse'
	'SHOW_ON_TIMELINE': 'istrue',
	'SHOW_ON_TWEET_DETAIL': 'istrue',
	'OPEN_WITH_KEY_PRESS': 'istrue'
};

// ページ全体でDOMの変更を検知し都度ボタン設置
var target = document.querySelector('html');
var observer = new MutationObserver(doTask);
var config = {childList: true, subtree: true};
observer.observe(target, config);

// 設定読み込み
updateOptions();
// 設定反映のためのリスナー設置
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		switch(request.method) {
			case 'OPTION_UPDATED' :
				updateOptions();
				sendResponse({data: 'done'});
				break;
			default :
				sendResponse({data: 'yet'});
				break;
		}
	}
);

// エラーメッセージの表示(予期せぬ状況の確認)
function printException(tooiException) {
	console.log('tooi: ' + tooiException);
}

// // キー押下時
// document.addEventListener('keydown', function(e) {
// 	// if [RETURN(ENTER)]キーなら
// 	if(e.keyCode == 13) {
// 		// ツイート詳細にボタン表示する設定がされていたら
// 		// かつ ツイート入力ボックスがアクティブでないなら
// 		if((options['OPEN_WITH_KEY_PRESS'] != 'isfalse') && !(document.activeElement.className.match(/rich-editor/))) {
// 			openFromTweetDetail();
// 		}
// 	}
// });

// 設定項目更新
function updateOptions() {
	// console.log('upOpt bfr: ' + options['SHOW_ON_TIMELINE'] + ' ' + options['SHOW_ON_TWEET_DETAIL'] + ' ' + options['OPEN_WITH_KEY_PRESS']); // debug
	for(var key in options) {
		(function(key) {
			chrome.runtime.sendMessage({method: 'GET_LOCAL_STORAGE', key: key},
				function(response) {
					options[key] = response.data;
					// 設定を読み込んだら機能を呼び出す
					// 設定読込と同スコープに書くことで同期的に呼び出し
					doTask();
				}
			);
		})(key);
	}
	// console.log('upOpt aft: ' + options['SHOW_ON_TIMELINE'] + ' ' + options['SHOW_ON_TWEET_DETAIL'] + ' ' + options['OPEN_WITH_KEY_PRESS']); // debug
} // updateOptions end

// 各機能の呼び出し
function doTask() {
	// console.log('doTask: ' + options['SHOW_ON_TIMELINE'] + ' ' + options['SHOW_ON_TWEET_DETAIL'] + ' ' + options['OPEN_WITH_KEY_PRESS']); // debug
	// if タイムラインにボタン表示する設定がされていたら
	printException('doTask');
	if(options['SHOW_ON_TIMELINE'] != 'isfalse') {
		setButtonOnTimeline();
		printException('doTask#if');
	}
	// // if ツイート詳細にボタン表示する設定がされていたら
	// if(options['SHOW_ON_TWEET_DETAIL'] != 'isfalse') {
	// 	setButtonOnTweetDetail();
	// }
} // doTask end

// タイムラインにボタン表示
function setButtonOnTimeline() {
	printException('setButtonOnTimeline');
	var tweets = [],
		actionList = [],
		parentDiv = [],
		origButton = [],
		i = 0;
	// if タイムラインのツイートを取得できたら
	// is-actionable: タイムラインのみ
	if(document.getElementsByClassName('js-stream-item is-actionable').length != 0) {
		tweets = document.getElementsByClassName('js-stream-item is-actionable');
		// 各ツイートに対して
		for(i=0; i<tweets.length; i++) {
			// if 画像ツイート
			// かつ まだ処理を行っていないなら
			if(!!tweets[i].querySelector('.js-media') && !(tweets[i].querySelector('.tooiLiTimeline'))) {
				// ボタンを設置
				printException('setButtonOnTimeline#if');
				tweets[i].querySelector('footer').insertAdjacentHTML('beforeEnd', '<a class="pull-left margin-txs txt-mute is-vishidden-narrow tooiLiTimeline" style="margin-left: 3px; padding-right: 1px; font-size: 0.75em; border: 1px solid #556; border-radius: 2px; line-height: 1.5em;">Original</a>');
				tweets[i].querySelector('.tooiLiTimeline').addEventListener('click', openFromTimeline);
			}
		}
	}
} // setButtonOnTimeline end

// // ツイート詳細にボタン表示
// function setButtonOnTweetDetail() {
// 	var actionList = '',
// 		parentDiv = '',
// 		origButton = '';
// 	// if まだ処理を行っていないなら
// 	if(!document.getElementById('tooiInputDetailpage')) {
// 		// if ツイート詳細ページかつメインツイートが画像ツイートなら
// 		if(!!document.querySelector('.permalink-tweet-container .AdaptiveMedia-photoContainer')) {
// 			// Originalボタンの親の親となる枠
// 			actionList = document.querySelector('.permalink-tweet-container .ProfileTweet-actionList');
// 			// Originalボタンの親となるdiv
// 			parentDiv = document.createElement('div');
// 			parentDiv.id = 'tooiDivDetailpage';
// 			parentDiv.className = 'ProfileTweet-action';
// 			actionList.appendChild(parentDiv);
// 			// Originalボタン(input type='button')
// 			origButton = document.createElement('input');
// 			origButton.id = 'tooiInputDetailpage';
// 			origButton.type = 'button';
// 			origButton.value = 'Original';
// 			origButton.style.width = '70px';
// 			origButton.onclick = openFromTweetDetail;
// 			document.getElementById('tooiDivDetailpage').appendChild(origButton);
// 		}
// 	}
// } // setButtonOnTweetDetail end

// タイムラインから画像を新しいタブに開く
function openFromTimeline(e) {
	printException('openFromTimeline');
	var mediatags = [],
		imgurls = [],
		i = 0;
	// イベント(MouseEvent)による既定の動作をキャンセル
	e.preventDefault();
	// イベント(MouseEvent)の親要素への伝播を停止
	e.stopPropagation();
	// ツイートの画像の親エレメントを取得するためにその親まで遡る
	// if 上述のエレメントが取得できたら
	if(this.parentNode.parentNode.parentNode.parentNode.querySelector('.js-media')) {
		printException('openFromTimeline#if');
		openImagesInNewTab(
			this.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('js-media-image-link')
		);
	}
	else {
		printException('CANT_FIND_IMAGE_ELEMENT_ON_TIMELINE')
	}
} // openFromTimeline end

// // ツイート詳細から画像を新しいタブに開く
// function openFromTweetDetail() {
// 	// .permalink-tweet-container: ツイート詳細ページのメインツイート
// 	// .AdaptiveMedia-photoContainer: 画像の親エレメント
// 	if(!!document.querySelector('.permalink-tweet-container')) {
// 		openImagesInNewTab(
// 				document.querySelector('.permalink-tweet-container').getElementsByClassName('AdaptiveMedia-photoContainer')
// 		);
// 	}
// 	else {
// 		printException('CANT_FIND_TWEET_DETAIL_ELEMENT');
// 	}
// } // openFromTweetDetail end

// 画像を原寸で新しいタブに開く
function openImagesInNewTab(tag) {
	printException('openImagesInNewTab');
	var imgurls = [],
		i = 0;
	for(i=tag.length-1; i>=0; i--) {
		imgurls[i] = tag[i].style.backgroundImage;
		// if 画像URLが取得できたなら
		if(!!imgurls[i]) {
			printException('openImagesInNewTab#if');
			window.open(imgurls[i].replace(/^.+(https:\/\/pbs\.twimg\.com\/media\/[^:]+):small.+$/, "$1:orig"));
		}
		else {
			printException('CANT_FIND_IMAGE_URL');
		}
	}
}





