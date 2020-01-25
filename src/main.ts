/**
 * Constants
 */
// 定数

// 設定取得メッセージ
const OPTION_UPDATED = 'OPTION_UPDATED';
const GET_LOCAL_STORAGE = 'GET_LOCAL_STORAGE';

// 公式Web
const HOST_TWITTER_COM = 'twitter.com';
const SHOW_ON_TIMELINE = 'SHOW_ON_TIMELINE';
const SHOW_ON_TWEET_DETAIL = 'SHOW_ON_TWEET_DETAIL';
// TweetDeck
const HOST_TWEETDECK_TWITTER_COM = 'tweetdeck.twitter.com';
const SHOW_ON_TWEETDECK_TIMELINE = 'SHOW_ON_TWEETDECK_TIMELINE';
const SHOW_ON_TWEETDECK_TWEET_DETAIL = 'SHOW_ON_TWEETDECK_TWEET_DETAIL';
// 画像ページ
const HOST_PBS_TWIMG_COM = 'pbs.twimg.com';
const STRIP_IMAGE_SUFFIX = 'STRIP_IMAGE_SUFFIX';

// 設定

// 設定に使う真偽値
const isTrue = 'istrue';
const isFalse = 'isfalse';
type TooiBoolean = 'istrue' | 'isfalse';

// 設定項目の初期値は「無効」(最初のボタン表示が早過ぎる/一旦表示すると消さないため)
// 有効だった場合はDOMが変更される間に設定が読み込まれて有効になる
// 無効だった場合はそのままボタンは表示されない
interface Options {
  // 公式Web
  SHOW_ON_TIMELINE: TooiBoolean;
  SHOW_ON_TWEET_DETAIL: TooiBoolean;
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: TooiBoolean;
  SHOW_ON_TWEETDECK_TWEET_DETAIL: TooiBoolean;
  // 画像ページ
  STRIP_IMAGE_SUFFIX: TooiBoolean;
}
type OptionsMaybe = { [key in keyof Options]?: TooiBoolean };
const INITIAL_OPTIONS: Options = {
  // 公式Web
  SHOW_ON_TIMELINE: isFalse,
  SHOW_ON_TWEET_DETAIL: isFalse,
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: isFalse,
  SHOW_ON_TWEETDECK_TWEET_DETAIL: isFalse,
  // 画像ページ
  STRIP_IMAGE_SUFFIX: isFalse,
};
const OPTIONS_TEXT: { [key: string]: string } = {
  // 公式Web
  SHOW_ON_TIMELINE: 'タイムラインにボタンを表示',
  SHOW_ON_TWEET_DETAIL: 'ツイート詳細にボタンを表示',
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: 'タイムラインにボタンを表示',
  SHOW_ON_TWEETDECK_TWEET_DETAIL: 'ツイート詳細にボタンを表示',
  // 画像ページ
  STRIP_IMAGE_SUFFIX: '[Ctrl]+[s]で拡張子を校正',
};

/**
 * ButtonSetter
 */
import { openImages, printException } from './Utils';

// twitter.comでボタンを設置するクラス

class ButtonSetter {
  // タイムラインにボタン表示
  public setButtonOnTimeline(options: Options) {
    if (document.querySelector('#react-root')) {
      this._setButtonOnReactLayoutTimeline(options);
      return;
    }
    this._setButtonOnTimeline(options);
  }

  // ツイート詳細にボタン表示
  public setButtonOnTweetDetail(options: Options) {
    // TODO: Reactレイアウトでも実装する必要がある？
    this._setButtonOnTweetDetail(options);
  }

  protected onClick(e: MouseEvent, imgSrcs: (string | null)[]) {
    // イベント(MouseEvent)による既定の動作をキャンセル
    e.preventDefault();
    // イベント(MouseEvent)の親要素への伝播を停止
    e.stopPropagation();

    openImages(imgSrcs);
  }

  /**
   * エレメントにスタイル当てる
   * @param {HTMLElement} element スタイル当てる対象エレメント
   * @param {Object} propertySet プロパティ名('font-size')と値('10px')のオブジェクト
   */
  protected setStyle(
    element: HTMLElement,
    propertySet: { [key: string]: string }
  ) {
    Object.entries(propertySet).forEach(([key, value]) =>
      element.style.setProperty(key, value)
    );
  }

  protected setButton({
    className,
    getImgSrcs,
    target,
  }: {
    className: string;
    getImgSrcs: () => (string | null)[];
    target: HTMLElement;
  }) {
    const style = {
      width: '70px',
      'font-size': '13px',
      color: this.getActionButtonColor(),
    };

    // <div className='ProfileTweet-action tooi-button-container'>
    //   <input
    //     className='tooi-button'
    //     style={style}
    //     type='button'
    //     value='Original'
    //     onClick={(e) => {
    //       this.onClick(e, imgSrcs);
    //     }}
    //   />
    // </div>

    const button = document.createElement('input');
    button.className = 'tooi-button';
    this.setStyle(button, style);
    button.type = 'button';
    button.value = 'Original';
    button.addEventListener('click', e => {
      this.onClick(e, getImgSrcs());
    });

    const container = document.createElement('div');
    container.classList.add('ProfileTweet-action', className);

    target.appendChild(container);
    container.appendChild(button);
  }

