import { isImageTab, isReactView, isTweetdeck, isTwitter, OptionsBool } from './constants';
import { setOriginalButtonOnReactView } from './setOriginalButtonOnReactView';
import { fixFileNameOnSaveCommand, updateOptions } from './utils';

updateOptions().then((options) => {
  if (isTwitter() || isTweetdeck()) {
    /** 公式Web/TweetDeck */
    setOriginalButton2(options);
  } else if (isImageTab()) {
    /** 画像ページ(https://pbs.twimg.com/*) */
    fixFileNameOnSaveCommand(options);
  }
});

function setOriginalButton2(options: OptionsBool) {
  if (isReactView()) {
    setOriginalButtonOnReactView(options);
  } else {
    setOriginalButtonOnLegacyView(options);
  }
}
