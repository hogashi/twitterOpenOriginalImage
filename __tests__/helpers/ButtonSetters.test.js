import ButtonSetters from '../../src/helpers/ButtonSetters';
import {
  HOST_TWITTER_COM,
  HOST_TWEETDECK_TWITTER_COM,
} from '../../src/helpers/Constants';
import ButtonSetter from '../../src/helpers/ButtonSetter';
import ButtonSetterTweetDeck from '../../src/helpers/ButtonSetterTweetDeck';

describe('ButtonSetters', () => {
  it('ホストごとクラスが入っている', () => {
    expect(ButtonSetters[HOST_TWITTER_COM]).toBeInstanceOf(ButtonSetter);
    expect(ButtonSetters[HOST_TWEETDECK_TWITTER_COM]).toBeInstanceOf(
      ButtonSetterTweetDeck
    );
  });
});
