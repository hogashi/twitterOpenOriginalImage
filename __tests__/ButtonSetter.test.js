// import * as main from '../src/main';
import { SHOW_ON_TIMELINE, isFalse, SHOW_ON_TWEET_DETAIL, isTrue } from '../src/constants';
import { ButtonSetter } from '../src/ButtonSetter';

function makeAllEnabledOptions() {
  return {
    SHOW_ON_TIMELINE: isTrue,
    SHOW_ON_TWEET_DETAIL: isTrue,
    SHOW_ON_TWEETDECK_TIMELINE: isTrue,
    SHOW_ON_TWEETDECK_TWEET_DETAIL: isTrue,
    STRIP_IMAGE_SUFFIX: isTrue,
  };
}

describe('ButtonSetter', () => {
  describe('setButtonOnTimeline', () => {
    it('従来のレイアウト(not React)', () => {
      const buttonSetter = new ButtonSetter();
      buttonSetter._setButtonOnTimeline = jest.fn();
      buttonSetter._setButtonOnReactLayoutTimeline = jest.fn();

      buttonSetter.setButtonOnTimeline(makeAllEnabledOptions());

      expect(buttonSetter._setButtonOnTimeline).toHaveBeenCalledTimes(1);
      expect(buttonSetter._setButtonOnReactLayoutTimeline).not.toHaveBeenCalled();
    });

    it('新しいレイアウト(React)', () => {
      const buttonSetter = new ButtonSetter();
      buttonSetter._setButtonOnTimeline = jest.fn();
      buttonSetter._setButtonOnReactLayoutTimeline = jest.fn();

      const root = document.createElement('div');
      root.setAttribute('id', 'react-root');
      document.querySelector('body').appendChild(root);
      buttonSetter.setButtonOnTimeline(makeAllEnabledOptions());

      expect(buttonSetter._setButtonOnTimeline).not.toHaveBeenCalled();

      expect(buttonSetter._setButtonOnReactLayoutTimeline).toHaveBeenCalledTimes(1);
    });
  });

  describe('setButtonOnTweetDetail', () => {
    it('詳細ツイートでもボタン置く(従来レイアウトのみ)', () => {
      const buttonSetter = new ButtonSetter();
      buttonSetter._setButtonOnTweetDetail = jest.fn();

      buttonSetter.setButtonOnTweetDetail(makeAllEnabledOptions());
      expect(buttonSetter._setButtonOnTweetDetail).toHaveBeenCalledTimes(1);
    });
  });

  describe('setButton', () => {
    const className = 'hogeclass';
    const imgSrcs = ['src1', 'src2'];
    const getImgSrcs = () => imgSrcs;
    const target = document.createElement('div');

    const buttonSetter = new ButtonSetter();
    buttonSetter.setButton({ className, getImgSrcs, target });

    it('ボタン設置される', () => {
      expect(target.innerHTML).toMatchSnapshot();
    });

    /* SKIP: なぜかうまくmockできないので飛ばす */
    // it('ボタン押すとonClick呼ばれる', () => {
    //   main.onOriginalButtonClick = jest.fn();
    //   const button = target.querySelector('input');
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

  describe('setReactLayoutButton', () => {
    const className = 'hogeclass';
    const imgSrcs = ['src1', 'src2'];
    const getImgSrcs = () => imgSrcs;
    const target = document.createElement('div');

    const buttonSetter = new ButtonSetter();
    buttonSetter.setReactLayoutButton({ className, getImgSrcs, target });

    it('ボタン設置される', () => {
      expect(target.innerHTML).toMatchSnapshot();
    });

    /* SKIP: なぜかうまくmockできないので飛ばす */
    // it('ボタン押すとonClick呼ばれる', () => {
    //   main.onOriginalButtonClick = jest.fn();
    //   const button = target.querySelector('input');
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

  describe('_setButtonOnTimeline', () => {
    /**
     * @param {string[]} imgSrcs
     * @param {HTMLElement[]} extraElements
     * @param {boolean} hasButton
     */
    const makeTweet = (imgSrcs, extraElements = [], hasButton = false) => {
      const root = document.createElement('div');
      root.classList.add('js-stream-tweet');

      const media = document.createElement('div');
      media.classList.add('AdaptiveMedia-container');

      const actionList = document.createElement('div');
      actionList.classList.add('ProfileTweet-actionList');
      if (hasButton) {
        const button = document.createElement('div');
        button.classList.add('tooi-button-container-timeline');
        actionList.appendChild(button);
      }

      imgSrcs.forEach((src) => {
        const div = document.createElement('div');
        div.classList.add('AdaptiveMedia-photoContainer');

        const img = document.createElement('img');
        img.src = src;

        div.appendChild(img);
        media.appendChild(div);
      });

      extraElements.forEach((element) => media.appendChild(element));

      root.appendChild(media);
      root.appendChild(actionList);
      document.body.appendChild(root);
    };

    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('画像1枚ツイート1つにボタンつけようとする', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeTweet(imgSrcs);

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnTimeline(options);

      expect(buttonSetter.setButton).toHaveBeenCalledTimes(1);
      expect(buttonSetter.setButton.mock.calls[0][0].className).toStrictEqual('tooi-button-container-timeline');
      expect(buttonSetter.setButton.mock.calls[0][0].getImgSrcs()).toMatchObject(imgSrcs);
      expect(buttonSetter.setButton.mock.calls[0][0].target.classList.contains('ProfileTweet-actionList')).toBeTruthy();
    });

    it('画像1枚ツイート3つにボタンつけようとする', () => {
      const imgSrcsSet = [['https://g.co/img1'], ['https://g.co/img2'], ['https://g.co/img3']];
      imgSrcsSet.forEach((imgSrcs) => {
        makeTweet(imgSrcs);
      });

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnTimeline(options);

      expect(buttonSetter.setButton).toHaveBeenCalledTimes(3);
      imgSrcsSet.forEach((imgSrcs, index) => {
        expect(buttonSetter.setButton.mock.calls[index][0].className).toStrictEqual('tooi-button-container-timeline');
        expect(buttonSetter.setButton.mock.calls[index][0].getImgSrcs()).toMatchObject(imgSrcs);
        expect(
          buttonSetter.setButton.mock.calls[index][0].target.classList.contains('ProfileTweet-actionList'),
        ).toBeTruthy();
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

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnTimeline(options);

      expect(buttonSetter.setButton).toHaveBeenCalledTimes(3);
      imgSrcsSet.forEach((imgSrcs, index) => {
        expect(buttonSetter.setButton.mock.calls[index][0].className).toStrictEqual('tooi-button-container-timeline');
        expect(buttonSetter.setButton.mock.calls[index][0].getImgSrcs()).toMatchObject(imgSrcs);
        expect(
          buttonSetter.setButton.mock.calls[index][0].target.classList.contains('ProfileTweet-actionList'),
        ).toBeTruthy();
      });
    });

    it('動画/GIFのツイート1つにボタンつけない', () => {
      const imgSrcs = [];
      makeTweet(imgSrcs, [document.createElement('video')]);

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('画像1枚ツイート1つでも,もうボタンあったらボタンつけない', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeTweet(imgSrcs, [], true);

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('画像ツイート1つあっても画像なかったらボタンつけない', () => {
      const imgSrcs = [];
      makeTweet(imgSrcs);

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('ツイート1つあっても画像ツイートじゃなかったらボタンつけない', () => {
      const imgSrcs = [];
      makeTweet(imgSrcs);

      const container = document.querySelector('.AdaptiveMedia-container');
      container.parentNode.removeChild(container);

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('actionList(いいねとか)がなかったらボタンつけない', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeTweet(imgSrcs);

      const actionList = document.querySelector('.ProfileTweet-actionList');
      actionList.parentNode.removeChild(actionList);

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('画像ツイートなかったら何もしない', () => {
      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('設定がOFFなら何もしない', () => {
      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      options[SHOW_ON_TIMELINE] = isFalse;
      buttonSetter._setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });
  });

  describe('_setButtonOnTweetDetail', () => {
    /**
     * @param {string[]} imgSrcs
     * @param {HTMLElement[]} extraElements
     * @param {boolean} hasButton
     */
    const makeTweetDetail = (imgSrcs, extraElements = [], hasButton = false) => {
      const root = document.createElement('div');
      root.classList.add('permalink-tweet-container');

      const actionList = document.createElement('div');
      actionList.classList.add('ProfileTweet-actionList');
      if (hasButton) {
        const button = document.createElement('div');
        button.classList.add('tooi-button-container-detail');
        actionList.appendChild(button);
      }

      imgSrcs.forEach((src) => {
        const media = document.createElement('div');
        media.classList.add('AdaptiveMedia-photoContainer');

        const img = document.createElement('img');
        img.src = src;

        media.appendChild(img);
        root.appendChild(media);
      });

      extraElements.forEach((element) => root.appendChild(element));

      root.appendChild(actionList);
      document.body.appendChild(root);
    };

    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('画像1枚ツイート詳細にボタンつけようとする', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeTweetDetail(imgSrcs);

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).toHaveBeenCalledTimes(1);
      expect(buttonSetter.setButton.mock.calls[0][0].className).toStrictEqual('tooi-button-container-detail');
      expect(buttonSetter.setButton.mock.calls[0][0].getImgSrcs()).toMatchObject(imgSrcs);
      expect(buttonSetter.setButton.mock.calls[0][0].target.classList.contains('ProfileTweet-actionList')).toBeTruthy();
    });

    it('画像4枚ツイート詳細にボタンつけようとする', () => {
      const imgSrcs = ['https://g.co/img1', 'https://g.co/img2', 'https://g.co/img3', 'https://g.co/img4'];
      makeTweetDetail(imgSrcs);

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).toHaveBeenCalledTimes(1);
      expect(buttonSetter.setButton.mock.calls[0][0].className).toStrictEqual('tooi-button-container-detail');
      expect(buttonSetter.setButton.mock.calls[0][0].getImgSrcs()).toMatchObject(imgSrcs);
      expect(buttonSetter.setButton.mock.calls[0][0].target.classList.contains('ProfileTweet-actionList')).toBeTruthy();
    });

    it('画像でないツイート1つにボタンつけない', () => {
      const imgSrcs = ['https://g.co/video1'];
      makeTweetDetail(imgSrcs);

      const media = document.querySelectorAll('.AdaptiveMedia-photoContainer');
      media.forEach((medium) => medium.classList.remove('AdaptiveMedia-photoContainer'));

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('画像1枚ツイート1つでも,もうボタンあったらボタンつけない', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeTweetDetail(imgSrcs, [], true);

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('ツイート1つあっても画像なかったらボタンつけない', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeTweetDetail(imgSrcs);

      // 画像を全部消す
      const media = document.querySelectorAll('.AdaptiveMedia-photoContainer');
      media.forEach((medium) => medium.parentNode.removeChild(medium));

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('actionListがなかったらボタンつけない', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeTweetDetail(imgSrcs);

      const actionList = document.querySelector('.ProfileTweet-actionList');
      actionList.parentNode.removeChild(actionList);

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('画像ツイートなかったら何もしない', () => {
      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('設定がOFFなら何もしない', () => {
      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = makeAllEnabledOptions();
      options[SHOW_ON_TWEET_DETAIL] = isFalse;
      buttonSetter.setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });
  });

  describe('_setButtonOnReactLayoutTimeline', () => {
    /**
     * @param {string[]} imgSrcs
     * @param {string} type
     * @param {boolean} hasButton
     */
    const makeReactTweet = (imgSrcs, type = 'photo', hasButton = false) => {
      const reactRoot = document.createElement('div');
      reactRoot.id = 'react-root';
      const main = document.createElement('main');
      const section = document.createElement('section');

      const root = document.createElement('article');

      const actionList = document.createElement('div');
      actionList.setAttribute('role', 'group');
      if (hasButton) {
        const button = document.createElement('div');
        button.classList.add('tooi-button-container-react-timeline');
        actionList.appendChild(button);
      }

      imgSrcs.forEach((src, index) => {
        const aTag = document.createElement('a');
        aTag.href = `https://twitter.com/tos/status/000000/${type}/${index}`;

        const img = document.createElement('img');
        img.src = src;

        aTag.appendChild(img);
        root.appendChild(aTag);
      });

      root.appendChild(actionList);

      section.appendChild(root);
      main.appendChild(section);
      reactRoot.appendChild(main);
      document.body.appendChild(reactRoot);
    };

    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('画像1枚ツイート1つにボタンつけようとする', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeReactTweet(imgSrcs);

      const buttonSetter = new ButtonSetter();
      buttonSetter.setReactLayoutButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnReactLayoutTimeline(options);

      expect(buttonSetter.setReactLayoutButton).toHaveBeenCalledTimes(1);
      expect(buttonSetter.setReactLayoutButton.mock.calls[0][0].className).toStrictEqual(
        'tooi-button-container-react-timeline',
      );
      expect(buttonSetter.setReactLayoutButton.mock.calls[0][0].getImgSrcs()).toMatchObject(imgSrcs);
      expect(buttonSetter.setReactLayoutButton.mock.calls[0][0].target.getAttribute('role')).toStrictEqual('group');
    });

    it('画像1枚ツイート3つにボタンつけようとする', () => {
      const imgSrcsSet = [['https://g.co/img1'], ['https://g.co/img2'], ['https://g.co/img3']];
      imgSrcsSet.forEach((imgSrcs) => {
        makeReactTweet(imgSrcs);
      });

      const buttonSetter = new ButtonSetter();
      buttonSetter.setReactLayoutButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnReactLayoutTimeline(options);

      expect(buttonSetter.setReactLayoutButton).toHaveBeenCalledTimes(3);
      imgSrcsSet.forEach((imgSrcs, index) => {
        expect(buttonSetter.setReactLayoutButton.mock.calls[index][0].className).toStrictEqual(
          'tooi-button-container-react-timeline',
        );
        expect(buttonSetter.setReactLayoutButton.mock.calls[index][0].getImgSrcs()).toMatchObject(imgSrcs);
        expect(buttonSetter.setReactLayoutButton.mock.calls[index][0].target.getAttribute('role')).toStrictEqual(
          'group',
        );
      });
    });

    it('画像4枚ツイート3つにボタンつけようとする', () => {
      const imgSrcsSet = [
        ['https://g.co/img11', 'https://g.co/img12', 'https://g.co/img13', 'https://g.co/img14'],
        ['https://g.co/img21', 'https://g.co/img22', 'https://g.co/img23', 'https://g.co/img24'],
        ['https://g.co/img31', 'https://g.co/img32', 'https://g.co/img33', 'https://g.co/img34'],
      ];
      imgSrcsSet.forEach((imgSrcs) => {
        makeReactTweet(imgSrcs);
      });

      const buttonSetter = new ButtonSetter();
      buttonSetter.setReactLayoutButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnReactLayoutTimeline(options);

      expect(buttonSetter.setReactLayoutButton).toHaveBeenCalledTimes(3);
      imgSrcsSet.forEach((imgSrcs, index) => {
        expect(buttonSetter.setReactLayoutButton.mock.calls[index][0].className).toStrictEqual(
          'tooi-button-container-react-timeline',
        );
        expect(buttonSetter.setReactLayoutButton.mock.calls[index][0].getImgSrcs()).toMatchObject(imgSrcs);
        expect(buttonSetter.setReactLayoutButton.mock.calls[index][0].target.getAttribute('role')).toStrictEqual(
          'group',
        );
      });
    });

    it('画像でないツイート1つにボタンつけない', () => {
      const imgSrcs = ['https://g.co/video1'];
      makeReactTweet(imgSrcs, 'video');

      const buttonSetter = new ButtonSetter();
      buttonSetter.setReactLayoutButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnReactLayoutTimeline(options);

      expect(buttonSetter.setReactLayoutButton).not.toHaveBeenCalled();
    });

    it('画像1枚ツイート1つでも,もうボタンあったらボタンつけない', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeReactTweet(imgSrcs, 'photo', true);

      const buttonSetter = new ButtonSetter();
      buttonSetter.setReactLayoutButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnReactLayoutTimeline(options);

      expect(buttonSetter.setReactLayoutButton).not.toHaveBeenCalled();
    });

    it('画像ツイート1つあっても画像なかったらボタンつけない', () => {
      const imgSrcs = [];
      makeReactTweet(imgSrcs);

      const buttonSetter = new ButtonSetter();
      buttonSetter.setReactLayoutButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnReactLayoutTimeline(options);

      expect(buttonSetter.setReactLayoutButton).not.toHaveBeenCalled();
    });

    it('actionList(いいねとか)がなかったらボタンつけない', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeReactTweet(imgSrcs);

      const actionList = document.querySelector('div[role="group"]');
      actionList.parentNode.removeChild(actionList);

      const buttonSetter = new ButtonSetter();
      buttonSetter.setReactLayoutButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnReactLayoutTimeline(options);

      expect(buttonSetter.setReactLayoutButton).not.toHaveBeenCalled();
    });

    it('ツイートなかったら何もしない', () => {
      document.body.innerHTML = '<div id="react-root"><main><section></section></main></div>';

      const buttonSetter = new ButtonSetter();
      buttonSetter.setReactLayoutButton = jest.fn();

      const options = makeAllEnabledOptions();
      buttonSetter._setButtonOnReactLayoutTimeline(options);

      expect(buttonSetter.setReactLayoutButton).not.toHaveBeenCalled();
    });

    it('設定がOFFなら何もしない', () => {
      const buttonSetter = new ButtonSetter();
      buttonSetter.setReactLayoutButton = jest.fn();

      const options = makeAllEnabledOptions();
      options[SHOW_ON_TIMELINE] = isFalse;
      buttonSetter._setButtonOnReactLayoutTimeline(options);

      expect(buttonSetter.setReactLayoutButton).not.toHaveBeenCalled();
    });
  });

  describe('getActionButtonColor', () => {
    /**
     * @argument {string?} color 色
     */
    const makeActionButton = (color) => {
      const button = document.createElement('div');
      button.classList.add('ProfileTweet-actionButton');
      if (color) {
        button.style.color = color;
      }
      document.body.appendChild(button);
    };

    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('actionButtonなかったらデフォルト', () => {
      const buttonSetter = new ButtonSetter();
      expect(buttonSetter.getActionButtonColor()).toStrictEqual('#697b8c');
    });

    it('actionButtonのcolorなかったらデフォルト', () => {
      makeActionButton(null);
      const buttonSetter = new ButtonSetter();
      expect(buttonSetter.getActionButtonColor()).toStrictEqual('#697b8c');
    });

    it('actionButtonのcolorあったらその色が返る', () => {
      makeActionButton('#123456');
      const buttonSetter = new ButtonSetter();
      expect(buttonSetter.getActionButtonColor()).toStrictEqual('rgb(18, 52, 86)');
    });
  });

  describe('getReactLayoutActionButtonColor', () => {
    /**
     * @argument {string?} color 色
     */
    const makeReactActionButton = (color) => {
      const group = document.createElement('div');
      group.setAttribute('role', 'group');
      const button = document.createElement('div');
      button.setAttribute('role', 'button');
      const child = document.createElement('div');
      const svg = document.createElement('svg');
      if (color) {
        child.style.color = color;
        // 本来はsvgにはcolorは当たっていなくて, 親のcolorをgetComputedStyleで取得すると自然ととれる
        // テストでは再現できなかったのでstyleを当ててしまう
        svg.style.color = color;
      }
      child.appendChild(svg);
      button.appendChild(child);
      group.appendChild(button);
      document.body.appendChild(group);
    };

    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('actionButtonなかったらデフォルト', () => {
      const buttonSetter = new ButtonSetter();
      expect(buttonSetter.getReactLayoutActionButtonColor()).toStrictEqual('#697b8c');
    });

    it('actionButtonのcolor空文字ならデフォルト', () => {
      makeReactActionButton('');
      const buttonSetter = new ButtonSetter();
      expect(buttonSetter.getReactLayoutActionButtonColor()).toStrictEqual('#697b8c');
    });

    it('actionButtonのcolorなかったらデフォルト', () => {
      makeReactActionButton(null);
      const buttonSetter = new ButtonSetter();
      expect(buttonSetter.getReactLayoutActionButtonColor()).toStrictEqual('#697b8c');
    });

    it('actionButtonのcolorあったらその色が返る', () => {
      makeReactActionButton('#123456');
      const buttonSetter = new ButtonSetter();
      expect(buttonSetter.getReactLayoutActionButtonColor()).toStrictEqual('rgb(18, 52, 86)');
    });
  });
});
