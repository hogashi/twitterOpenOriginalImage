// ==UserScript==
// @author          hogashi
// @name            twitterOpenOriginalImage
// @namespace       http://hogashi.hatenablog.com/
// @description     TwitterページでOriginalボタンを押すと原寸の画像が開きます(http://hogashi.hatenablog.com)
// @include         https://twitter.com*
// @include         https://tweetdeck.twitter.com*
// @include         https://pbs.twimg.com/media*
// @version         2.1.12
// ==/UserScript==

// common, main, tweetdeck, imagetab

// common.js

// 設定取得メッセージ
const OPTION_UPDATED = 'OPTION_UPDATED';
const GET_LOCAL_STORAGE = 'GET_LOCAL_STORAGE';

// 公式Web
const OPEN_WITH_KEY_PRESS = 'OPEN_WITH_KEY_PRESS';
const SHOW_ON_TIMELINE = 'SHOW_ON_TIMELINE';
const SHOW_ON_TWEET_DETAIL = 'SHOW_ON_TWEET_DETAIL';
// TweetDeck
const SHOW_ON_TWEETDECK_TIMELINE = 'SHOW_ON_TWEETDECK_TIMELINE';
const SHOW_ON_TWEETDECK_TWEET_DETAIL = 'SHOW_ON_TWEETDECK_TWEET_DETAIL';
// 画像ページ
const STRIP_IMAGE_SUFFIX = 'STRIP_IMAGE_SUFFIX';

// 設定
// 'isfalse' とすると、その設定がオフになる
const options = {
  // 公式Web
  SHOW_ON_TIMELINE: 'istrue',
  SHOW_ON_TWEET_DETAIL: 'istrue',
  OPEN_WITH_KEY_PRESS: 'istrue',
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: 'istrue',
  SHOW_ON_TWEETDECK_TWEET_DETAIL: 'istrue',
  // 画像ページ
  STRIP_IMAGE_SUFFIX: 'istrue',
};

let observer;

function tooiInit(setButtonsCallBack) {
  if (setButtonsCallBack) {
    // ページ全体でDOMの変更を検知し都度ボタン設置
    observer = new MutationObserver(setButtonsCallBack);
    const target = document.querySelector('body');
    const config = { childList: true, subtree: true };
    // ページ全体でDOMの変更を検知し都度ボタン設置
    observer.observe(target, config);
  }
}

// ヘルパ

// エラーメッセージの表示(予期せぬ状況の確認)
function printException(tooiException) {
  console.log('tooi: ' + tooiException + ' at: ' + window.location);
}

// エレメントへのstyle属性の設定
function setStyle(element, attrSet) {
  Object.keys(attrSet).forEach(key => (element.style[key] = attrSet[key]));
}

// エレメントのbackgroudImageのurlを取得する(`url("")`を除去する)
function getBackgroundImageUrl(element) {
  return element.style.backgroundImage.replace(/url\("([^"]*)"\)/, '$1');
}

// 画像URLを http～:orig に揃える
function formatUrl(imgurl) {
  if (!imgurl) {
    return null;
  }

  const url = new URL(imgurl);
  const searchSet = {};
  url.search
    .slice(1)
    .split('&')
    .forEach(set => {
      const [key, value] = set.split('=');
      searchSet[key] = value;
    });

  if (/https:\/\/pbs\.twimg\.com\/media/.test(url)) {
    const [_matched, pathname, extension] = url.pathname.match(
      /^(.*?)(?:|\.([^.:]+))(?:|:[a-z]+)$/
    );
    // 2.1.11時点ではクエリパラメータを使うのはTweetDeckのみ
    // TweetDeckのURLでは拡張子を優先する
    // ref: https://hogashi.hatenablog.com/entry/2018/08/15/042044
    return `${url.protocol}//${url.host}${pathname}.${
      extension ? extension : searchSet.format
    }:orig`;
  }
  return url;
}

// 画像URLのリストを受け取って、新しいタブに開く
function openImagesInNewTab(imgurls) {
  Array.from(imgurls)
    .reverse()
    .forEach(imgurl => {
      // if 画像URLが取得できたなら
      const url = formatUrl(imgurl);
      if (url) {
        window.open(url);
      } else {
        printException('no image url');
      }
    });
}

/* main.js */
// https://twitter.com/* で実行される

