import { isTweetdeck, isTwitter, OptionsBool, SHOW_ON_TIMELINE, SHOW_ON_TWEETDECK_TIMELINE } from './constants';
import { onOriginalButtonClick, printException, setStyle } from './utils';

const doneClassName = 'tooi-button-container-react-timeline';

export const getTweets = () => Array.from(document.querySelectorAll('#react-root main section article'));

// まだ処理を行っていないときのみ実行
export const shouldSetButtonOnTweet = (tweet: Element) => !tweet.classList.contains(doneClassName);

export const getImgSrcs = (tweet: Element): string[] => {
  const aTagsOnTweet = Array.from(tweet.querySelectorAll('a')).filter((aTag) =>
    /\/status\/[0-9]+\/photo\//.test(aTag.href),
  );
  const tweetImgs = aTagsOnTweet.map((aTag) => aTag.querySelector('img'));
  return tweetImgs.flatMap((img) => (img ? img.src : []));
};

export const getButtonColor = () => {
  // ツイートアクション(返信とか)のボタンの色を取る(夜間モードか否かで違う)
  const actionButtonChild = document.querySelector<HTMLElement>('div[role="group"] div[role="button"] :first-child');
  if (actionButtonChild?.style) {
    const buttonColor = window.getComputedStyle(actionButtonChild).color;
    if (buttonColor) {
      return buttonColor;
    }
  }
  // 初期値: コントラスト比4.5(chromeの推奨する最低ライン)の色
  return '#697b8c';
};

export const createButton = (tweet: Element) => {
  const button = document.createElement('input');
  button.type = 'button';
  button.value = 'Original';

  const color = getButtonColor();
  setStyle(button, {
    'font-size': '13px',
    padding: '4px 8px',
    color,
    'background-color': 'rgba(0, 0, 0, 0)',
    border: `1px solid ${color}`,
    'border-radius': '3px',
    cursor: 'pointer',
  });

  // 押したら画像を開くリスナをつける
  button.addEventListener('click', (e) => {
    onOriginalButtonClick(e, getImgSrcs(tweet));
  });

  return button;
};

export const createContainer = () => {
  const container = document.createElement('div');
  container.classList.add(doneClassName);
  setStyle(container, {
    display: 'flex',
    'flex-flow': 'column',
    'justify-content': 'center',
  });
  return container;
};

export const setButtonOnTweet = (tweet: Element) => {
  // 操作ボタンの外側は様式にあわせる
  const target = tweet.querySelector<HTMLElement>('div[role="group"]');
  if (!target) {
    printException('no target');
    return;
  }
  // 新しいTweetDeckで, カラムの幅によってはボタンがはみ出るので,
  // 折り返してボタンを表示する
  setStyle(target, { 'flex-wrap': 'wrap' });

  const container = createContainer();
  const button = createButton(tweet);

  target.appendChild(container);
  container.appendChild(button);
};

export const setOriginalButtonOnReactView = (options: OptionsBool) => {
  // タイムラインにボタン表示する設定がされているときだけ実行する
  // 公式Webと, 新しいTweetDeckで呼ばれる
  if ((isTwitter() && !options[SHOW_ON_TIMELINE]) || (isTweetdeck() && !options[SHOW_ON_TWEETDECK_TIMELINE])) {
    return;
  }
  const tweets = getTweets();
  if (!tweets.length) {
    return;
  }
  // 各ツイートに対して
  tweets.forEach((tweet) => {
    if (!shouldSetButtonOnTweet(tweet)) {
      return;
    }
    // ボタンを設置
    setButtonOnTweet(tweet);
  });
};
