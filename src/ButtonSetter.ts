import {
  ORIGINAL_BUTTON_TEXT_OPTION_KEY,
  type OptionsBool,
  SHOW_ON_TIMELINE,
  SHOW_ON_TWEETDECK_TIMELINE,
  SHOW_ON_TWEET_DETAIL,
  isTweetdeck,
  isTwitter,
} from './constants';
import { onOriginalButtonClick, printException, setStyle } from './utils';

export interface ButtonSetterType {
  setButtonOnTimeline: (currentOptions: OptionsBool) => void;
  setButtonOnTweetDetail: (currentOptions: OptionsBool) => void;
}

/**
 * twitter.comでボタンを設置するクラス
 */
export class ButtonSetter implements ButtonSetterType {
  // タイムラインにボタン表示
  public setButtonOnTimeline(currentOptions: OptionsBool): void {
    // 昔のビューの処理はしばらく残す
    // ref: https://github.com/hogashi/twitterOpenOriginalImage/issues/32#issuecomment-578510155
    if (document.querySelector('#react-root')) {
      this._setButtonOnReactLayoutTimeline(currentOptions);
      return;
    }
    this._setButtonOnTimeline(currentOptions);
  }

  // ツイート詳細にボタン表示
  public setButtonOnTweetDetail(currentOptions: OptionsBool): void {
    // 昔のビューの処理はしばらく残す
    // - 公式の新しいhtmlでは使えないが, 古いhtmlで閲覧している人がいるので残してある
    this._setButtonOnTweetDetail(currentOptions);
  }

  private setButton({
    className,
    getImgSrcs,
    target,
    text,
  }: {
    className: string;
    getImgSrcs: () => string[];
    target: HTMLElement;
    text: string;
  }): void {
    const style = {
      width: '70px',
      'font-size': '13px',
      color: this.getActionButtonColor(),
    };

    /* つくるDOMは以下 */
    /*
      <div className='ProfileTweet-action tooi-button-container'>
        <input
          className='tooi-button'
          style={style}
          type='button'
          value='Original'
          onClick={(e) => {
            onOriginalButtonClick(e, imgSrcs);
          }}
        />
      </div>
    */

    const button = document.createElement('input');
    button.className = 'tooi-button';
    setStyle(button, style);
    button.type = 'button';
    button.value = text;
    button.addEventListener('click', (e) => {
      onOriginalButtonClick(e, getImgSrcs());
    });

    const container = document.createElement('div');
    container.classList.add('ProfileTweet-action', className);

    target.appendChild(container);
    container.appendChild(button);
  }

  private setReactLayoutButton({
    className,
    getImgSrcs,
    target,
    text,
  }: {
    className: string;
    getImgSrcs: () => string[];
    target: HTMLElement;
    text: string;
  }): void {
    const button = document.createElement('input');

    button.type = 'button';
    button.value = text;
    const color = this.getReactLayoutActionButtonColor();
    setStyle(button, {
      'font-size': '13px',
      padding: '4px 8px',
      color,
      'background-color': 'rgba(0, 0, 0, 0)',
      border: `1px solid ${color}`,
      'border-radius': '3px',
      cursor: 'pointer',
    });
    button.addEventListener('click', (e) => {
      onOriginalButtonClick(e, getImgSrcs());
    });

    const container = document.createElement('div');
    // container.id = '' + tweet.id
    container.classList.add(className);
    setStyle(container, {
      display: 'flex',
      'flex-flow': 'column',
      'justify-content': 'center',
    });

    // 新しいTweetDeckで, カラムの幅によってはボタンがはみ出るので,
    // 折り返してボタンを表示する
    setStyle(target, { 'flex-wrap': 'wrap' });

    target.appendChild(container);
    container.appendChild(button);
  }

  private _setButtonOnTimeline(currentOptions: OptionsBool): void {
    // タイムラインにボタン表示する設定がされているときだけ実行する
    if (!currentOptions[SHOW_ON_TIMELINE]) {
      return;
    }
    const tweets = document.getElementsByClassName('js-stream-tweet');
    if (!tweets.length) {
      return;
    }
    const className = 'tooi-button-container-timeline';
    // 各ツイートに対して
    Array.from(tweets).forEach((tweet) => {
      // 画像ツイートかつまだ処理を行っていないときのみ行う
      if (
        !(
          tweet.getElementsByClassName('AdaptiveMedia-container').length !== 0 &&
          tweet.getElementsByClassName('AdaptiveMedia-container')[0].getElementsByTagName('img').length !== 0
        ) ||
        tweet.getElementsByClassName(className).length !== 0
      ) {
        return;
      }
      // 操作ボタンの外側は様式にあわせる
      const actionList = tweet.querySelector<HTMLElement>('.ProfileTweet-actionList');
      if (!actionList) {
        printException('no target');
        return;
      }

      // 画像の親が取得できたら
      const mediaContainer = tweet.getElementsByClassName('AdaptiveMedia-container')[0] as HTMLElement;
      const getImgSrcs = (): string[] =>
        Array.from(mediaContainer.getElementsByClassName('AdaptiveMedia-photoContainer')).map(
          (element) => element.getElementsByTagName('img')[0].src,
        );
      this.setButton({
        className,
        getImgSrcs,
        target: actionList,
        text: currentOptions[ORIGINAL_BUTTON_TEXT_OPTION_KEY],
      });
    });
  }

