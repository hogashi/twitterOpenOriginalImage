import ButtonSetter from './ButtonSetter';
import ButtonSetterTweetDeck from './ButtonSetterTweetDeck';
import * as Constants from './Constants';

interface ButtonSettersType {
  [key: string]: ButtonSetter | ButtonSetterTweetDeck;
}

// ボタンを設置するクラスのまとめ
const ButtonSetters: ButtonSettersType = {};

ButtonSetters[Constants.HOST_TWITTER_COM] = new ButtonSetter;
ButtonSetters[Constants.HOST_TWEETDECK_TWITTER_COM] = new ButtonSetterTweetDeck;

export default ButtonSetters;
