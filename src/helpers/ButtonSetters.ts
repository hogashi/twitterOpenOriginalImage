import ButtonSetter from './ButtonSetter';
import ButtonSetterTweetDeck from './ButtonSetterTweetDeck';
import { HOST_TWITTER_COM, HOST_TWEETDECK_TWITTER_COM } from './Constants';

interface ButtonSettersType {
  [key: string]: ButtonSetter | ButtonSetterTweetDeck;
}

// ボタンを設置するクラスのまとめ
const ButtonSetters: ButtonSettersType = {};

ButtonSetters[HOST_TWITTER_COM] = new ButtonSetter();
ButtonSetters[HOST_TWEETDECK_TWITTER_COM] = new ButtonSetterTweetDeck();

export default ButtonSetters;
