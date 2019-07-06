import ButtonSetters from '../../helpers/ButtonSetters';
import { HOST_TWITTER_COM, HOST_TWEETDECK_TWITTER_COM } from '../../helpers/Constants';
import ButtonSetter from '../../helpers/ButtonSetter';
import ButtonSetterTweetDeck from '../../helpers/ButtonSetterTweetDeck';

describe('ButtonSetters', () => {
  it('ホストごとクラスが入っている', () => {
    expect(ButtonSetters[HOST_TWITTER_COM]).toBeInstanceOf(ButtonSetter);
    expect(ButtonSetters[HOST_TWEETDECK_TWITTER_COM]).toBeInstanceOf(ButtonSetterTweetDeck);
  })
});
