import { ButtonSetterTweetDeck } from '../src/ButtonSetterTweetDeck';
import { SHOW_ON_TWEETDECK_TIMELINE, SHOW_ON_TWEETDECK_TWEET_DETAIL } from '../src/constants';

function makeAllEnabledOptions() {
  return {
    SHOW_ON_TIMELINE: true,
    SHOW_ON_TWEET_DETAIL: true,
    SHOW_ON_TWEETDECK_TIMELINE: true,
    SHOW_ON_TWEETDECK_TWEET_DETAIL: true,
    STRIP_IMAGE_SUFFIX: true,
  };
}

describe('ButtonSetterTweetDeck', () => {
  describe('setButtonOnTimeline', () => {
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

      imgSrcs.forEach((src) => {
        const div = document.createElement('div');
        div.classList.add(...['js-media-image-link', ...extraClassNames]);
        div.style.backgroundImage = `url("${src}")`;
        media.appendChild(div);
      });

      root.appendChild(media);
      root.appendChild(footer);
      document.body.appendChild(root);
    };

    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('画像1枚ツイート1つにボタンつけようとする', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeTweet(imgSrcs);

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter.setButtonOnTimeline(options);

      expect(buttonSetter.setButton).toHaveBeenCalledTimes(1);
      expect(buttonSetter.setButton.mock.calls[0][0].className).toStrictEqual(
        'tooi-button-container-tweetdeck-timeline',
      );
      expect(buttonSetter.setButton.mock.calls[0][0].getImgSrcs()).toMatchObject(imgSrcs);
      expect(buttonSetter.setButton.mock.calls[0][0].target.tagName).toStrictEqual('FOOTER');
    });

    it('画像1枚ツイート3つにボタンつけようとする', () => {
      const imgSrcsSet = [['https://g.co/img1'], ['https://g.co/img2'], ['https://g.co/img3']];
      imgSrcsSet.forEach((imgSrcs) => {
        makeTweet(imgSrcs);
      });

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter.setButtonOnTimeline(options);

      expect(buttonSetter.setButton).toHaveBeenCalledTimes(3);
      imgSrcsSet.forEach((imgSrcs, index) => {
        expect(buttonSetter.setButton.mock.calls[index][0].className).toStrictEqual(
          'tooi-button-container-tweetdeck-timeline',
        );
        expect(buttonSetter.setButton.mock.calls[index][0].getImgSrcs()).toMatchObject(imgSrcs);
        expect(buttonSetter.setButton.mock.calls[index][0].target.tagName).toStrictEqual('FOOTER');
      });
    });

    it('画像4枚ツイート3つにボタンつけようとする', () => {
      const imgSrcsSet = [
        ['https://g.co/img11', 'https://g.co/img12', 'https://g.co/img13', 'https://g.co/img14'],
        ['https://g.co/img21', 'https://g.co/img22', 'https://g.co/img23', 'https://g.co/img24'],
        ['https://g.co/img31', 'https://g.co/img32', 'https://g.co/img33', 'https://g.co/img34'],
      ];
      imgSrcsSet.forEach((imgSrcs) => {
        makeTweet(imgSrcs);
      });

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter.setButtonOnTimeline(options);

      expect(buttonSetter.setButton).toHaveBeenCalledTimes(3);
      imgSrcsSet.forEach((imgSrcs, index) => {
        expect(buttonSetter.setButton.mock.calls[index][0].className).toStrictEqual(
          'tooi-button-container-tweetdeck-timeline',
        );
        expect(buttonSetter.setButton.mock.calls[index][0].getImgSrcs()).toMatchObject(imgSrcs);
        expect(buttonSetter.setButton.mock.calls[index][0].target.tagName).toStrictEqual('FOOTER');
      });
    });

    it('動画のツイート1つにボタンつけない', () => {
      const imgSrcs = ['https://g.co/video1'];
      makeTweet(imgSrcs, ['is-video']);

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter.setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('GIFのツイート1つにボタンつけない', () => {
      const imgSrcs = ['https://g.co/gif1'];
      makeTweet(imgSrcs, ['is-gif']);

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter.setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('画像1枚ツイート1つでも,もうボタンあったらボタンつけない', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeTweet(imgSrcs, [], true);

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter.setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('ツイート1つあっても画像なかったらボタンつけない', () => {
      const imgSrcs = [];
      makeTweet(imgSrcs);

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter.setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('footerがなかったらボタンつけない', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeTweet(imgSrcs);

      const footer = document.querySelector('footer');
      footer.parentNode.removeChild(footer);

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter.setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('画像ツイートなかったら何もしない', () => {
      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter.setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('設定がOFFなら何もしない', () => {
      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      options[SHOW_ON_TWEETDECK_TIMELINE] = false;
      buttonSetter.setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });
  });

  describe('setButtonOnTweetDetail', () => {
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
        imgSrcs.forEach((src) => {
          const aTag = document.createElement('a');
          aTag.classList.add(...['js-media-image-link', 'media-image', ...extraClassNames]);
          aTag.style.backgroundImage = `url("${src}")`;
          media.appendChild(aTag);
        });
      }

      root.appendChild(media);
      root.appendChild(footer);
      document.body.appendChild(root);
    };

    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('画像1枚ツイート詳細にボタンつけようとする', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeTweetDetail(imgSrcs);

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter.setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).toHaveBeenCalledTimes(1);
      expect(buttonSetter.setButton.mock.calls[0][0].className).toStrictEqual('tooi-button-container-tweetdeck-detail');
      expect(buttonSetter.setButton.mock.calls[0][0].getImgSrcs()).toMatchObject(imgSrcs);
      expect(buttonSetter.setButton.mock.calls[0][0].target.tagName).toStrictEqual('FOOTER');
    });

    it('画像4枚ツイート詳細にボタンつけようとする', () => {
      const imgSrcs = ['https://g.co/img1', 'https://g.co/img2', 'https://g.co/img3', 'https://g.co/img4'];
      makeTweetDetail(imgSrcs);

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter.setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).toHaveBeenCalledTimes(1);
      expect(buttonSetter.setButton.mock.calls[0][0].className).toStrictEqual('tooi-button-container-tweetdeck-detail');
      expect(buttonSetter.setButton.mock.calls[0][0].getImgSrcs()).toMatchObject(imgSrcs);
      expect(buttonSetter.setButton.mock.calls[0][0].target.tagName).toStrictEqual('FOOTER');
    });

    it('画像4枚ツイート詳細3つにボタンつけようとする', () => {
      const imgSrcsSet = [
        ['https://g.co/img11', 'https://g.co/img12', 'https://g.co/img13', 'https://g.co/img14'],
        ['https://g.co/img21', 'https://g.co/img22', 'https://g.co/img23', 'https://g.co/img24'],
        ['https://g.co/img31', 'https://g.co/img32', 'https://g.co/img33', 'https://g.co/img34'],
      ];
      imgSrcsSet.forEach((imgSrcs) => {
        makeTweetDetail(imgSrcs);
      });

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter.setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).toHaveBeenCalledTimes(3);
      imgSrcsSet.forEach((imgSrcs, index) => {
        expect(buttonSetter.setButton.mock.calls[index][0].className).toStrictEqual(
          'tooi-button-container-tweetdeck-detail',
        );
        expect(buttonSetter.setButton.mock.calls[index][0].getImgSrcs()).toMatchObject(imgSrcs);
        expect(buttonSetter.setButton.mock.calls[index][0].target.tagName).toStrictEqual('FOOTER');
      });
    });

    it('画像でないツイート1つにボタンつけない', () => {
      const imgSrcs = ['https://g.co/video1'];
      makeTweetDetail(imgSrcs, ['is-video']);

      const media = [...document.querySelectorAll('.media-img'), ...document.querySelectorAll('.media-image')];
      media.forEach((medium) => medium.classList.remove('media-img', 'media-image'));

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter.setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('画像1枚ツイート1つでも,もうボタンあったらボタンつけない', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeTweetDetail(imgSrcs, [], true);

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter.setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    describe('ツイート1つあっても画像なかったらボタンつけない', () => {
      it('img.media-imgがない', () => {
        const imgSrcs = ['https://g.co/img1'];
        makeTweetDetail(imgSrcs);

        const media = document.querySelector('.media-img');
        media.parentNode.removeChild(media);

        const buttonSetter = new ButtonSetterTweetDeck();
        buttonSetter.setButton = jest.fn();

        const options = makeAllEnabledOptions();
        buttonSetter.setButtonOnTweetDetail(options);

        expect(buttonSetter.setButton).not.toHaveBeenCalled();
      });

      it('a.media-imageがない', () => {
        const imgSrcs = ['https://g.co/img1', 'https://g.co/img2'];
        makeTweetDetail(imgSrcs);

        const media = document.querySelectorAll('.media-image');
        Array.from(media).forEach((medium) => medium.parentNode.removeChild(medium));

        const buttonSetter = new ButtonSetterTweetDeck();
        buttonSetter.setButton = jest.fn();

        const options = makeAllEnabledOptions();
        buttonSetter.setButtonOnTweetDetail(options);

        expect(buttonSetter.setButton).not.toHaveBeenCalled();
      });
    });

    it('footerがなかったらボタンつけない', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeTweetDetail(imgSrcs);

      const footer = document.querySelector('footer');
      footer.parentNode.removeChild(footer);

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter.setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('画像ツイートなかったら何もしない', () => {
      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter.setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('設定がOFFなら何もしない', () => {
      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      options[SHOW_ON_TWEETDECK_TWEET_DETAIL] = false;
      buttonSetter.setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });
  });

  describe('setButton', () => {
    const className = 'hogeclass';
    const imgSrcs = ['src1', 'src2'];
    const getImgSrcs = () => imgSrcs;

    describe('txt-muteある', () => {
      document.body.innerHTML = '';

      const root = document.createElement('div');
      root.classList.add('txt-mute');
      root.style.color = '#123456';

      const target = document.createElement('footer');
      root.appendChild(target);
      document.body.appendChild(root);

      const text = 'Original';

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton({ className, getImgSrcs, target, text });

      const button = target.querySelector(`a.${className}`);

      it('ボタン設置される', () => {
        expect(button).toBeTruthy();
        expect(target.innerHTML).toMatchSnapshot();
      });

      it('ボタンにスタイルついている', () => {
        const styles = button.style;
        expect(styles.border).toStrictEqual('1px solid rgb(18, 52, 86)'); // #123456 -> rgb(18, 52, 86)
        expect(styles.borderRadius).toStrictEqual('2px');
        expect(styles.display).toStrictEqual('inline-block');
        expect(styles.fontSize).toStrictEqual('0.75em');
        expect(styles.marginTop).toStrictEqual('5px');
        expect(styles.padding).toStrictEqual('1px 1px 0px 1px');
        expect(styles.lineHeight).toStrictEqual('1.5em');
        expect(styles.cursor).toStrictEqual('pointer');
      });

      /* SKIP: なぜかうまくmockできないので飛ばす */
      // it('ボタン押すとonClick呼ばれる', () => {
      //   main.onOriginalButtonClick = jest.fn();
      //   button.click();
      //   expect(main.onOriginalButtonClick).toHaveBeenCalledTimes(1);
      //   expect(main.onOriginalButtonClick.mock.calls[0][0]).toBeInstanceOf(
      //     MouseEvent
      //   );
      //   expect(main.onOriginalButtonClick.mock.calls[0][1]).toStrictEqual(
      //     imgSrcs
      //   );
      // });
    });

    describe('txt-muteない', () => {
      document.body.innerHTML = '';

      const root = document.createElement('div');

      const target = document.createElement('footer');
      root.appendChild(target);
      document.body.appendChild(root);

      const text = 'Original';

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton({ className, getImgSrcs, target, text });

      const button = target.querySelector(`a.${className}`);

      it('ボタン設置される', () => {
        expect(button).toBeTruthy();
        expect(target.innerHTML).toMatchSnapshot();
      });

      it('ボタンにスタイルついている', () => {
        const styles = button.style;
        expect(styles.border).toStrictEqual('1px solid rgb(105, 123, 140)');
        expect(styles.borderRadius).toStrictEqual('2px');
        expect(styles.display).toStrictEqual('inline-block');
        expect(styles.fontSize).toStrictEqual('0.75em');
        expect(styles.marginTop).toStrictEqual('5px');
        expect(styles.padding).toStrictEqual('1px 1px 0px 1px');
        expect(styles.lineHeight).toStrictEqual('1.5em');
        expect(styles.cursor).toStrictEqual('pointer');
      });
    });

    describe('ボタンのテキストを指定するとそれが入る', () => {
      document.body.innerHTML = '';

      const root = document.createElement('div');
      root.classList.add('txt-mute');
      root.style.color = '#123456';

      const target = document.createElement('footer');
      root.appendChild(target);
      document.body.appendChild(root);

      const text = '原寸';

      const buttonSetter = new ButtonSetterTweetDeck();
      buttonSetter.setButton({ className, getImgSrcs, target, text });

      const button = target.querySelector(`a.${className}`);

      it('ボタン設置される', () => {
        expect(button).toBeTruthy();
        expect(target.innerHTML).toMatchSnapshot();
      });

      it('ボタンにスタイルついている', () => {
        const styles = button.style;
        expect(styles.border).toStrictEqual('1px solid rgb(18, 52, 86)'); // #123456 -> rgb(18, 52, 86)
        expect(styles.borderRadius).toStrictEqual('2px');
        expect(styles.display).toStrictEqual('inline-block');
        expect(styles.fontSize).toStrictEqual('0.75em');
        expect(styles.marginTop).toStrictEqual('5px');
        expect(styles.padding).toStrictEqual('1px 1px 0px 1px');
        expect(styles.lineHeight).toStrictEqual('1.5em');
        expect(styles.cursor).toStrictEqual('pointer');
      });

      /* SKIP: なぜかうまくmockできないので飛ばす */
      // it('ボタン押すとonClick呼ばれる', () => {
      //   main.onOriginalButtonClick = jest.fn();
      //   button.click();
      //   expect(main.onOriginalButtonClick).toHaveBeenCalledTimes(1);
      //   expect(main.onOriginalButtonClick.mock.calls[0][0]).toBeInstanceOf(
      //     MouseEvent
      //   );
      //   expect(main.onOriginalButtonClick.mock.calls[0][1]).toStrictEqual(
      //     imgSrcs
      //   );
      // });
    });
  });

  describe('getBackgroundImageUrl', () => {
    const buttonSetter = new ButtonSetterTweetDeck();
    const element = document.createElement('div');

    it('背景画像がURL', () => {
      element.style.backgroundImage = 'url("http://g.co/img1")';
      expect(buttonSetter.getBackgroundImageUrl(element)).toStrictEqual('http://g.co/img1');
    });

    it('背景画像が空文字', () => {
      element.style.backgroundImage = '';
      expect(buttonSetter.getBackgroundImageUrl(element)).toBeNull();
    });
  });
});
