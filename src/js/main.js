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
}

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
}

function openFromDetailpage() {
	var mediatags = "",
		imgurl = [],
		i = 0;
	console.log('openFromDetailpage : ' + c++);
	// .permalink-tweet-container: ツイート詳細ページのメインツイート
	// .AdaptiveMedia-photoContainer: 画像の親エレメント
	if(!!document.querySelector('.permalink-tweet-container')) {
		mediatags = document.querySelector('.permalink-tweet-container').getElementsByClassName('AdaptiveMedia-photoContainer');
		for(i=mediatags.length-1; i>=0; i--) {
			imgurl[i] = mediatags[i].getElementsByTagName('img')[0].src;
			// if 画像URLが取得できたなら
			if(!!imgurl[i]) {
				window.open(imgurl[i] + ':orig');
			}
		}
	}
}

function setButtonInTimeline() {
	var tweets = [],
		sel = [],
		divch = [],
		inputch = [],
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
				sel[i] = tweets[i].querySelector('.ProfileTweet-actionList');
				divch[i] = document.createElement('div');
				divch[i].id = 'tooiDivTimeline' + tweets[i].id;
				divch[i].className = 'ProfileTweet-action'
				sel[i].appendChild(divch[i]);
				// Originalボタン
				inputch[i] = document.createElement('input');
				inputch[i].id = 'tooiInputTimeline' + tweets[i].id;
				inputch[i].style.width = '70px';
				inputch[i].type = 'button';
				inputch[i].value = 'Original';
				inputch[i].onclick = openFromTimeline;
				document.getElementById('tooiDivTimeline' + tweets[i].id).appendChild(inputch[i]);
			}
		}
	}
}

function openFromTimeline() {
	var mediatags = [],
		imgurl = [],
		i = 0;
	console.log('openFromTimeline : ' + c++);
	// this.parentNode.parentNode.parentNode.parentNode.querySelector('.AdaptiveMedia-container'):
	// ツイートの画像の親エレメントの親まで遡り、ツイートの画像の親エレメントを取得
	if(this.parentNode.parentNode.parentNode.parentNode.querySelector('.AdaptiveMedia-container')) {
		mediatags = this.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('AdaptiveMedia-photoContainer');
		for(i=mediatags.length-1; i>=0; i--) {
			imgurl[i] = mediatags[i].getElementsByTagName('img')[0].src;
			if(!!imgurl[i]) {
				window.open(imgurl[i] + ':orig');
			}
		}
	}
}
