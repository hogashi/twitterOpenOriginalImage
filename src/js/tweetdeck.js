/* tweetdeck.js */

// 設定項目の初期値は「無効」(最初のボタン表示が早過ぎる/一旦表示すると消さないため)
// 有効だった場合はDOMが変更される間に設定が読み込まれて有効になる
// 無効だった場合はそのままボタンは表示されない
let options = {
  'SHOW_ON_TWEETDECK_TIMELINE': 'isfalse',
  'SHOW_ON_TWEETDECK_TWEET_DETAIL': 'isfalse',
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
  console.log('tooitd: ' + tooiException)
}

// 設定項目更新
function updateOptions() {
  // console.log('upOpt bfr: ' + options['SHOW_ON_TWEETDECK_TIMELINE']) // debug
  Object.keys(options).map((key, i) => {
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
  })
  // console.log('upOpt bfr: ' + options['SHOW_ON_TWEETDECK_TIMELINE']) // debug
} // updateOptions end

// 各機能の呼び出し
function doTask() {
  // console.log('upOpt bfr: ' + options['SHOW_ON_TWEETDECK_TIMELINE']) // debug
  // if Tweetdeckのタイムラインにボタン表示する設定がされていたら
  if(options['SHOW_ON_TWEETDECK_TIMELINE'] != 'isfalse') {
    setButtonOnTweetdeckTimeline()
  }
  // if Tweetdeckのツイート詳細にボタン表示する設定がされていたら
  if(options['SHOW_ON_TWEETDECK_TWEET_DETAIL'] != 'isfalse') {
    setButtonOnTweetdeckTweetDetail()
  }
} // doTask end

// エレメントへのstyle属性の設定
function setStyle(e, attrs) {
  Object.keys(attrs).map((key, i) => {
    e.style[key] = attrs[key]
  })
}

// タイムラインにボタン表示
function setButtonOnTweetdeckTimeline() {
  // if タイムラインのツイートを取得できたら
  // is-actionable: タイムラインのみ
  if(document.getElementsByClassName('js-stream-item is-actionable').length != 0) {
    // 各ツイートに対して
    Array.from(document.getElementsByClassName('js-stream-item is-actionable'))
      .map((tweet, i) => {
      // if メディアツイート
      // かつ メディアが画像(動画でもGIFでもない)
      // かつ まだ処理を行っていないなら
      if(!!(tweet.getElementsByClassName('js-media-image-link')[0])
       && !(tweet.getElementsByClassName('is-video')[0])
       && !(tweet.getElementsByClassName('is-gif')[0])
       && !(tweet.getElementsByClassName('tooiATweetdeckTimeline')[0])) {
        // ボタンを設置
        let origButton = document.createElement('a')
        tweet.getElementsByTagName('footer')[0].appendChild(origButton)
        // tweetdeckのツイート右上の時刻などに使われているclassを使う
        // 設置の有無の判別用に'tooiATweetdeckTimeline'を付与する
        origButton.className = 'pull-left margin-txs txt-mute tooiATweetdeckTimeline'
        // 枠線の色は'Original'と同じく'.txt-mute'の色を使うのでボタンから取得して設定する
        let borderColor = document.defaultView.getComputedStyle(origButton, '').color
        // ボタンのスタイル設定
        setStyle(origButton,
          {border: `1px solid ${borderColor}`,
          borderRadius: '2px',
          fontSize: '0.75em',
          marginLeft: '3px',
          lineHeight: '1.5em',
          paddingRight: '1px'})
        origButton.insertAdjacentHTML('beforeend', 'Original')
        // ボタンを押した時の挙動を設定する
        origButton.addEventListener('click', openFromTweetdeckTimeline)
      }
    })
  }
} // setButtonOnTweetdeckTimeline end

