updateOptions().then(options => {
  if (isTwitter() || isTweetdeck()) {
    /** 公式Web/TweetDeck */
    setOriginalButton(options);
  } else if (isImageTab()) {
    /** 画像ページ(https://pbs.twimg.com/*) */
    fixFileNameOnSaveCommand(options);
  }
});
