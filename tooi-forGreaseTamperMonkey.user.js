// ==UserScript==
// @author          hogashi
// @name            twitterOpenOriginalImage
// @namespace       http://hogashi.hatenablog.com/
// @description     TwitterページでOriginalボタンを押すと原寸の画像が開きます(http://hogashi.hatenablog.com)
// @include         https://twitter.com*
// @include         https://tweetdeck.twitter.com*
// @include         https://pbs.twimg.com/media*
// @version         2.1.4
// ==/UserScript==
/* main.js */

// 設定項目の初期値は「有効」
// 設定を変えるにはここを「無効」にする
// 有効: 'istrue', 無効: 'isfalse'
let options = {
  // タイムラインにボタン表示
  'SHOW_ON_TIMELINE': 'istrue',
  // ツイート詳細にボタン表示
  'SHOW_ON_TWEET_DETAIL': 'istrue',
  // Enterキーで原寸を開く
  'OPEN_WITH_KEY_PRESS': 'istrue',
  // TweetDeckのタイムラインにボタン表示
  'SHOW_ON_TWEETDECK_TIMELINE': 'istrue',
  // TweetDeckの詳細ツイートにボタン表示
  'SHOW_ON_TWEETDECK_TWEET_DETAIL': 'istrue',
  // 画像タブでC-s動作を改善
  'STRIP_IMAGE_SUFFIX': 'istrue'
}

// ページ全体でDOMの変更を検知し都度ボタン設置
let target = document.getElementsByTagName('html')[0]
let observer = new MutationObserver(doTask)
let config = {childList: true, subtree: true}
observer.observe(target, config)

// エラーメッセージの表示(予期せぬ状況の確認)
function printException(tooiException) {
  console.log('tooi: ' + tooiException)
}

// キー押下時
document.addEventListener('keydown', function(e) {
  // if [RETURN(ENTER)]キーなら
  if(e.key == 'Enter'
   && !(e.ctrlKey) && !(e.metaKey) && !(e.altKey) && !(e.shiftKey)) {
    // ツイート詳細にボタン表示する設定がされていたら
    // かつ ツイート入力ボックスがアクティブでないなら
    if((options['OPEN_WITH_KEY_PRESS'] != 'isfalse')
     && !(document.activeElement.className.match(/rich-editor/))) {
      openFromTweetDetail(e)
    }
  }
})

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
  // if TweetDeckのタイムラインにボタン表示する設定がされていたら
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
        origButton.type = 'button'
        origButton.value = 'Original'
        origButton.style.width = '70px'
        origButton.style.fontSize = '13px'
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
      origButton.style.fontSize = '13px'
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

// tweetdeck ->

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
    openImagesFromTweetdeckInNewTab(
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
    openImagesFromTweetdeckInNewTab(
      [this.parentNode.parentNode.getElementsByClassName('media-img')[0].src]
    )
  }
  else if(this.parentNode.parentNode.getElementsByClassName('js-media-image-link').length != 0) {
    openImagesFromTweetdeckInNewTab(
      Array.from(this.parentNode.parentNode.getElementsByClassName('js-media-image-link'))
        .map(v => {return v.style.backgroundImage})
    )
  }
  else {
    printException('CANT_FIND_IMAGE_ELEMENT_ON_TWEETDECK_TWEET_DETAIL')
  }
} // openFromTweetdeckTweetDetail end

// 画像を原寸で新しいタブに開く
function openImagesFromTweetdeckInNewTab(imgurls) {
  Array.from(imgurls).reverse().map(imgurl => {
    // if 画像URLが取得できたなら
    if(!!imgurl) {
      window.open(imgurl.replace(/^[^(]+\(\"(https:[^:]+)(|:[^:]+)\"\)$/, '$1:orig'))
    }
    else {
      printException('CANT_FIND_IMAGE_URL_IN_TWEETDECK')
    }
  })
}

// imagetab ->

// twitterの画像を表示したときのC-sを拡張
// 拡張子を「.jpg-orig」「.png-orig」ではなく「.jpg」「.png」にする

// キーを押したとき
document.addEventListener('keydown', function(e) {
  // updateOptions()
  // if 設定が有効なら
  // かつ 押されたキーがC-s の状態なら
  // かつ 開いているURLが画像URLの定形なら(pbs.twimg.comを使うものは他にも存在するので)
  if( options['STRIP_IMAGE_SUFFIX'] != 'isfalse'
     && e.key == 's'
     && (e.ctrlKey || e.metaKey)
     && window.location.href.match(/https:\/\/pbs\.twimg\.com\/media\/[^.]+\.(jpg|png)(|:[a-z]+)$/)) {
    // もとの挙動(ブラウザが行う保存)をしないよう中止
    e.preventDefault()
    // download属性に正しい拡張子の画像名を入れたaタグをつくってクリックする
    var a = document.createElement('a')
    var imgSrc = document.querySelector('img').src
    var matcher = /https:\/\/pbs\.twimg\.com\/media\/([^.]+)(\.[^:]+)(|:)([a-z]*)$/
    var imageName = imgSrc.replace(matcher,'$1')
    var imageSuffix = imgSrc.replace(matcher,'$2')
    var imageSize = imgSrc.replace(matcher,'$4')
    if(imageSize != '') {
      imageSize = '-' + imageSize
    }
    a.href = window.location.href
    a.setAttribute('download', imageName + imageSize + imageSuffix)
    a.dispatchEvent(new CustomEvent('click'))
  }
})
