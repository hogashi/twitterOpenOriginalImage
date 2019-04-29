import {
  Options,
  SHOW_ON_TIMELINE,
  SHOW_ON_TWEET_DETAIL,
  isFalse,
} from './Constants';
import { openImages, printException } from './Utils';

// twitter.comでボタンを設置するクラス

export default class ButtonSetter {
  // タイムラインにボタン表示
  public setButtonOnTimeline(options: Options) {
    if (document.querySelectorAll('#react-root')) {
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

  protected onClick(e: MouseEvent, imgSrcs: string[]) {
    // イベント(MouseEvent)による既定の動作をキャンセル
    e.preventDefault();
    // イベント(MouseEvent)の親要素への伝播を停止
    e.stopPropagation();

    openImages(imgSrcs);
  }

  // エレメントへのstyle属性の設定
  protected setStyle(element: HTMLElement, attrSet: { [key: string]: string }) {
    const style = Object.entries(attrSet)
      .map(entry => entry.join(': '))
      .join('; ');
    element.setAttribute('style', style);
  }

  protected setButton({
    imgSrcs,
    target,
  }: {
    imgSrcs: string[];
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
      this.onClick(e, imgSrcs);
    });

    const container = document.createElement('div');
    container.className = 'ProfileTweet-action tooi-button-container';

    target.appendChild(container);
    container.appendChild(button);
  }

  protected setReactLayoutButton({
    imgSrcs,
    target,
  }: {
    imgSrcs: string[];
    target: HTMLElement;
  }) {
    const button = document.createElement('input');

    button.type = 'button';
    button.value = 'Original';
    const color = this.getReactLayoutActionButtonColor();
    this.setStyle(button, {
      fontSize: '13px',
      padding: '4px 8px',
      color,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      border: `1px solid ${color}`,
      borderRadius: '3px',
      cursor: 'pointer',
    });
    button.addEventListener('click', e => {
      this.onClick(e, imgSrcs);
    });

    const container = document.createElement('div');
    // container.id = '' + tweet.id
    container.className = 'tooi-button-container';
    this.setStyle(container, {
      display: 'flex',
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
        // 操作ボタンの外側は様式にあわせる
        const actionList = tweet.getElementsByClassName(
          'ProfileTweet-actionList'
        )[0] as HTMLElement;

        // 画像の親が取得できたら
        const mediaContainer = tweet.getElementsByClassName(
          'AdaptiveMedia-container'
        )[0];
        if (mediaContainer) {
          const imgSrcs = Array.from(
            mediaContainer.getElementsByClassName(
              'AdaptiveMedia-photoContainer'
            )
          ).map(element => element.getElementsByTagName('img')[0].src);
          if (imgSrcs.length) {
            this.setButton({
              imgSrcs,
              target: actionList,
            });
          } else {
            printException('no image urls on timeline');
          }
        } else {
          printException('no image container on timeline');
        }
      }
    });
  }

  private _setButtonOnTweetDetail(options: Options) {
    // ツイート詳細にボタン表示する設定がされているときだけ実行する
    // - isTrue か 設定なし のとき ON
    // - isFalse のとき OFF
    if (!(options[SHOW_ON_TWEET_DETAIL] !== isFalse)) {
      return;
    }
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
      .getElementsByClassName('ProfileTweet-actionList')[0] as HTMLElement;

    // .AdaptiveMedia-photoContainer: 画像のエレメントからURLを取得する
    const imgSrcs = Array.from(
      document
        .getElementsByClassName('permalink-tweet-container')[0]
        .getElementsByClassName('AdaptiveMedia-photoContainer')
    ).map(element => element.getElementsByTagName('img')[0].src);
    if (imgSrcs.length) {
      this.setButton({
        imgSrcs,
        target: actionList,
      });
    } else {
      printException('no image urls on tweet detail');
    }
  }

  private _setButtonOnReactLayoutTimeline(options: Options) {
    // ツイート詳細にボタン表示する設定がされているときだけ実行する
    // - isTrue か 設定なし のとき ON
    // - isFalse のとき OFF
    if (!(options[SHOW_ON_TIMELINE] !== isFalse)) {
      return;
    }
    const tweets = Array.from(
      document.querySelectorAll('#react-root main section article')
    );
    if (!tweets.length) {
      return;
    }
    // 各ツイートに対して
    tweets.forEach(tweet => {
      // 画像ツイート かつ まだ処理を行っていないときのみ実行
      const tweetATags = Array.from(
        tweet.querySelectorAll('div div div div div div div div div a')
      ).filter(aTag => /\/status\/[0-9]+\/photo\//.test(aTag.href));
      if (
        tweetATags.length === 0 ||
        tweet.getElementsByClassName('tooi-button')[0]
      ) {
        return;
      }
      // ボタンを設置
      // 操作ボタンの外側は様式にあわせる
      const target: HTMLElement = tweet.querySelector(
        'div div div[role="group"]'
      );

      const tweetImgs = Array.from(
        tweet.querySelectorAll('div div div div div div div a')
      )
        .filter((aTag: HTMLAnchorElement) =>
          /\/status\/[0-9]+\/photo\//.test(aTag.href)
        )
        .map(aTag => aTag.querySelector('img'));
      // 画像エレメントが取得できなかったら終了
      if (tweetImgs.length === 0) {
        printException('no image elements on timeline in react layout');
        return;
      }
      if (tweetImgs.length === 4) {
        // 4枚のとき2枚目と3枚目のDOMの順序が前後するので直す
        const tweetimgTmp = tweetImgs[1];
        tweetImgs[1] = tweetImgs[2];
        tweetImgs[2] = tweetimgTmp;
      }
      const imgSrcs = tweetImgs.map(img => img.src);

      this.setReactLayoutButton({ imgSrcs, target });
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
    const actionButton: HTMLElement =
      document.querySelector('.rn-1re7ezh') ||
      document.querySelector('.rn-111h2gw');
    if (actionButton && actionButton.style) {
      const buttonColor = window.getComputedStyle(actionButton).color;
      if (buttonColor && buttonColor.length > 0) {
        color = buttonColor;
      }
    }

    return color;
  }
}