  private _setButtonOnTweetDetail(currentOptions: OptionsBool): void {
    // ツイート詳細にボタン表示する設定がされているときだけ実行する
    if (!currentOptions[SHOW_ON_TWEET_DETAIL]) {
      return;
    }
    const className = 'tooi-button-container-detail';
    if (
      !document
        .getElementsByClassName('permalink-tweet-container')[0]
        ?.getElementsByClassName('AdaptiveMedia-photoContainer')[0] ||
      document.getElementsByClassName(className).length !== 0
    ) {
      // ツイート詳細ページでない、または、メインツイートが画像ツイートでないとき
      // または、すでに処理を行ってあるとき
      // 何もしない
      return;
    }
    // Originalボタンの親の親となる枠
    const actionList = document.querySelector<HTMLElement>('.permalink-tweet-container .ProfileTweet-actionList');
    if (!actionList) {
      printException('no target');
      return;
    }

    // .AdaptiveMedia-photoContainer: 画像のエレメントからURLを取得する
    const getImgSrcs = (): string[] =>
      Array.from(
        document
          .getElementsByClassName('permalink-tweet-container')[0]
          .getElementsByClassName('AdaptiveMedia-photoContainer'),
      ).map((element) => element.getElementsByTagName('img')[0].src);
    this.setButton({
      className,
      getImgSrcs,
      target: actionList,
      text: currentOptions[ORIGINAL_BUTTON_TEXT_OPTION_KEY],
    });
  }

  private _setButtonOnReactLayoutTimeline(currentOptions: OptionsBool): void {
    // タイムラインにボタン表示する設定がされているときだけ実行する
    // 公式Webと, 新しいTweetDeckで呼ばれる
    if (
      (isTwitter() && !currentOptions[SHOW_ON_TIMELINE]) ||
      (isTweetdeck() && !currentOptions[SHOW_ON_TWEETDECK_TIMELINE])
    ) {
      return;
    }
    const className = 'tooi-button-container-react-timeline';
    const tweets = Array.from(document.querySelectorAll('#react-root main section article'));
    if (!tweets.length) {
      return;
    }
    // 各ツイートに対して
    tweets.forEach((tweet) => {
      // 画像ツイート かつ 画像が1枚でもある かつ まだ処理を行っていないときのみ実行
      const tweetATags = Array.from(tweet.querySelectorAll('a')).filter((aTag) =>
        /\/status\/[0-9]+\/photo\//.test(aTag.href),
      );
      if (
        tweetATags.length === 0 ||
        tweetATags.every((aTag) => !aTag.querySelector('img')) ||
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

      const getImgSrcs = (): string[] => {
        const tweetImgs = tweetATags.map((aTag) => aTag.querySelector('img'));
        return tweetImgs
          .map((img) =>
            // filter で string[] にするためにここで string[] にする……
            img ? img.src : '',
          )
          .filter((src) => src !== '');
      };

      this.setReactLayoutButton({
        className,
        getImgSrcs,
        target,
        text: currentOptions[ORIGINAL_BUTTON_TEXT_OPTION_KEY],
      });
    });
  }

  private getActionButtonColor(): string {
    // コントラスト比4.5(chromeの推奨する最低ライン)の色
    const contrastLimitColor = '#697b8c';

    const actionButton = document.querySelector('.ProfileTweet-actionButton') as HTMLElement;
    if (!actionButton?.style) {
      return contrastLimitColor;
    }

    const buttonColor = window.getComputedStyle(actionButton).color;
    if (buttonColor && buttonColor.length > 0) {
      return buttonColor;
    }
    return contrastLimitColor;
  }

  private getReactLayoutActionButtonColor(): string {
    // 文字色
    // 初期値: コントラスト比4.5(chromeの推奨する最低ライン)の色
    let color = '#697b8c';
    // ツイートアクション(返信とか)のボタンのクラス(夜間モードか否かでクラス名が違う)
    const actionButtonSvg = document.querySelector<SVGSVGElement>('div[role="group"] div[role="button"] svg');
    if (actionButtonSvg) {
      const buttonColor = window.getComputedStyle(actionButtonSvg).color;
      if (buttonColor && buttonColor.length > 0) {
        color = buttonColor;
      }
    }

    return color;
  }
}
