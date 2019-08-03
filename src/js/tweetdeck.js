/* tweetdeck.js */
// https://tweetdeck.twitter.com/* で実行される

tooiInit(setButtonsOnTweetdeck);

// ボタンを置く
function setButtonsOnTweetdeck() {
  // console.log('update options: ' + options[SHOW_ON_TWEETDECK_TIMELINE]) // debug
  // if Tweetdeckのタイムラインにボタン表示する設定がされていたら
  if (options[SHOW_ON_TWEETDECK_TIMELINE] !== 'isfalse') {
    setButtonOnTweetdeckTimeline();
  }
  // if Tweetdeckのツイート詳細にボタン表示する設定がされていたら
  if (options[SHOW_ON_TWEETDECK_TWEET_DETAIL] !== 'isfalse') {
    setButtonOnTweetdeckTweetDetail();
  }
} // setButtonsOnTweetdeck end

// タイムラインにボタン表示
function setButtonOnTweetdeckTimeline() {
  // if タイムラインのツイートを取得できたら
  // is-actionable: タイムラインのみ
  const tweets = document.getElementsByClassName(
    'js-stream-item is-actionable'
  );
  if (!tweets.length) {
    return;
  }
  // 各ツイートに対して
  Array.from(tweets).forEach(tweet => {
    if (
      !tweet.getElementsByClassName('js-media-image-link').length ||
      tweet.getElementsByClassName('is-video').length ||
      tweet.getElementsByClassName('is-gif').length ||
      tweet.getElementsByClassName('tooiATweetdeckTimeline').length
    ) {
      // メディアツイートでない
      // または メディアが画像でない(動画/GIF)
      // または すでにボタンをおいてあるとき
      // 何もしない
      return;
    }
    // ボタンを設置
    const origButton = document.createElement('a');
    const footer = tweet.getElementsByTagName('footer');
    if (footer.length === 0) {
      // footerなかったら何もしない
      return;
    }
    footer[0].appendChild(origButton);
    // tweetdeckのツイート右上の時刻などに使われているclassを使う
    // 設置の有無の判別用に'tooiATweetdeckTimeline'を付与する
    origButton.className =
      'pull-left margin-txs txt-mute tooiATweetdeckTimeline';
    // 枠線の色は'Original'と同じく'.txt-mute'の色を使うのでボタンから取得して設定する
    const borderColor = window.getComputedStyle(origButton).color;
    // ボタンのスタイル設定
    setStyle(origButton, {
      border: `1px solid ${borderColor}`,
      borderRadius: '2px',
      fontSize: '0.75em',
      marginLeft: '3px',
      lineHeight: '1.5em',
      paddingRight: '1px',
    });
    origButton.insertAdjacentHTML('beforeend', 'Original');
    // ボタンを押した時の挙動を設定する
    origButton.addEventListener('click', openFromTweetdeckTimeline);
  });
} // setButtonOnTweetdeckTimeline end

// Tweetdeckのツイート詳細にボタン表示
function setButtonOnTweetdeckTweetDetail() {
  // console.log('TODO, ボタン実装') // TODO, debug
  // if タイムラインのツイートを取得できたら
  // is-actionable: タイムラインのみ
  const tweets = document.getElementsByClassName('js-tweet-detail');
  if (!tweets.length) {
    return;
  }
  // 各ツイートに対して
  Array.from(tweets).forEach(tweet => {
    if (
      (!tweet.getElementsByClassName('media-img').length &&
        !tweet.getElementsByClassName('media-image').length) ||
      tweet.getElementsByClassName('tooiATweetdeckDetail').length
    ) {
      // メディアツイートでない (画像のタグが取得できない)
      // または すでにボタンをおいてあるとき
      // 何もしない
      return;
    }
    // ボタンを設置
    const origButton = document.createElement('a');
    // tweet.getElementsByTagName('footer')[0].appendChild(origButton)
    const footer = tweet.getElementsByTagName('footer')[0];
    footer.parentNode.insertBefore(origButton, footer);
    // tweetdeckのツイート右上の時刻などに使われているclassを使う
    // 設置の有無の判別用に'tooiATweetdeckDetail'を付与する
    origButton.className = 'txt-mute tooiATweetdeckDetail';
    // 枠線の色は'Original'と同じく'.txt-mute'の色を使うのでボタンから取得して設定する
    const borderColor = document.defaultView.getComputedStyle(origButton, '')
      .color;
    // ボタンのスタイル設定
    setStyle(origButton, {
      border: `1px solid ${borderColor}`,
      borderRadius: '2px',
      fontSize: '0.75em',
      marginTop: '5px',
      padding: '2px 2px 2px 0',
      cursor: 'pointer',
    });
    origButton.insertAdjacentHTML('beforeend', 'Original');
    // ボタンを押した時の挙動を設定する
    origButton.addEventListener('click', openFromTweetdeckTweetDetail);
  });
} // setButtonOnTweetdeckTweetDetail end

// Tweetdeckタイムラインから画像を新しいタブに開く
function openFromTweetdeckTimeline(e) {
  // イベント(MouseEvent)による既定の動作をキャンセル
  e.preventDefault();
  // イベント(MouseEvent)の親要素への伝播を停止
  e.stopPropagation();
  // ツイートの画像の親エレメントを取得するためにその親まで遡る
  // if 上述のエレメントが取得できたら
  const parentNode = this.parentNode.parentNode.parentNode.parentNode;
  if (parentNode.getElementsByClassName('js-media')) {
    openImagesInNewTab(
      Array.from(parentNode.getElementsByClassName('js-media-image-link')).map(
        element => getBackgroundImageUrl(element)
      )
    );
  } else {
    printException('no image elements on tweetdeck timeline');
  }
} // openFromTweetdeckTimeline end

// Tweetdeckツイート詳細から画像を新しいタブに開く
function openFromTweetdeckTweetDetail(e) {
  // イベント(MouseEvent)による既定の動作をキャンセル
  e.preventDefault();
  // イベント(MouseEvent)の親要素への伝播を停止
  e.stopPropagation();
  // ツイートの画像の親エレメントを取得するためにその親まで遡る
  // if 上述のエレメントが取得できたら
  const parentNode = this.parentNode.parentNode;
  if (parentNode.getElementsByClassName('media-img').length !== 0) {
    openImagesInNewTab([parentNode.getElementsByClassName('media-img')[0].src]);
  } else if (
    parentNode.getElementsByClassName('js-media-image-link').length !== 0
  ) {
    openImagesInNewTab(
      Array.from(parentNode.getElementsByClassName('js-media-image-link')).map(
        element => getBackgroundImageUrl(element)
      )
    );
  } else {
    printException('no image elements on tweetdeck tweet detail');
  }
} // openFromTweetdeckTweetDetail end