if (/^https:\/\/twitter\.com/.test(window.location.href)) {
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
}

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

// ドキュメント内からボタンの文字色を得る
function getActionButtonColor() {
  // コントラスト比4.5(chromeの推奨する最低ライン)の色
  const contrastLimitColor = '#697b8c';

  const actionButton = document.querySelector('.ProfileTweet-actionButton');
  if (!actionButton || !actionButton.style) {
    return contrastLimitColor;
  }

  const buttonColor = window.getComputedStyle(actionButton).color;
  if (buttonColor && buttonColor.length > 0) {
    return buttonColor;
  }
  return contrastLimitColor;
}

function createOriginalButton(onClick) {
  const origButton = document.createElement('input');

  origButton.type  = 'button';
  origButton.value = 'Original';

  origButton.style.width       = '70px';
  origButton.style.fontSize    = '13px';
  origButton.style.color       = getActionButtonColor();

  origButton.addEventListener('click', onClick);
  return origButton;
}

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
      // ボタンを設置
      // 操作ボタンの外側は様式にあわせる
      const actionList = tweet.getElementsByClassName('ProfileTweet-actionList')[0];
      const parentDiv = document.createElement('div');
      // parentDiv.id = '' + tweet.id
      parentDiv.className = 'ProfileTweet-action tooiDivTimeline';
      actionList.appendChild(parentDiv);
      // Originalボタン
      const origButton = createOriginalButton(openFromTimeline);
      tweet
        .getElementsByClassName('tooiDivTimeline')[0]
        .appendChild(origButton);
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
  // Originalボタンの親の親となる枠
  const actionList = document
    .getElementsByClassName('permalink-tweet-container')[0]
    .getElementsByClassName('ProfileTweet-actionList')[0];
  // Originalボタンの親となるdiv
  const parentDiv = document.createElement('div');
  parentDiv.id = 'tooiDivDetailpage';
  parentDiv.className = 'ProfileTweet-action';
  actionList.appendChild(parentDiv);
  // Originalボタン(input type='button')
  const origButton = createOriginalButton(openFromTweetDetail);
  document.getElementById('tooiDivDetailpage').appendChild(origButton);
  origButton.id = 'tooiInputDetailpage';
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

/* tweetdeck.js */
// https://tweetdeck.twitter.com/* で実行される

if (/^https:\/\/tweetdeck\.twitter\.com/.test(window.location.href)) {
  tooiInit(setButtonsOnTweetdeck);
}

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
    tweet.getElementsByTagName('footer')[0].appendChild(origButton);
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

/* imagetab.js */
// https://pbs.twimg.com/* で実行される

// twitterの画像を表示したときのC-sを拡張
// 画像のファイル名を「～.jpg-orig」「～.png-orig」ではなく「～-orig.jpg」「～-orig.png」にする

if (/^https:\/\/pbs\.twimg\.com/.test(window.location.href)) {
  tooiInit();

  // キーを押したとき
  document.addEventListener('keydown', function(e) {
    // if 設定が有効なら
    // かつ 押されたキーがC-s の状態なら
    // かつ 開いているURLが画像URLの定形なら(pbs.twimg.comを使うものは他にも存在するので)
    if (
      options[STRIP_IMAGE_SUFFIX] !== 'isfalse' &&
      e.key === 's' &&
      (e.ctrlKey || e.metaKey) &&
      /https:\/\/pbs\.twimg\.com\/media\/[^.]+\.(jpg|png)(|:[a-z]+)$/.test(
        window.location.href
      )
    ) {
      // もとの挙動(ブラウザが行う保存)をしないよう中止
      e.preventDefault();
      // download属性に正しい拡張子の画像名を入れたaタグをつくってクリックする
      const a = document.createElement('a');
      const imageSrc = document.querySelector('img').src;
      const matcher = /https:\/\/pbs\.twimg\.com\/media\/([^.]+)(\.[^:]+)(?:|:([a-z]+))$/;
      const [_matched, imageName, imageSuffix, imageSize] = imageSrc.match(
        matcher
      );
      a.href = window.location.href;
      a.setAttribute(
        'download',
        `${imageName}${imageSize ? `-${imageSize}` : ''}${imageSuffix}`
      );
      a.dispatchEvent(new MouseEvent('click'));
    }
  });
}
