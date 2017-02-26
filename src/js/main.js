/* main.js */

// https://twitter.com* で実行される

// 設定項目の初期値は「無効」(最初のボタン表示が早過ぎる/一旦表示すると消さないため)
// 有効だった場合はDOMが変更される間に設定が読み込まれて有効になる
// 無効だった場合はそのままボタンは表示されない
let options = {
	'SHOW_ON_TIMELINE': 'isfalse',
	'SHOW_ON_TWEET_DETAIL': 'isfalse',
	'OPEN_WITH_KEY_PRESS': 'isfalse'
}

// ページ全体でDOMの変更を検知し都度ボタン設置
let target = document.getElementsByTagName('html')[0]
let observer = new MutationObserver(doTask)
let config = {childList: true, subtree: true}
observer.observe(target, config)

// 設定読み込み
updateOptions()
// 設定反映のためのリスナー設置
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		switch(request.method) {
			case 'OPTION_UPDATED':
				updateOptions()
				sendResponse({data: 'done'})
				break
			default:
				sendResponse({data: 'yet'})
				break
		}
	}
)

// エラーメッセージの表示(予期せぬ状況の確認)
function printException(tooiException) {
	console.log('tooi: ' + tooiException)
}

// キー押下時
document.addEventListener('keydown', function(e) {
	// if [RETURN(ENTER)]キーなら
	if(e.key == 'Enter') {
		// ツイート詳細にボタン表示する設定がされていたら
		// かつ ツイート入力ボックスがアクティブでないなら
		if((options['OPEN_WITH_KEY_PRESS'] != 'isfalse')
		 && !(document.activeElement.className.match(/rich-editor/))) {
			openFromTweetDetail(e)
		}
	}
})

// 設定項目更新
function updateOptions() {
	// console.log('upOpt bfr: ' + options['SHOW_ON_TIMELINE'] + ' ' + options['SHOW_ON_TWEET_DETAIL'] + ' ' + options['OPEN_WITH_KEY_PRESS']) // debug
	for(let key in options) {
		(function(k) {
			chrome.runtime.sendMessage({method: 'GET_LOCAL_STORAGE', key: k},
				function(response) {
					options[k] = response.data
					// 設定を読み込んだら機能を呼び出す
					// 設定読込と同スコープに書くことで同期的に呼び出し
					doTask()
				}
			)
		})(key)
	}
	// console.log('upOpt aft: ' + options['SHOW_ON_TIMELINE'] + ' ' + options['SHOW_ON_TWEET_DETAIL'] + ' ' + options['OPEN_WITH_KEY_PRESS']) // debug
} // updateOptions end

// 各機能の呼び出し
function doTask() {
	// console.log('doTask: ' + options['SHOW_ON_TIMELINE'] + ' ' + options['SHOW_ON_TWEET_DETAIL'] + ' ' + options['OPEN_WITH_KEY_PRESS']) // debug
	// if タイムラインにボタン表示する設定がされていたら
	if(options['SHOW_ON_TIMELINE'] != 'isfalse') {
		setButtonOnTimeline()
	}
	// if ツイート詳細にボタン表示する設定がされていたら
	if(options['SHOW_ON_TWEET_DETAIL'] != 'isfalse') {
		setButtonOnTweetDetail()
	}
} // doTask end

