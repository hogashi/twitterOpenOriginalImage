import * as React from 'react';
import * as ReactDOM from 'react-dom';

import ButtonSetter from './ButtonSetter';
import { Options, SHOW_ON_TWEETDECK_TIMELINE, SHOW_ON_TWEETDECK_TWEET_DETAIL, isFalse } from './Constants';
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
        tweet.getElementsByClassName('tooi-a').length
      ) {
        // メディアツイートでない
        // または メディアが画像でない(動画/GIF)
        // または すでにボタンをおいてあるとき
        // 何もしない
        return;
      }

      const target = tweet.getElementsByTagName('footer')[0] as HTMLElement;
      if (tweet.getElementsByClassName('js-media')) {
        const imgSrcs = Array.from(tweet.getElementsByClassName('js-media-image-link')).map(
          element => this.getBackgroundImageUrl(element as HTMLElement)
        );
        if (imgSrcs.length) {
          this.setButton({
            imgSrcs,
            target,
          });
        } else {
          printException('no image srcs on tweetdeck timeline');
        }
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
    const tweets = document.getElementsByClassName('js-tweet-detail');
    if (!tweets.length) {
      return;
    }
    // 各ツイートに対して
    Array.from(tweets).forEach(tweet => {
      if (
        (!tweet.getElementsByClassName('media-img').length &&
          !tweet.getElementsByClassName('media-image').length) ||
        tweet.getElementsByClassName('tooi-a').length
      ) {
        // メディアツイートでない (画像のタグが取得できない)
        // または すでにボタンをおいてあるとき
        // 何もしない
        return;
      }
      const target = tweet.getElementsByTagName('footer')[0] as HTMLElement;

      // 画像エレメントがなかったら終了
      if (tweet.getElementsByClassName('js-media-image-link').length === 0) {
        printException('no image elements on tweetdeck tweet detail');
        return;
      }

      let imgSrcs: string[];
      if (tweet.getElementsByClassName('media-img').length !== 0) {
        imgSrcs = [(tweet.getElementsByClassName('media-img')[0] as HTMLImageElement).src];
      } else {
        imgSrcs = Array.from(tweet.getElementsByClassName('js-media-image-link')).map(element => this.getBackgroundImageUrl(element as HTMLElement));
      }
      this.setButton({
        imgSrcs,
        target,
      });
    });
  }

  protected setButton({ imgSrcs, target }: {
    imgSrcs: string[],
    target: HTMLElement,
  }) {
    // tweetdeckのツイート右上の時刻などに使われているclassを使う
    // 設置の有無の判別用に'tooi-a'を付与する
    const className = 'pull-left margin-txs txt-mute tooi-a';
    // 枠線の色は'Original'と同じく'.txt-mute'の色を使うので取得する
    const borderColor = window.getComputedStyle(document.querySelector('.txt-mute')).color;
    // ボタンのスタイル設定
    const style = {
      border: `1px solid ${borderColor}`,
      borderRadius: '2px',
      display: 'inline-block',
      fontSize: '0.75em',
      marginTop: '5px',
      padding: '1px 1px 0',
      lineHeight: '1.5em',
    };
    // ボタンを設置
    ReactDOM.render(
      <a
        className={className}
        style={style}
        onClick={(e) => {
          this.onClick(e, imgSrcs);
        }}
      >
        Original
      </a>,
      target,
    );
  }

  private getBackgroundImageUrl(element: HTMLElement) {
    return element.style.backgroundImage.replace(/url\("([^"]*)"\)/, '$1');
  }
}
