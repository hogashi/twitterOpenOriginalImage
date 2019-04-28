import ButtonSetter from './ButtonSetter';
import ButtonSetterTweetDeck from './ButtonSetterTweetDeck';
import * as Constants from './Constants';

// ボタンを設置するクラスのまとめ
const ButtonSetters: {
  [key: string]: ButtonSetter | ButtonSetterTweetDeck;
} = {};
export default ButtonSetters;

ButtonSetters[Constants.HOST_TWITTER_COM] = new ButtonSetter;
ButtonSetters[Constants.HOST_TWEETDECK_TWITTER_COM] = new ButtonSetterTweetDeck;
