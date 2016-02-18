/* main.js */

// ページ全体でDOMの変更を検知し都度ボタン設置
var target = document.querySelector('html');
var observer = new MutationObserver(doTask);
var config = {childList: true, subtree: true};
observer.observe(target, config);

function init() {
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			switch(request.method) {
				case 'OPTION_UPDATED' :
					updateOptions();
					sendResponse({data: "done"});
					break;
				default :
					console.log("req: " + request.method);
					sendResponse({data: "yet"});
					break;
			}
		}
	);
}

document.addEventListener('keydown', function(e) {
	// if [RETURN(ENTER)]キーなら
	// かつ 詳細ページにボタン表示する設定がされていたら
	if(e.keyCode == 13) {
		chrome.runtime.sendMessage({method: 'getLocalStorage', key: 'openWithReturnKey'},
			function(response) {
				if(response.data != 'isfalse') {
					openFromDetailpage();
				}
			}
		);
	}
});


function doTask() {
	// 詳細ページのボタン表示設定の読み込み
	chrome.runtime.sendMessage({method: 'getLocalStorage', key: 'showInDetailpage'},
		function(response) {
			// if 詳細ページにボタン表示する設定がされていたら
			if(response.data != 'isfalse') {
				setButtonInDetailpage();
			}
		}
	);
	// タイムラインのボタン表示設定の読み込み
	chrome.runtime.sendMessage({method: 'getLocalStorage', key: 'showInTimeline'},
		function(response) {
			// if タイムラインにボタン表示する設定がされていたら
			if(response.data != 'isfalse') {
				setButtonInTimeline();
			}
		}
	);
}


function setButtonInDetailpage() {
	var actionList = "",
		parentDiv = "",
		origButton = "";
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

function setButtonInTimeline() {
	var tweets = [],
		actionList = [],
		parentDiv = [],
		origButton = [],
		i = 0;
	// if ツイートを取得できたら
	if(document.getElementsByClassName('js-stream-item').length != 0) {
		tweets = document.getElementsByClassName('js-stream-item');
		// 各ツイートに対して
		for(i=0; i<tweets.length; i++) {
			// if 画像ツイート
			// かつ まだ処理を行っていないなら
			if(!!tweets[i].querySelector('.AdaptiveMedia-container') && !(document.getElementById('tooiDivTimeline' + tweets[i].id))) {
				// ボタンを設置
				// 操作ボタンの外側は様式にあわせる
				actionList[i] = tweets[i].querySelector('.ProfileTweet-actionList');
				parentDiv[i] = document.createElement('div');
				parentDiv[i].id = 'tooiDivTimeline' + tweets[i].id;
				parentDiv[i].className = 'ProfileTweet-action'
				actionList[i].appendChild(parentDiv[i]);
				// Originalボタン
				origButton[i] = document.createElement('input');
				origButton[i].id = 'tooiInputTimeline' + tweets[i].id;
				origButton[i].style.width = '70px';
				origButton[i].type = 'button';
				origButton[i].value = 'Original';
				origButton[i].onclick = openFromTimeline;
				document.getElementById('tooiDivTimeline' + tweets[i].id).appendChild(origButton[i]);
			}
		}
	}
} // setButtonInTimeline end

function openFromDetailpage() {
	var mediatag = "",
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
				window.open(imgurls[i].replace(/(\.\w+)(:\w+|)$/, "$1:orig"));
			}
		}
	}
} // openFromDetailpage end

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
				window.open(imgurls[i].replace(/(\.\w+)(:\w+|)$/, "$1:orig"));
			}
		}
	}
} // openFromTimeline end
