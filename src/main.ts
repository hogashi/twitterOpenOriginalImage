import { isTweetdeck, isTwitter } from './constants';
import { setOriginalButton, updateOptions } from './utils';

updateOptions().then((options) => {
  if (isTwitter() || isTweetdeck()) {
    /** 公式Web/TweetDeck */
    setOriginalButton(options);
  }
});
