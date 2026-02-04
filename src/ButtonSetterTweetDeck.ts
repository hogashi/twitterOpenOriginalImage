import type { ButtonSetterType } from './ButtonSetter';
import {
  type OptionsBool,
  ORIGINAL_BUTTON_TEXT_OPTION_KEY,
  SHOW_ON_TWEETDECK_TIMELINE,
  SHOW_ON_TWEETDECK_TWEET_DETAIL,
} from './constants';
import { onOriginalButtonClick, printException, setStyle } from './utils';

/**
 * tweetdeck.twitter.comでボタンを設置するクラス
 */
export class ButtonSetterTweetDeck implements ButtonSetterType {
  // タイムラインにボタン表示
  public setButtonOnTimeline(currentOptions: OptionsBool): void {
    // タイムラインにボタン表示する設定がされているときだけ実行する
    if (!currentOptions[SHOW_ON_TWEETDECK_TIMELINE]) {
      return;
    }
    // if タイムラインのツイートを取得できたら
    // is-actionable: タイムラインのみ
    const tweets = document.getElementsByClassName('js-stream-item is-actionable') as HTMLCollectionOf<HTMLElement>;
    if (!tweets.length) {
      return;
    }
    const className = 'tooi-button-container-tweetdeck-timeline';
    // 各ツイートに対して
    Array.from(tweets).forEach((tweet) => {
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

      const target = tweet.querySelector('footer');
      if (!target) {
        // ボタンを置く場所がないとき
        // 何もしない
        printException('no target');
        return;
      }

      const getImgSrcs = (): string[] => {
        return Array.from(tweet.getElementsByClassName('js-media-image-link'))
          .map((element) => {
            const urlstr = this.getBackgroundImageUrl(element as HTMLElement);
            // filter で string[] にするためにここで string[] にする……
            return urlstr ? urlstr : '';
          })
          .filter((urlstr) => urlstr !== '');
      };
      this.setButton({
        className,
        getImgSrcs,
        target,
        text: currentOptions[ORIGINAL_BUTTON_TEXT_OPTION_KEY],
      });
    });
  }

  // ツイート詳細にボタン表示
  // - 公式の新しいhtmlでは使えないが, 古いhtmlで閲覧している人がいるので残してある
  public setButtonOnTweetDetail(currentOptions: OptionsBool): void {
    // ツイート詳細にボタン表示する設定がされているときだけ実行する
    if (!currentOptions[SHOW_ON_TWEETDECK_TWEET_DETAIL]) {
      return;
    }
    // if ツイート詳細を取得できたら
    const tweets = document.getElementsByClassName('js-tweet-detail') as HTMLCollectionOf<HTMLElement>;
    if (!tweets.length) {
      return;
    }
    const className = 'tooi-button-container-tweetdeck-detail';
    // 各ツイートに対して
    Array.from(tweets).forEach((tweet) => {
      if (
        !(tweet.getElementsByClassName('media-img').length || tweet.getElementsByClassName('media-image').length) ||
        tweet.getElementsByClassName(className).length
      ) {
        // メディアツイートでない (画像のタグが取得できない)
        // または すでにボタンをおいてあるとき
        // 何もしない
        return;
      }
      const target = tweet.querySelector('footer');
      if (!target) {
        // ボタンを置く場所がないとき
        // 何もしない
        printException('no target');
        return;
      }

      const getImgSrcs = (): string[] => {
        if (tweet.getElementsByClassName('media-img').length !== 0) {
          return [(tweet.getElementsByClassName('media-img')[0] as HTMLImageElement).src];
        }
        return Array.from(tweet.getElementsByClassName('media-image'))
          .map((element) => {
            const urlstr = this.getBackgroundImageUrl(element as HTMLElement);
            // filter で string[] にするためにここで string[] にする……
            return urlstr ? urlstr : '';
          })
          .filter((urlstr) => urlstr !== '');
      };

      this.setButton({
        className,
        getImgSrcs,
        target,
        text: currentOptions[ORIGINAL_BUTTON_TEXT_OPTION_KEY],
      });
    });
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
    // 枠線の色は'Original'と同じく'.txt-mute'の色を使うので取得する
    const txtMute = document.querySelector('.txt-mute');
    const borderColor = txtMute ? window.getComputedStyle(txtMute).color : '#697b8c';
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

    /* つくるDOMは以下 */
    /*
      <a
        className={className}
        style={style}
        onClick={(e) => {
          onOriginalButtonClick(e, imgSrcs);
        }}
      >
        Original
      </a>
    */

    // tweetdeckのツイート右上の時刻などに使われているclassを使う
    // 設置の有無の判別用にclassNameを付与する
    const button = document.createElement('a');
    button.className = `pull-left margin-txs txt-mute ${className}`;
    setStyle(button, style);
    button.addEventListener('click', (e) => {
      onOriginalButtonClick(e, getImgSrcs());
    });
    button.insertAdjacentHTML('beforeend', text);

    target.appendChild(button);
  }

  private getBackgroundImageUrl(element: HTMLElement): string | null {
    if (element.style.backgroundImage) {
      return element.style.backgroundImage.replace(/url\("?([^"]*)"?\)/, '$1');
    }
    return null;
  }
}
