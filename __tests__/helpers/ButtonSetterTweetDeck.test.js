import ButtonSetterTweetDeck from '../../src/helpers/ButtonSetterTweetDeck';
import {
  INITIAL_OPTIONS,
  SHOW_ON_TWEETDECK_TIMELINE,
  isFalse,
  isTrue,
  SHOW_ON_TWEETDECK_TWEET_DETAIL,
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

/**
 * @param {string[]} imgSrcs
 * @param {string[]} extraClassNames
 * @param {boolean} hasButton
 */
const makeTweetDetail = (imgSrcs, extraClassNames = [], hasButton = false) => {
  const root = document.createElement('div');
  root.classList.add('js-tweet-detail');

  const media = document.createElement('div');

  const footer = document.createElement('footer');
  if (hasButton) {
    const button = document.createElement('div');
    button.classList.add('tooi-button-container-tweetdeck-detail');
    footer.appendChild(button);
  }

  /**
   * - 画像が1枚のとき
   *   - a.js-media-image-link > img.media-img[src="画像URL"]
   * - 画像が複数枚のとき
   *   - a.js-media-image-link.media-image[style="background-image: url("画像URL")"]
   *   - a ...
   */
  if (imgSrcs.length === 1) {
    const aTag = document.createElement('a');
    aTag.classList.add(...['js-media-image-link', ...extraClassNames]);

    const img = document.createElement('img');
    img.classList.add('media-img');
    img.src = imgSrcs[0];

    aTag.appendChild(img);
    media.appendChild(aTag);
  } else {
    imgSrcs.forEach(src => {
      const aTag = document.createElement('a');
      aTag.classList.add(
        ...['js-media-image-link', 'media-image', ...extraClassNames]
      );
      aTag.style.backgroundImage = `url("${src}")`;
      media.appendChild(aTag);
    });
  }

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
      const imgSrcs = ['https://g.co/img1'];
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
      const imgSrcsSet = [
        ['https://g.co/img1'],
        ['https://g.co/img2'],
        ['https://g.co/img3'],
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

    it('画像4枚ツイート3つにボタンつけようとする', () => {
      const imgSrcsSet = [
        [
          'https://g.co/img11',
          'https://g.co/img12',
          'https://g.co/img13',
          'https://g.co/img14',
        ],
        [
          'https://g.co/img21',
          'https://g.co/img22',
          'https://g.co/img23',
          'https://g.co/img24',
        ],
        [
          'https://g.co/img31',
          'https://g.co/img32',
          'https://g.co/img33',
          'https://g.co/img34',
        ],
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
      const imgSrcs = ['https://g.co/video1'];
      makeTweet(imgSrcs, ['is-video']);

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEETDECK_TIMELINE] = isTrue;
      buttonSetter.setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('GIFのツイート1つにボタンつけない', () => {
      const imgSrcs = ['https://g.co/gif1'];
      makeTweet(imgSrcs, ['is-gif']);

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEETDECK_TIMELINE] = isTrue;
      buttonSetter.setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('画像1枚ツイート1つでも,もうボタンあったらボタンつけない', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeTweet(imgSrcs, [], true);

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEETDECK_TIMELINE] = isTrue;
      buttonSetter.setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('ツイート1つあっても画像なかったらボタンつけない', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeTweet(imgSrcs, [], true);

      // 画像の部分ない状態を再現する
      const media = document.querySelector('.js-media');
      media.parentNode.removeChild(media);

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEETDECK_TIMELINE] = isTrue;
      buttonSetter.setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('画像ツイートなかったら何もしない', () => {
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

  describe('setButtonOnTweetDetail', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('画像1枚ツイート詳細にボタンつけようとする', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeTweetDetail(imgSrcs);

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEETDECK_TWEET_DETAIL] = isTrue;
      buttonSetter.setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).toHaveBeenCalledTimes(1);
      expect(buttonSetter.setButton.mock.calls[0][0].className).toStrictEqual(
        'tooi-button-container-tweetdeck-detail'
      );
      expect(
        buttonSetter.setButton.mock.calls[0][0].getImgSrcs()
      ).toMatchObject(imgSrcs);
      expect(
        buttonSetter.setButton.mock.calls[0][0].target.tagName
      ).toStrictEqual('FOOTER');
    });

    it('画像4枚ツイート詳細にボタンつけようとする', () => {
      const imgSrcs = [
        'https://g.co/img1',
        'https://g.co/img2',
        'https://g.co/img3',
        'https://g.co/img4',
      ];
      makeTweetDetail(imgSrcs);

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEETDECK_TWEET_DETAIL] = isTrue;
      buttonSetter.setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).toHaveBeenCalledTimes(1);
      expect(buttonSetter.setButton.mock.calls[0][0].className).toStrictEqual(
        'tooi-button-container-tweetdeck-detail'
      );
      expect(
        buttonSetter.setButton.mock.calls[0][0].getImgSrcs()
      ).toMatchObject(imgSrcs);
      expect(
        buttonSetter.setButton.mock.calls[0][0].target.tagName
      ).toStrictEqual('FOOTER');
    });

    it('画像4枚ツイート詳細3つにボタンつけようとする', () => {
      const imgSrcsSet = [
        [
          'https://g.co/img11',
          'https://g.co/img12',
          'https://g.co/img13',
          'https://g.co/img14',
        ],
        [
          'https://g.co/img21',
          'https://g.co/img22',
          'https://g.co/img23',
          'https://g.co/img24',
        ],
        [
          'https://g.co/img31',
          'https://g.co/img32',
          'https://g.co/img33',
          'https://g.co/img34',
        ],
      ];
      imgSrcsSet.forEach(imgSrcs => {
        makeTweetDetail(imgSrcs);
      });

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEETDECK_TWEET_DETAIL] = isTrue;
      buttonSetter.setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).toHaveBeenCalledTimes(3);
      imgSrcsSet.forEach((imgSrcs, index) => {
        expect(
          buttonSetter.setButton.mock.calls[index][0].className
        ).toStrictEqual('tooi-button-container-tweetdeck-detail');
        expect(
          buttonSetter.setButton.mock.calls[index][0].getImgSrcs()
        ).toMatchObject(imgSrcs);
        expect(
          buttonSetter.setButton.mock.calls[index][0].target.tagName
        ).toStrictEqual('FOOTER');
      });
    });

    it('画像1枚ツイート1つでも,もうボタンあったらボタンつけない', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeTweetDetail(imgSrcs, [], true);

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEETDECK_TWEET_DETAIL] = isTrue;
      buttonSetter.setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    describe('ツイート1つあっても画像なかったらボタンつけない', () => {
      it('img.media-imgがない', () => {
        const imgSrcs = ['https://g.co/img1'];
        makeTweetDetail(imgSrcs, [], true);

        // 画像の部分ない状態を再現する
        const media = document.querySelector('.media-img');
        media.parentNode.removeChild(media);

        const buttonSetter = new ButtonSetterTweetDeck();
        buttonSetter.setButton = jest.fn();

        const options = INITIAL_OPTIONS;
        options[SHOW_ON_TWEETDECK_TIMELINE] = isTrue;
        buttonSetter.setButtonOnTimeline(options);

        expect(buttonSetter.setButton).not.toHaveBeenCalled();
      });

      it('a.js-media-image-linkがない', () => {
        const imgSrcs = ['https://g.co/img1'];
        makeTweetDetail(imgSrcs, [], true);

        // 画像の部分ない状態を再現する
        const media = document.querySelector('.js-media-image-link');
        media.parentNode.removeChild(media);

        const buttonSetter = new ButtonSetterTweetDeck();
        buttonSetter.setButton = jest.fn();

        const options = INITIAL_OPTIONS;
        options[SHOW_ON_TWEETDECK_TIMELINE] = isTrue;
        buttonSetter.setButtonOnTimeline(options);

        expect(buttonSetter.setButton).not.toHaveBeenCalled();
      });
    });

    it('画像ツイートなかったら何もしない', () => {
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
      options[SHOW_ON_TWEETDECK_TWEET_DETAIL] = isFalse;
      buttonSetter.setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });
  });
});
