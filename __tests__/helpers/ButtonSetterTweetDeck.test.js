import ButtonSetterTweetDeck from '../../src/helpers/ButtonSetterTweetDeck';
import {
  INITIAL_OPTIONS,
  SHOW_ON_TWEETDECK_TIMELINE,
  isFalse,
  isTrue,
} from '../../src/helpers/Constants';

jest.mock('../../src/helpers/Utils');

/**
 * @param {string[]} imgSrcs
 * @param {string[]} extraClassNames
 * @param {boolean} hasButton
 */
const makeTweet = (imgSrcs, extraClassNames = [], hasButton = false) => {
  const root = document.createElement('div');
  root.classList.add('js-stream-item', 'is-actionable');

  const media = document.createElement('div');
  media.classList.add('js-media');

  const footer = document.createElement('footer');
  if (hasButton) {
    const button = document.createElement('div');
    button.classList.add('tooi-button-container-tweetdeck-timeline');
    footer.appendChild(button);
  }

  imgSrcs.forEach(src => {
    const div = document.createElement('div');
    div.classList.add(...['js-media-image-link', ...extraClassNames]);
    div.style.backgroundImage = `url("${src}")`;
    media.appendChild(div);
  });

  root.appendChild(media);
  root.appendChild(footer);
  document.body.appendChild(root);
};

describe('ButtonSetterTweetDeck', () => {
  describe('setButtonOnTimeline', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('画像1枚ツイート1つにボタンつけようとする', () => {
      const imgSrcs = ['img1'];
      makeTweet(imgSrcs);

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEETDECK_TIMELINE] = isTrue;
      buttonSetter.setButtonOnTimeline(options);

      expect(buttonSetter.setButton).toHaveBeenCalledTimes(1);
      expect(buttonSetter.setButton.mock.calls[0][0].className).toStrictEqual(
        'tooi-button-container-tweetdeck-timeline'
      );
      expect(
        buttonSetter.setButton.mock.calls[0][0].getImgSrcs()
      ).toMatchObject(imgSrcs);
      expect(
        buttonSetter.setButton.mock.calls[0][0].target.tagName
      ).toStrictEqual('FOOTER');
    });

    it('画像1枚ツイート3つにボタンつけようとする', () => {
      const imgSrcsSet = [['img1'], ['img2'], ['img3']];
      imgSrcsSet.forEach(imgSrcs => {
        makeTweet(imgSrcs);
      });

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEETDECK_TIMELINE] = isTrue;
      buttonSetter.setButtonOnTimeline(options);

      expect(buttonSetter.setButton).toHaveBeenCalledTimes(3);
      imgSrcsSet.forEach((imgSrcs, index) => {
        expect(
          buttonSetter.setButton.mock.calls[index][0].className
        ).toStrictEqual('tooi-button-container-tweetdeck-timeline');
        expect(
          buttonSetter.setButton.mock.calls[index][0].getImgSrcs()
        ).toMatchObject(imgSrcs);
        expect(
          buttonSetter.setButton.mock.calls[index][0].target.tagName
        ).toStrictEqual('FOOTER');
      });
    });

    it('画像4枚ツイート3つにボタンつけようとする', () => {
      const imgSrcsSet = [
        ['img11', 'img12', 'img13', 'img14'],
        ['img21', 'img22', 'img23', 'img24'],
        ['img31', 'img32', 'img33', 'img34'],
      ];
      imgSrcsSet.forEach(imgSrcs => {
        makeTweet(imgSrcs);
      });

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEETDECK_TIMELINE] = isTrue;
      buttonSetter.setButtonOnTimeline(options);

      expect(buttonSetter.setButton).toHaveBeenCalledTimes(3);
      imgSrcsSet.forEach((imgSrcs, index) => {
        expect(
          buttonSetter.setButton.mock.calls[index][0].className
        ).toStrictEqual('tooi-button-container-tweetdeck-timeline');
        expect(
          buttonSetter.setButton.mock.calls[index][0].getImgSrcs()
        ).toMatchObject(imgSrcs);
        expect(
          buttonSetter.setButton.mock.calls[index][0].target.tagName
        ).toStrictEqual('FOOTER');
      });
    });

    it('動画のツイート1つにボタンつけない', () => {
      const imgSrcs = ['video1'];
      makeTweet(imgSrcs, ['is-video']);

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEETDECK_TIMELINE] = isTrue;
      buttonSetter.setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('GIFのツイート1つにボタンつけない', () => {
      const imgSrcs = ['gif1'];
      makeTweet(imgSrcs, ['is-gif']);

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEETDECK_TIMELINE] = isTrue;
      buttonSetter.setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('画像1枚ツイート1つでも,もうボタンあったらボタンつけない', () => {
      const imgSrcs = ['img1'];
      makeTweet(imgSrcs, [], true);

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEETDECK_TIMELINE] = isTrue;
      buttonSetter.setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('設定がOFFなら何もしない', () => {
      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEETDECK_TIMELINE] = isFalse;
      buttonSetter.setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });
  });
});
