/* main.js */

var c = 0;

var timerid;
window.addEventListener('load', start);
document.addEventListener('click', start);
document.addEventListener('keyup', start);
document.addEventListener('keydown', function(e) {
	// if [RETURN(ENTER)]キーなら
	// かつ 詳細ページにボタン表示する設定がされていたら
	start();
	if(e.keyCode == 13) {
		chrome.runtime.sendMessage({method: 'getLocalStorage', key: 'showInDetailpage'},
			function(response) {
				if(response.data != 'isfalse') {
					openFromDetailpage();
				}
			}
		);
	}
});

function start() {
	console.log('start : ' + c++);
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
	clearTimeout(timerid);
	timerid = setTimeout('start()', 1500);
} // start end

function setButtonInDetailpage() {
	var actionList = "",
		parentDiv = "",
		origButton = "";
	console.log('setButtonInDetailpage : ' + c++);
	// if まだ処理を行っていないなら
	if(!document.getElementById('tooiInputDetail')) {
		// if ツイート詳細ページかつメインツイートが画像ツイートなら
		if(!!document.querySelector('.permalink-tweet-container .AdaptiveMedia-photoContainer')) {
			// Originalボタンの親の親となる枠
			actionList = document.querySelector('.permalink-tweet-container .ProfileTweet-actionList');
			// Originalボタンの親となるdiv
			parentDiv = document.createElement('div');
			parentDiv.id = 'tooiDivDetailpage';
			parentDiv.className = 'ProfileTweet-action'
			actionList.appendChild(parentDiv);
			// Originalボタン(input type='button')
			origButton = document.createElement('input');
			origButton.id = 'tooiInputDetail';
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
	console.log('setButtonInTimeline : ' + c++);
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
	console.log('openFromDetailpage : ' + c++);
	// .permalink-tweet-container: ツイート詳細ページのメインツイート
	// .AdaptiveMedia-photoContainer: 画像の親エレメント
	if(!!document.querySelector('.permalink-tweet-container')) {
		mediatag = document.querySelector('.permalink-tweet-container').getElementsByClassName('AdaptiveMedia-photoContainer');
		for(i=mediatag.length-1; i>=0; i--) {
			imgurls[i] = mediatag[i].getElementsByTagName('img')[0].src;
			// if 画像URLが取得できたなら
			if(!!imgurls[i]) {
				window.open(imgurls[i] + ':orig');
			}
		}
	}
} // openFromDetailpage end

function openFromTimeline() {
	var mediatags = [],
		imgurls = [],
		i = 0;
	console.log('openFromTimeline : ' + c++);
	// this.parentNode.parentNode.parentNode.parentNode.querySelector('.AdaptiveMedia-container'):
	// ツイートの画像の親エレメントの親まで遡り、ツイートの画像の親エレメントを取得
	if(this.parentNode.parentNode.parentNode.parentNode.querySelector('.AdaptiveMedia-container')) {
		mediatags = this.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('AdaptiveMedia-photoContainer');
		for(i=mediatags.length-1; i>=0; i--) {
			imgurls[i] = mediatags[i].getElementsByTagName('img')[0].src;
			if(!!imgurls[i]) {
				window.open(imgurls[i] + ':orig');
			}
		}
	}
} // openFromTimeline end