// Tweetdeckのツイート詳細にボタン表示
function setButtonOnTweetdeckTweetDetail() {
  // console.log('TODO, ボタン実装') // TODO, debug
  // if タイムラインのツイートを取得できたら
  // is-actionable: タイムラインのみ
  if(document.getElementsByClassName('js-tweet-detail').length != 0) {
    // 各ツイートに対して
    Array.from(document.getElementsByClassName('js-tweet-detail'))
      .map((tweet, i) => {
      // if メディアツイート
      // かつ 単数or複数の画像のタグが取得できたら
      // かつ まだ処理を行っていないなら
      if( ((tweet.getElementsByClassName('media-img').length != 0) || (tweet.getElementsByClassName('media-image').length != 0))
        && !(tweet.getElementsByClassName('tooiATweetdeckDetail')[0]) ) {
        // ボタンを設置
        let origButton = document.createElement('a')
        // tweet.getElementsByTagName('footer')[0].appendChild(origButton)
        let footer = tweet.getElementsByTagName('footer')[0]
        footer.parentNode.insertBefore(origButton, footer)
        // tweetdeckのツイート右上の時刻などに使われているclassを使う
        // 設置の有無の判別用に'tooiATweetdeckDetail'を付与する
        origButton.className = 'txt-mute tooiATweetdeckDetail'
        // 枠線の色は'Original'と同じく'.txt-mute'の色を使うのでボタンから取得して設定する
        let borderColor = document.defaultView.getComputedStyle(origButton, '').color
        // ボタンのスタイル設定
        setStyle(origButton,
          {
            border: `1px solid ${borderColor}`,
            borderRadius: '2px',
            fontSize: '0.75em',
            marginTop: '5px',
            padding: '2px 2px 2px 0',
            cursor: 'pointer'
          })
        origButton.insertAdjacentHTML('beforeend', 'Original')
        // ボタンを押した時の挙動を設定する
        origButton.addEventListener('click', openFromTweetdeckTweetDetail)
      }
    })
  }
} // setButtonOnTweetdeckTweetDetail end

// Tweetdeckタイムラインから画像を新しいタブに開く
function openFromTweetdeckTimeline(e) {
  // イベント(MouseEvent)による既定の動作をキャンセル
  e.preventDefault()
  // イベント(MouseEvent)の親要素への伝播を停止
  e.stopPropagation()
  // ツイートの画像の親エレメントを取得するためにその親まで遡る
  // if 上述のエレメントが取得できたら
  if(this.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('js-media')) {
    openImagesInNewTab(
      Array.from(this.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('js-media-image-link'))
        .map(v => {return v.style.backgroundImage})
    )
  }
  else {
    printException('CANT_FIND_IMAGE_ELEMENT_ON_TWEETDECK_TIMELINE')
  }
} // openFromTweetdeckTimeline end

// Tweetdeckツイート詳細から画像を新しいタブに開く
function openFromTweetdeckTweetDetail(e) {
  // イベント(MouseEvent)による既定の動作をキャンセル
  e.preventDefault()
  // イベント(MouseEvent)の親要素への伝播を停止
  e.stopPropagation()
  // ツイートの画像の親エレメントを取得するためにその親まで遡る
  // if 上述のエレメントが取得できたら
  if(this.parentNode.parentNode.getElementsByClassName('media-img').length != 0) {
    openImagesInNewTab(
      [this.parentNode.parentNode.getElementsByClassName('media-img')[0].src]
    )
  }
  else if(this.parentNode.parentNode.getElementsByClassName('js-media-image-link').length != 0) {
    openImagesInNewTab(
      Array.from(this.parentNode.parentNode.getElementsByClassName('js-media-image-link'))
        .map(v => {return v.style.backgroundImage})
    )
  }
  else {
    printException('CANT_FIND_IMAGE_ELEMENT_ON_TWEETDECK_TWEET_DETAIL')
  }
} // openFromTweetdeckTweetDetail end

// 画像を原寸で新しいタブに開く
function openImagesInNewTab(imgurls) {
  Array.from(imgurls).reverse().map(imgurl => {
    // if 画像URLが取得できたなら
    if(!!imgurl) {
      const url = new URL(imgurl.replace(/url\("([^"]*)"\)/, '$1'))
      window.open(`${url.protocol}//${url.host}${url.pathname}:orig`)
    }
    else {
      printException('CANT_FIND_IMAGE_URL')
    }
  })
}
