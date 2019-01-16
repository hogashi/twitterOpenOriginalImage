/* main_react_layout.js */
// https://twitter.com/* で実行される

tooiInit(setButtonsReactLayout);

// ボタンを置く
function setButtonsReactLayout() {
  // console.log('setButtons: ' + options['SHOW_ON_TIMELINE'] + ' ' + options['SHOW_ON_TWEET_DETAIL'] + ' ' + options['OPEN_WITH_KEY_PRESS']) // debug
  // if タイムラインにボタン表示する設定がされていたら
  if (options[SHOW_ON_TIMELINE] !== 'isfalse') {
    setButtonOnTimelineReactLayout();
  }
} // setButtons end

// ドキュメント内からボタンのスタイルを得る
function getActionButtonStyleReactLayout() {
  // 文字色
  // 初期値: コントラスト比4.5(chromeの推奨する最低ライン)の色
  let color = '#697b8c';
  // ツイートアクション(返信とか)のボタンのクラス(夜間モードか否かでクラス名が違う)
  const actionButton =
    document.querySelector('.rn-1re7ezh') ||
    document.querySelector('.rn-111h2gw');
  if (actionButton && actionButton.style) {
    const buttonColor = window.getComputedStyle(actionButton).color;
    if (buttonColor && buttonColor.length > 0) {
      color = buttonColor;
    }
  }

  return {
    fontSize: '13px',
    padding: '4px 8px',
    color,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    border: `1px solid ${color}`,
    borderRadius: '3px',
    cursor: 'pointer',
  };
}

function createOriginalButtonReactLayout(onClick) {
  const origButton = document.createElement('input');

  origButton.type = 'button';
  origButton.value = 'Original';
  Object.entries(getActionButtonStyleReactLayout()).forEach(
    ([key, value]) => (origButton.style[key] = value)
  );

  origButton.addEventListener('click', onClick);
  return origButton;
}

// タイムラインにボタン表示
function setButtonOnTimelineReactLayout() {
  const tweets = Array.from(
    document.querySelectorAll('#react-root main section article')
  );
  if (!tweets.length) {
    return;
  }
  // 各ツイートに対して
  tweets.forEach(tweet => {
    // if 画像ツイート
    // かつ まだ処理を行っていないなら
    const tweetATags = Array.from(
      tweet.querySelectorAll('div div div div div div div div div a')
    ).filter(aTag => /\/status\/[0-9]+\/photo\//.test(aTag.href));
    if (
      tweetATags.length &&
      !tweet.getElementsByClassName('tooiDivTimeline')[0]
    ) {
      // ボタンを設置
      // 操作ボタンの外側は様式にあわせる
      const actionList = tweet.querySelector('div div div[role="group"]');
      const parentDiv = document.createElement('div');
      // parentDiv.id = '' + tweet.id
      parentDiv.className = 'tooiDivTimeline';
      Object.entries({
        display: 'flex',
        flexFlow: 'column',
        justifyContent: 'center',
      }).forEach(([key, value]) => (parentDiv.style[key] = value));
      actionList.appendChild(parentDiv);
      // Originalボタン
      const origButton = createOriginalButtonReactLayout(
        openFromTimelineReactLayout
      );
      tweet
        .getElementsByClassName('tooiDivTimeline')[0]
        .appendChild(origButton);
    }
  });
} // setButtonOnTimeline end

// タイムラインから画像を新しいタブに開く
function openFromTimelineReactLayout(e) {
  // ツイートの画像の親まで遡る
  const parentNode = e.target.parentNode.parentNode.parentNode;
  const tweetImgs = Array.from(
    parentNode.querySelectorAll('div div div div div div div a')
  )
    .filter(aTag => /\/status\/[0-9]+\/photo\//.test(aTag.href))
    .map(aTag => aTag.querySelector('img'));
  // if 上述のエレメントが取得できたら
  if (tweetImgs.length) {
    // イベント(MouseEvent)による既定の動作をキャンセル
    e.preventDefault();
    // イベント(MouseEvent)の親要素への伝播を停止
    e.stopPropagation();
    if (tweetImgs.length === 4) {
      // 4枚のとき2枚目と3枚目のDOMの順序が前後するので直す
      const tweetimgTmp = tweetImgs[1];
      tweetImgs[1] = tweetImgs[2];
      tweetImgs[2] = tweetimgTmp;
    }
    openImagesInNewTab(tweetImgs.map(img => img.src));
  } else {
    printException('no image elements on timeline in react layout');
  }
} // openFromTimeline end
