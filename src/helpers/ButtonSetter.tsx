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

  // ツイート詳細にボタン表示
  public setButtonOnTweetDetail(options: Options) {
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
      fontSize: '13px',
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
}
