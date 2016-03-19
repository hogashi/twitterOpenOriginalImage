// ==UserScript==
// @name            twitterOpenOriginalImage
// @namespace       http://hogashi.hatenablog.com/
// @description     TwitterページでOriginalボタンを押すと原寸の画像が開きます(http://hogashi.hatenablog.com)
// @include         http://twitter.com*
// @include         https://twitter.com*
// @include         https://pbs.twimg.com/media*
// @version         2.0.5
// ==/UserScript==
/* main.js */

// 設定項目の初期値は「有効」
// 設定を変えるにはここを「無効」にする
// 有効: 'istrue', 無効: 'isfalse'
var options = {
	// タイムラインにボタン表示
	'SHOW_ON_TIMELINE': 'istrue',
	// ツイート詳細にボタン表示
	'SHOW_ON_TWEET_DETAIL': 'istrue',
	// Enterキーで原寸を開く
	'OPEN_WITH_KEY_PRESS': 'istrue'
};

// ページ全体でDOMの変更を検知し都度ボタン設置
var target = document.querySelector('html');
var observer = new MutationObserver(doTask);
var config = {childList: true, subtree: true};
observer.observe(target, config);

// エラーメッセージの表示(予期せぬ状況の確認)
function printException(tooiException) {
	console.log('tooi: ' + tooiException);
}

// キー押下時
document.addEventListener('keydown', function(e) {
	// if [RETURN(ENTER)]キーなら
	if(e.keyCode == 13) {
		// ツイート詳細にボタン表示する設定がされていたら
		// かつ ツイート入力ボックスがアクティブでないなら
		if((options['OPEN_WITH_KEY_PRESS'] != 'isfalse') && !(document.activeElement.className.match(/rich-editor/))) {
			openFromTweetDetail();
		}
	}
});


// 各機能の呼び出し
function doTask() {
	// console.log('doTask: ' + options['SHOW_ON_TIMELINE'] + ' ' + options['SHOW_ON_TWEET_DETAIL'] + ' ' + options['OPEN_WITH_KEY_PRESS']); // debug
	// if タイムラインにボタン表示する設定がされていたら
	if(options['SHOW_ON_TIMELINE'] != 'isfalse') {
		setButtonOnTimeline();
	}
	// if ツイート詳細にボタン表示する設定がされていたら
	if(options['SHOW_ON_TWEET_DETAIL'] != 'isfalse') {
		setButtonOnTweetDetail();
	}
} // doTask end

// タイムラインにボタン表示
function setButtonOnTimeline() {
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
				parentDiv[i].className = 'ProfileTweet-action tooiDivTimeline';
				actionList[i].appendChild(parentDiv[i]);
				// Originalボタン
				origButton[i] = document.createElement('input');
				origButton[i].style.width = '70px';
				origButton[i].type = 'button';
				origButton[i].value = 'Original';
				origButton[i].onclick = openFromTimeline;
				tweets[i].querySelector('.tooiDivTimeline').appendChild(origButton[i]);
			}
		}
	}
} // setButtonOnTimeline end

// ツイート詳細にボタン表示
function setButtonOnTweetDetail() {
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
			origButton.onclick = openFromTweetDetail;
			document.getElementById('tooiDivDetailpage').appendChild(origButton);
		}
	}
} // setButtonOnTweetDetail end

// タイムラインから画像を新しいタブに開く
function openFromTimeline(e) {
	var mediatags = [],
		imgurls = [],
		i = 0;
	// イベント(MouseEvent)による既定の動作をキャンセル
	e.preventDefault();
	// イベント(MouseEvent)の親要素への伝播を停止
	e.stopPropagation();
	// ツイートの画像の親エレメントを取得するためにその親まで遡る
	// if 上述のエレメントが取得できたら
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
	else {
		printException('CANT_FIND_IMAGE_ELEMENT_ON_TIMELINE')
	}
} // openFromTimeline end

// ツイート詳細から画像を新しいタブに開く
function openFromTweetDetail() {
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
			else {
				printException('CANT_FIND_IMAGE_URL_ON_TWEET_DETAIL');
			}
		}
	}
	else {
		printException('CANT_FIND_TWEET_DETAIL_ELEMENT');
	}
} // openFromTweetDetail end
