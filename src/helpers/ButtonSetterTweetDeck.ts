import ButtonSetter from './ButtonSetter';
import {
  Options,
  SHOW_ON_TWEETDECK_TIMELINE,
  SHOW_ON_TWEETDECK_TWEET_DETAIL,
  isFalse,
} from './Constants';
import { printException } from './Utils';

// tweetdeck.twitter.comでボタンを設置するクラス

export default class ButtonSetterTweetDeck extends ButtonSetter {
  // タイムラインにボタン表示
  public setButtonOnTimeline(options: Options) {
    // タイムラインにボタン表示する設定がされているときだけ実行する
    // - isTrue か 設定なし のとき ON
    // - isFalse のとき OFF
    if (!(options[SHOW_ON_TWEETDECK_TIMELINE] !== isFalse)) {
      return;
    }
    // if タイムラインのツイートを取得できたら
    // is-actionable: タイムラインのみ
    const tweets = document.getElementsByClassName(
      'js-stream-item is-actionable'
    ) as HTMLCollectionOf<HTMLElement>;
    if (!tweets.length) {
      return;
    }
    const className = 'tooi-button-container-tweetdeck-timeline';
    // 各ツイートに対して
    Array.from(tweets).forEach(tweet => {
      if (
        !tweet.getElementsByClassName('js-media-image-link').length ||
        tweet.getElementsByClassName('is-video').length ||
        tweet.getElementsByClassName('is-gif').length ||
        tweet.getElementsByClassName(className).length
      ) {
        // メディアツイートでない
        // または メディアが画像でない(動画/GIF)
        // または すでにボタンをおいてあるとき
        // 何もしない
        return;
      }

      const target = tweet.getElementsByTagName('footer')[0] as HTMLElement;
      if (tweet.getElementsByClassName('js-media')) {
        const getImgSrcs = () => {
          return Array.from(
            tweet.getElementsByClassName('js-media-image-link')
          ).map(element => this.getBackgroundImageUrl(element as HTMLElement));
        };
        this.setButton({
          className,
          getImgSrcs,
          target,
        });
      } else {
        printException('no image elements on tweetdeck timeline');
      }
    });
  }

  // ツイート詳細にボタン表示
  public setButtonOnTweetDetail(options: Options) {
    // ツイート詳細にボタン表示する設定がされているときだけ実行する
    // - isTrue か 設定なし のとき ON
    // - isFalse のとき OFF
    if (!(options[SHOW_ON_TWEETDECK_TWEET_DETAIL] !== isFalse)) {
      return;
    }
    // console.log('TODO, ボタン実装') // TODO, debug
    // if タイムラインのツイートを取得できたら
    // is-actionable: タイムラインのみ
    const tweets = document.getElementsByClassName(
      'js-tweet-detail'
    ) as HTMLCollectionOf<HTMLElement>;
    if (!tweets.length) {
      return;
    }
    const className = 'tooi-button-container-tweetdeck-detail';
    // 各ツイートに対して
    Array.from(tweets).forEach(tweet => {
      if (
        (!tweet.getElementsByClassName('media-img').length &&
          !tweet.getElementsByClassName('media-image').length) ||
        tweet.getElementsByClassName(className).length
      ) {
        // メディアツイートでない (画像のタグが取得できない)
        // または すでにボタンをおいてあるとき
        // 何もしない
        return;
      }
      const target = tweet.getElementsByTagName(
        'footer'
      )[0] as HTMLElement | null;

      // 画像エレメントがなかったら終了
      if (tweet.getElementsByClassName('js-media-image-link').length === 0) {
        printException('no image elements on tweetdeck tweet detail');
        return;
      }

      const getImgSrcs = () => {
        if (tweet.getElementsByClassName('media-img').length !== 0) {
          return [
            (tweet.getElementsByClassName('media-img')[0] as HTMLImageElement)
              .src,
          ];
        } else {
          return Array.from(
            tweet.getElementsByClassName('js-media-image-link')
          ).map(element => this.getBackgroundImageUrl(element as HTMLElement));
        }
      };

      this.setButton({
        className,
        getImgSrcs,
        target,
      });
    });
  }

  protected setButton({
    className,
    getImgSrcs,
    target,
  }: {
    className: string;
    getImgSrcs: () => (string | null)[];
    target: HTMLElement | null;
  }) {
    if (!target) {
      printException('no target');
      return;
    }
    // 枠線の色は'Original'と同じく'.txt-mute'の色を使うので取得する
    const txtMute = document.querySelector('.txt-mute');
    const borderColor = txtMute
      ? window.getComputedStyle(txtMute).color
      : '#697b8c';
    // ボタンのスタイル設定
    const style = {
      border: `1px solid ${borderColor}`,
      'border-radius': '2px',
      display: 'inline-block',
      'font-size': '0.75em',
      'margin-top': '5px',
      padding: '1px 1px 0',
      'line-height': '1.5em',
      cursor: 'pointer',
    };

    // <a
    //   className={className}
    //   style={style}
    //   onClick={(e) => {
    //     this.onClick(e, imgSrcs);
    //   }}
    // >
    //   Original
    // </a>

    // tweetdeckのツイート右上の時刻などに使われているclassを使う
    // 設置の有無の判別用にclassNameを付与する
    const button = document.createElement('a');
    button.className = `pull-left margin-txs txt-mute ${className}`;
    this.setStyle(button, style);
    button.addEventListener('click', e => {
      this.onClick(e, getImgSrcs());
    });
    button.insertAdjacentText('beforeend', 'Original');

    target.appendChild(button);
  }

  private getBackgroundImageUrl(element: HTMLElement) {
    if (element.style && element.style.backgroundImage) {
      return element.style.backgroundImage.replace(/url\("([^"]*)"\)/, '$1');
    }
    return null;
  }
}
