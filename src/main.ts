import { isImageTab, isTweetdeck, isTwitter } from './constants';
import { fixFileNameOnSaveCommand, updateOptions } from './utils';

interface ImageTweetInfoSet {
  tweet: HTMLElement;
  imageSrcs: string[];
  buttonParentSelector: string;
}

// TODO: 設定を取得して出し分ける
// TODO: ボタンのスタイルを拾う
const collectTweetAndImagesSets = (): ImageTweetInfoSet[] => {
  const tweetAndImagesSets: ImageTweetInfoSet[] = [];
  // 公式Webの旧レイアウト
  // タイムライン
  document.querySelectorAll<HTMLElement>('.js-stream-tweet').forEach(tweet => {
    const imageSrcs = Array.from(
      tweet.querySelectorAll<HTMLImageElement>(
        '.AdaptiveMedia-container .AdaptiveMedia-photoContainer img'
      )
    ).map(img => img.src);
    tweetAndImagesSets.push({
      tweet,
      imageSrcs,
      buttonParentSelector: '.ProfileTweet-actionList',
    });
  });
  // ツイート詳細
  const twitterComTweetDetail = document.querySelector<HTMLElement>(
    '.permalink-tweet-container'
  );
  if (twitterComTweetDetail) {
    const imageSrcs = Array.from(
      twitterComTweetDetail.querySelectorAll<HTMLImageElement>(
        '.AdaptiveMedia-photoContainer img'
      )
    ).map(img => img.src);
    tweetAndImagesSets.push({
      tweet: twitterComTweetDetail,
      imageSrcs,
      buttonParentSelector: '.ProfileTweet-actionList',
    });
  }

  // 公式Webの現レイアウト
  document
    .querySelectorAll<HTMLElement>('#react-root main section article')
    .forEach(tweet => {
      const imageSrcs = Array.from(
        tweet.querySelectorAll<HTMLImageElement>(
          'a[href*="/status/"][href*="/photo/"] img'
        )
      ).map(img => img.src);
      tweetAndImagesSets.push({
        tweet,
        imageSrcs,
        buttonParentSelector: 'div[role="group"]',
      });
    });

  // TweetDeck
  // タイムライン
  document
    .querySelectorAll<HTMLElement>('.js-stream-item.is-actionable')
    .forEach(tweet => {
      const imageSrcs = Array.from(
        tweet.querySelectorAll<HTMLElement>('.js-media-image-link')
      ).map(elem =>
        elem.style.backgroundImage.replace(/url\("?([^"]*)"?\)/, '$1')
      );
      tweetAndImagesSets.push({
        tweet,
        imageSrcs,
        buttonParentSelector: 'footer',
      });
    });
  // ツイート詳細
  document.querySelectorAll<HTMLElement>('.js-tweet-detail').forEach(tweet => {
    const imageSrcs = [
      tweet.querySelector<HTMLImageElement>('img.media-img')?.src ||
        tweet
          .querySelector<HTMLElement>('.media-image')
          ?.style.backgroundImage.replace(/url\("?([^"]*)"?\)/, '$1') ||
        '',
    ];
    tweetAndImagesSets.push({
      tweet,
      imageSrcs,
      buttonParentSelector: 'footer',
    });
  });

  return tweetAndImagesSets;
};

updateOptions().then(options => {
  if (isTwitter() || isTweetdeck()) {
    /** 公式Web/TweetDeck */
    collectTweetAndImagesSets();
  } else if (isImageTab()) {
    /** 画像ページ(https://pbs.twimg.com/*) */
    fixFileNameOnSaveCommand(options);
  }
});