// タイムラインにボタン表示
function setButtonOnTimeline() {
	// if ツイートを取得できたら
	if(document.getElementsByClassName('js-stream-tweet').length != 0) {
		// 各ツイートに対して
		Array.from(document.getElementsByClassName('js-stream-tweet'))
			.map((tweet, i) => {
			// if 画像ツイート
			// かつ まだ処理を行っていないなら
			if(!!(tweet.getElementsByClassName('AdaptiveMedia-container')[0])
			 && !!(tweet.getElementsByClassName('AdaptiveMedia-container')[0].getElementsByTagName('img')[0])
			 && !(tweet.getElementsByClassName('tooiDivTimeline')[0])) {
				let actionList,
					parentDiv,
					origButton
				// ボタンを設置
				// 操作ボタンの外側は様式にあわせる
				actionList = tweet.getElementsByClassName('ProfileTweet-actionList')[0]
				parentDiv = document.createElement('div')
				// parentDiv.id = '' + tweet.id
				parentDiv.className = 'ProfileTweet-action tooiDivTimeline'
				actionList.appendChild(parentDiv)
				// Originalボタン
				origButton = document.createElement('input')
				tweet.getElementsByClassName('tooiDivTimeline')[0].appendChild(origButton)
				origButton.style.width = '70px'
				origButton.type = 'button'
				origButton.value = 'Original'
				origButton.addEventListener('click', openFromTimeline)
			}
		})
	}
} // setButtonOnTimeline end

// ツイート詳細にボタン表示
function setButtonOnTweetDetail() {
	// if まだ処理を行っていないなら
	if(!document.getElementById('tooiInputDetailpage')) {
		// if ツイート詳細ページかつメインツイートが画像ツイートなら
		if(!!(document.getElementsByClassName('permalink-tweet-container')[0])
		 && !!(document.getElementsByClassName('permalink-tweet-container')[0].getElementsByClassName('AdaptiveMedia-photoContainer')[0])) {
			let actionList,
				parentDiv,
				origButton
			// Originalボタンの親の親となる枠
			actionList = document.getElementsByClassName('permalink-tweet-container')[0].getElementsByClassName('ProfileTweet-actionList')[0]
			// Originalボタンの親となるdiv
			parentDiv = document.createElement('div')
			parentDiv.id = 'tooiDivDetailpage'
			parentDiv.className = 'ProfileTweet-action'
			actionList.appendChild(parentDiv)
			// Originalボタン(input type='button')
			origButton = document.createElement('input')
			document.getElementById('tooiDivDetailpage').appendChild(origButton)
			origButton.id = 'tooiInputDetailpage'
			origButton.type = 'button'
			origButton.value = 'Original'
			origButton.style.width = '70px'
			origButton.addEventListener('click', openFromTweetDetail)
		}
	}
} // setButtonOnTweetDetail end

// タイムラインから画像を新しいタブに開く
function openFromTimeline(e) {
	// ツイートの画像の親エレメントを取得するためにその親まで遡る
	// if 上述のエレメントが取得できたら
	if(this.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('AdaptiveMedia-container')[0]) {
		// イベント(MouseEvent)による既定の動作をキャンセル
		e.preventDefault()
		// イベント(MouseEvent)の親要素への伝播を停止
		e.stopPropagation()
		openImagesInNewTab(
			this.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('AdaptiveMedia-photoContainer')
		)
	}
	else {
		printException('CANT_FIND_IMAGE_ELEMENT_ON_TIMELINE')
	}
} // openFromTimeline end

// ツイート詳細から画像を新しいタブに開く
function openFromTweetDetail(e) {
	// .permalink-tweet-container: ツイート詳細ページのメインツイート
	// .AdaptiveMedia-photoContainer: 画像の親エレメント
	if(!!(document.getElementsByClassName('permalink-tweet-container')[0])) {
		// イベント(MouseEvent)による既定の動作をキャンセル
		e.preventDefault()
		// イベント(MouseEvent)の親要素への伝播を停止
		e.stopPropagation()
		openImagesInNewTab(
				document.getElementsByClassName('permalink-tweet-container')[0].getElementsByClassName('AdaptiveMedia-photoContainer')
		)
	}
	else {
		printException('CANT_FIND_TWEET_DETAIL_ELEMENT')
	}
} // openFromTweetDetail end

// 画像を原寸で新しいタブに開く
function openImagesInNewTab(tag) {
	Array.from(tag).reverse().map((v, i) => {
		let imgurl = v.getElementsByTagName('img')[0].src
		if(!!imgurl) {
			window.open(imgurl.replace(/(\.\w+)(|:\w+)$/, '$1:orig'))
		}
		else {
			printException('CANT_FIND_IMAGE_URL')
		}
	})
}