  protected setReactLayoutButton({
    className,
    getImgSrcs,
    target,
  }: {
    className: string;
    getImgSrcs: () => (string | null)[];
    target: HTMLElement;
  }) {
    const button = document.createElement('input');

    button.type = 'button';
    button.value = 'Original';
    const color = this.getReactLayoutActionButtonColor();
    this.setStyle(button, {
      'font-size': '13px',
      padding: '4px 8px',
      color,
      'background-color': 'rgba(0, 0, 0, 0)',
      border: `1px solid ${color}`,
      'border-radius': '3px',
      cursor: 'pointer',
    });
    button.addEventListener('click', e => {
      this.onClick(e, getImgSrcs());
    });

    const container = document.createElement('div');
    // container.id = '' + tweet.id
    container.classList.add(className);
    this.setStyle(container, {
      display: 'flex',
      'margin-left': '20px',
      'flex-flow': 'column',
      'justify-content': 'center',
    });

    target.appendChild(container);
    container.appendChild(button);
  }

  private _setButtonOnTimeline(options: Options) {
    // タイムラインにボタン表示する設定がされているときだけ実行する
    // - isTrue か 設定なし のとき ON
    // - isFalse のとき OFF
    if (!(options[SHOW_ON_TIMELINE] !== isFalse)) {
      return;
    }
    const tweets = document.getElementsByClassName('js-stream-tweet');
    if (!tweets.length) {
      return;
    }
    const className = 'tooi-button-container-timeline';
    // 各ツイートに対して
    Array.from(tweets).forEach(tweet => {
      // 画像ツイートかつまだ処理を行っていないときのみ行う
      if (
        !(
          tweet.getElementsByClassName('AdaptiveMedia-container').length !==
            0 &&
          tweet
            .getElementsByClassName('AdaptiveMedia-container')[0]
            .getElementsByTagName('img').length !== 0
        ) ||
        tweet.getElementsByClassName(className).length !== 0
      ) {
        return;
      }
      // 操作ボタンの外側は様式にあわせる
      const actionList = tweet.querySelector<HTMLElement>(
        '.ProfileTweet-actionList'
      );
      if (!actionList) {
        printException('no target');
        return;
      }

      // 画像の親が取得できたら
      const mediaContainer = tweet.getElementsByClassName(
        'AdaptiveMedia-container'
      )[0] as HTMLElement;
      const getImgSrcs = () =>
        Array.from(
          mediaContainer.getElementsByClassName('AdaptiveMedia-photoContainer')
        ).map(element => element.getElementsByTagName('img')[0].src);
      this.setButton({
        className,
        getImgSrcs,
        target: actionList,
      });
    });
  }

  private _setButtonOnTweetDetail(options: Options) {
    // ツイート詳細にボタン表示する設定がされているときだけ実行する
    // - isTrue か 設定なし のとき ON
    // - isFalse のとき OFF
    if (!(options[SHOW_ON_TWEET_DETAIL] !== isFalse)) {
      return;
    }
    const className = 'tooi-button-container-detail';
    if (
      !document.getElementsByClassName('permalink-tweet-container')[0] ||
      !document
        .getElementsByClassName('permalink-tweet-container')[0]
        .getElementsByClassName('AdaptiveMedia-photoContainer')[0] ||
      document.getElementsByClassName(className).length !== 0
    ) {
      // ツイート詳細ページでない、または、メインツイートが画像ツイートでないとき
      // または、すでに処理を行ってあるとき
      // 何もしない
      return;
    }
    // Originalボタンの親の親となる枠
    const actionList = document.querySelector<HTMLElement>(
      '.permalink-tweet-container .ProfileTweet-actionList'
    );
    if (!actionList) {
      printException('no target');
      return;
    }

    // .AdaptiveMedia-photoContainer: 画像のエレメントからURLを取得する
    const getImgSrcs = () =>
      Array.from(
        document
          .getElementsByClassName('permalink-tweet-container')[0]
          .getElementsByClassName('AdaptiveMedia-photoContainer')
      ).map(element => element.getElementsByTagName('img')[0].src);
    this.setButton({
      className,
      getImgSrcs,
      target: actionList,
    });
  }

