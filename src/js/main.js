/* main.js */
// https://twitter.com/* で実行される

tooiInit(setButtons);

// キー押下時
document.addEventListener('keydown', function(e) {
  // if [RETURN(ENTER)]キーなら
  if (
    e.key === 'Enter' &&
    !e.ctrlKey &&
    !e.metaKey &&
    !e.altKey &&
    !e.shiftKey
  ) {
    // ツイート詳細にボタン表示する設定がされていたら
    // かつ ツイート入力ボックスがアクティブでないなら
    if (
      options[OPEN_WITH_KEY_PRESS] !== 'isfalse' &&
      !document.activeElement.className.match(/rich-editor/)
    ) {
      openFromTweetDetail(e);
    }
  }
});

// ボタンを置く
function setButtons() {
  // console.log('setButtons: ' + options['SHOW_ON_TIMELINE'] + ' ' + options['SHOW_ON_TWEET_DETAIL'] + ' ' + options['OPEN_WITH_KEY_PRESS']) // debug
  // if タイムラインにボタン表示する設定がされていたら
  if (options[SHOW_ON_TIMELINE] !== 'isfalse') {
    setButtonOnTimeline();
  }
  // if ツイート詳細にボタン表示する設定がされていたら
  if (options[SHOW_ON_TWEET_DETAIL] !== 'isfalse') {
    setButtonOnTweetDetail();
  }
} // setButtons end

// タイムラインにボタン表示
function setButtonOnTimeline() {
  const tweets = document.getElementsByClassName('js-stream-tweet');
  if (!tweets.length) {
    return;
  }
  // 各ツイートに対して
  Array.from(tweets).forEach(tweet => {
    // if 画像ツイート
    // かつ まだ処理を行っていないなら
    if (
      !!tweet.getElementsByClassName('AdaptiveMedia-container')[0] &&
      !!tweet
        .getElementsByClassName('AdaptiveMedia-container')[0]
        .getElementsByTagName('img')[0] &&
      !tweet.getElementsByClassName('tooiDivTimeline')[0]
    ) {
      let actionList, parentDiv, origButton;
      // ボタンを設置
      // 操作ボタンの外側は様式にあわせる
      actionList = tweet.getElementsByClassName('ProfileTweet-actionList')[0];
      parentDiv = document.createElement('div');
      // parentDiv.id = '' + tweet.id
      parentDiv.className = 'ProfileTweet-action tooiDivTimeline';
      actionList.appendChild(parentDiv);
      // Originalボタン
      origButton = document.createElement('input');
      tweet
        .getElementsByClassName('tooiDivTimeline')[0]
        .appendChild(origButton);
      origButton.type = 'button';
      origButton.value = 'Original';
      origButton.style.width = '70px';
      origButton.style.fontSize = '13px';
      origButton.style.color = '#000000';
      origButton.addEventListener('click', openFromTimeline);
    }
  });
} // setButtonOnTimeline end

// ツイート詳細にボタン表示
function setButtonOnTweetDetail() {
  if (
    !document.getElementsByClassName('permalink-tweet-container')[0] ||
    !document
      .getElementsByClassName('permalink-tweet-container')[0]
      .getElementsByClassName('AdaptiveMedia-photoContainer')[0] ||
    document.getElementById('tooiInputDetailpage')
  ) {
    // ツイート詳細ページでない、または、メインツイートが画像ツイートでないとき
    // または、すでに処理を行ってあるとき
    // 何もしない
    return;
  }
  let actionList, parentDiv, origButton;
  // Originalボタンの親の親となる枠
  actionList = document
    .getElementsByClassName('permalink-tweet-container')[0]
    .getElementsByClassName('ProfileTweet-actionList')[0];
  // Originalボタンの親となるdiv
  parentDiv = document.createElement('div');
  parentDiv.id = 'tooiDivDetailpage';
  parentDiv.className = 'ProfileTweet-action';
  actionList.appendChild(parentDiv);
  // Originalボタン(input type='button')
  origButton = document.createElement('input');
  document.getElementById('tooiDivDetailpage').appendChild(origButton);
  origButton.id = 'tooiInputDetailpage';
  origButton.type = 'button';
  origButton.value = 'Original';
  origButton.style.width = '70px';
  origButton.style.fontSize = '13px';
  origButton.addEventListener('click', openFromTweetDetail);
} // setButtonOnTweetDetail end

// タイムラインから画像を新しいタブに開く
function openFromTimeline(e) {
  // ツイートの画像の親エレメントを取得するためにその親まで遡る
  const parentNode = this.parentNode.parentNode.parentNode.parentNode;
  // if 上述のエレメントが取得できたら
  if (parentNode.getElementsByClassName('AdaptiveMedia-container')[0]) {
    // イベント(MouseEvent)による既定の動作をキャンセル
    e.preventDefault();
    // イベント(MouseEvent)の親要素への伝播を停止
    e.stopPropagation();
    openImagesInNewTab(
      Array.from(
        parentNode.getElementsByClassName('AdaptiveMedia-photoContainer')
      ).map(element => element.getElementsByTagName('img')[0].src)
    );
  } else {
    printException('no image elements on timeline');
  }
} // openFromTimeline end

// ツイート詳細から画像を新しいタブに開く
function openFromTweetDetail(e) {
  // .permalink-tweet-container: ツイート詳細ページのメインツイート
  // .AdaptiveMedia-photoContainer: 画像の親エレメント
  if (!!document.getElementsByClassName('permalink-tweet-container')[0]) {
    // イベント(MouseEvent)による既定の動作をキャンセル
    e.preventDefault();
    // イベント(MouseEvent)の親要素への伝播を停止
    e.stopPropagation();
    openImagesInNewTab(
      Array.from(
        document
          .getElementsByClassName('permalink-tweet-container')[0]
          .getElementsByClassName('AdaptiveMedia-photoContainer')
      ).map(element => element.getElementsByTagName('img')[0].src)
    );
  } else {
    printException('no tweet elements on tweet detail');
  }
} // openFromTweetDetail end