  private _setButtonOnReactLayoutTimeline(options: Options) {
    // ツイート詳細にボタン表示する設定がされているときだけ実行する
    // - isTrue か 設定なし のとき ON
    // - isFalse のとき OFF
    if (!(options[SHOW_ON_TIMELINE] !== isFalse)) {
      return;
    }
    const className = 'tooi-button-container-react-timeline';
    const tweets = Array.from(
      document.querySelectorAll('#react-root main section article')
    );
    if (!tweets.length) {
      return;
    }
    // 各ツイートに対して
    tweets.forEach(tweet => {
      // 画像ツイート かつ 画像が1枚でもある かつ まだ処理を行っていないときのみ実行
      const tweetATags = Array.from(tweet.querySelectorAll('a')).filter(aTag =>
        /\/status\/[0-9]+\/photo\//.test(aTag.href)
      );
      if (
        tweetATags.length === 0 ||
        !tweetATags.some(aTag => aTag.querySelector('img')) ||
        tweet.getElementsByClassName(className)[0]
      ) {
        return;
      }
      // ボタンを設置
      // 操作ボタンの外側は様式にあわせる
      const target = tweet.querySelector<HTMLElement>('div[role="group"]');
      if (!target) {
        printException('no target');
        return;
      }

      const getImgSrcs = () => {
        const tweetImgs = tweetATags.map(aTag => aTag.querySelector('img'));
        if (tweetImgs.length === 4) {
          // 4枚のとき2枚目と3枚目のDOMの順序が前後するので直す
          const tweetimgTmp = tweetImgs[1];
          tweetImgs[1] = tweetImgs[2];
          tweetImgs[2] = tweetimgTmp;
        }
        return tweetImgs.map(img => img && img.src);
      };

      this.setReactLayoutButton({
        className,
        getImgSrcs,
        target,
      });
    });
  } // openFromTimeline end

  private getActionButtonColor() {
    // コントラスト比4.5(chromeの推奨する最低ライン)の色
    const contrastLimitColor = '#697b8c';

    const actionButton = document.querySelector(
      '.ProfileTweet-actionButton'
    ) as HTMLElement;
    if (!(actionButton && actionButton.style)) {
      return contrastLimitColor;
    }

    const buttonColor = window.getComputedStyle(actionButton).color;
    if (buttonColor && buttonColor.length > 0) {
      return buttonColor;
    }
    return contrastLimitColor;
  }

  private getReactLayoutActionButtonColor() {
    // 文字色
    // 初期値: コントラスト比4.5(chromeの推奨する最低ライン)の色
    let color = '#697b8c';
    // ツイートアクション(返信とか)のボタンのクラス(夜間モードか否かでクラス名が違う)
    const actionButton = document.querySelector<HTMLElement>(
      'div[role="group"] div[role="button"]'
    );
    if (
      actionButton &&
      actionButton.children[0] &&
      (actionButton.children[0] as HTMLElement).style
    ) {
      const buttonColor = window.getComputedStyle(actionButton.children[0])
        .color;
      if (buttonColor && buttonColor.length > 0) {
        color = buttonColor;
      }
    }

    return color;
  }
}

/**
 * ButtonSetters
 */
import ButtonSetterTweetDeck from './ButtonSetterTweetDeck';

interface ButtonSettersType {
  [key: string]: ButtonSetter | ButtonSetterTweetDeck;
}

// ボタンを設置するクラスのまとめ
const ButtonSetters: ButtonSettersType = {};

ButtonSetters[HOST_TWITTER_COM] = new ButtonSetter();
ButtonSetters[HOST_TWEETDECK_TWITTER_COM] = new ButtonSetterTweetDeck();

/**
 * main
 */
import { getOptions } from './helpers/Utils';

// 実行の間隔(ms)
const INTERVAL = 300;

// 設定
let options = { ...INITIAL_OPTIONS };

// ボタンを設置
export const setButton = (_options: Options) => {
  // console.log('setButton');

  // ボタン設置クラス
  const hostname = new URL(window.location.href).hostname;
  const buttonSetters = ButtonSetters[hostname];

  // console.log('setButton: ' + _options['SHOW_ON_TIMELINE'] + ' ' + _options['SHOW_ON_TWEET_DETAIL'] + ' ' + _options['OPEN_WITH_KEY_PRESS']) // debug
  buttonSetters.setButtonOnTimeline(_options);
  buttonSetters.setButtonOnTweetDetail(_options);
};

let isInterval = false;
let deferred = false;
const setButtonWithInterval = () => {
  // 短時間に何回も実行しないようインターバルを設ける
  if (isInterval) {
    deferred = true;
    return;
  }
  isInterval = true;
  setTimeout(() => {
    isInterval = false;
    if (deferred) {
      setButton(options);
      deferred = false;
    }
  }, INTERVAL);

  setButton(options);
};

// ページ全体でDOMの変更を検知し都度ボタン設置
const observer = new MutationObserver(setButtonWithInterval);
const target = document.querySelector('body')!;
const config = { childList: true, subtree: true };
observer.observe(target, config);

// 設定読み込み
getOptions().then(newOptions => {
  Object.keys(newOptions).forEach((key: keyof Options) => {
    options[key] = newOptions[key] as TooiBoolean;
  });
  // ボタンを(再)設置
  setButtonWithInterval();
});

// 設定反映のためのリスナー設置
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  console.log(chrome.runtime.lastError);
  if (request.method === OPTION_UPDATED) {
    getOptions().then(newOptions => {
      Object.keys(newOptions).forEach((key: keyof Options) => {
        options[key] = newOptions[key] as TooiBoolean;
      });
      // ボタンを(再)設置
      setButtonWithInterval();
      sendResponse({ data: 'done' });
    });
    return true;
  }
  sendResponse({ data: 'yet' });
  return true;
});
