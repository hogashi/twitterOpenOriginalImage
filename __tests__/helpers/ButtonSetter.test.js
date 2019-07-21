import ButtonSetter from '../../src/helpers/ButtonSetter';
import {
  INITIAL_OPTIONS,
  SHOW_ON_TIMELINE,
  isTrue,
  isFalse,
  SHOW_ON_TWEET_DETAIL,
} from '../../src/helpers/Constants';
import { openImages } from '../../src/helpers/Utils';

jest.mock('../../src/helpers/Utils');

describe('ButtonSetter', () => {
  describe('setButtonOnTimeline', () => {
    it('従来のレイアウト(not React)', () => {
      const buttonSetter = new ButtonSetter();
      buttonSetter._setButtonOnTimeline = jest.fn();
      buttonSetter._setButtonOnReactLayoutTimeline = jest.fn();

      buttonSetter.setButtonOnTimeline(INITIAL_OPTIONS);

      expect(buttonSetter._setButtonOnTimeline).toHaveBeenCalledTimes(1);
      expect(buttonSetter._setButtonOnTimeline.mock.calls[0][0]).toStrictEqual(
        INITIAL_OPTIONS
      );

      expect(
        buttonSetter._setButtonOnReactLayoutTimeline
      ).not.toHaveBeenCalled();
    });

    it('新しいレイアウト(React)', () => {
      const buttonSetter = new ButtonSetter();
      buttonSetter._setButtonOnTimeline = jest.fn();
      buttonSetter._setButtonOnReactLayoutTimeline = jest.fn();

      const root = document.createElement('div');
      root.setAttribute('id', 'react-root');
      document.querySelector('body').appendChild(root);
      buttonSetter.setButtonOnTimeline(INITIAL_OPTIONS);

      expect(buttonSetter._setButtonOnTimeline).not.toHaveBeenCalled();

      expect(
        buttonSetter._setButtonOnReactLayoutTimeline
      ).toHaveBeenCalledTimes(1);
      expect(
        buttonSetter._setButtonOnReactLayoutTimeline.mock.calls[0][0]
      ).toStrictEqual(INITIAL_OPTIONS);
    });
  });

  describe('setButtonOnTweetDetail', () => {
    it('詳細ツイートでもボタン置く(従来レイアウトのみ)', () => {
      const buttonSetter = new ButtonSetter();
      buttonSetter._setButtonOnTweetDetail = jest.fn();

      buttonSetter.setButtonOnTweetDetail(INITIAL_OPTIONS);
      expect(buttonSetter._setButtonOnTweetDetail).toHaveBeenCalledTimes(1);
      expect(
        buttonSetter._setButtonOnTweetDetail.mock.calls[0][0]
      ).toStrictEqual(INITIAL_OPTIONS);
    });
  });

  describe('onClick', () => {
    it('イベント中断して画像開くメソッド呼ばれる', () => {
      const event = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      };
      const imgSrcs = ['src1', 'src2'];

      const buttonSetter = new ButtonSetter();
      buttonSetter.onClick(event, imgSrcs);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(event.stopPropagation).toHaveBeenCalledTimes(1);

      expect(openImages).toHaveBeenCalledTimes(1);
      expect(openImages.mock.calls[0][0]).toBe(imgSrcs);
    });
  });

  describe('setStyle', () => {
    it('objectからエレメントにstyle属性をつける', () => {
      const element = document.createElement('div');
      const style = {
        display: 'block',
        'background-color': 'green',
      };

      // 最初はセットされていない
      expect(element.style.display).toBe('');
      expect(element.style.backgroundColor).toBe('');

      const buttonSetter = new ButtonSetter();
      buttonSetter.setStyle(element, style);

      expect(element.style.display).toBe('block');
      expect(element.style.backgroundColor).toBe('green');
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

    it('ボタン押すとonClick呼ばれる', () => {
      buttonSetter.onClick = jest.fn();
      const button = target.querySelector('input');
      button.click();
      expect(buttonSetter.onClick).toHaveBeenCalledTimes(1);
      expect(buttonSetter.onClick.mock.calls[0][0]).toBeInstanceOf(MouseEvent);
      expect(buttonSetter.onClick.mock.calls[0][1]).toStrictEqual(imgSrcs);
    });
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

    it('ボタン押すとonClick呼ばれる', () => {
      buttonSetter.onClick = jest.fn();
      const button = target.querySelector('input');
      button.click();
      expect(buttonSetter.onClick).toHaveBeenCalledTimes(1);
      expect(buttonSetter.onClick.mock.calls[0][0]).toBeInstanceOf(MouseEvent);
      expect(buttonSetter.onClick.mock.calls[0][1]).toStrictEqual(imgSrcs);
    });
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

      imgSrcs.forEach(src => {
        const div = document.createElement('div');
        div.classList.add('AdaptiveMedia-photoContainer');

        const img = document.createElement('img');
        img.src = src;

        div.appendChild(img);
        media.appendChild(div);
      });

      extraElements.forEach(element => media.appendChild(element));

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

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TIMELINE] = isTrue;
      buttonSetter._setButtonOnTimeline(options);

      expect(buttonSetter.setButton).toHaveBeenCalledTimes(1);
      expect(buttonSetter.setButton.mock.calls[0][0].className).toStrictEqual(
        'tooi-button-container-timeline'
      );
      expect(
        buttonSetter.setButton.mock.calls[0][0].getImgSrcs()
      ).toMatchObject(imgSrcs);
      expect(
        buttonSetter.setButton.mock.calls[0][0].target.classList.contains(
          'ProfileTweet-actionList'
        )
      ).toBeTruthy();
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

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TIMELINE] = isTrue;
      buttonSetter._setButtonOnTimeline(options);

      expect(buttonSetter.setButton).toHaveBeenCalledTimes(3);
      imgSrcsSet.forEach((imgSrcs, index) => {
        expect(
          buttonSetter.setButton.mock.calls[index][0].className
        ).toStrictEqual('tooi-button-container-timeline');
        expect(
          buttonSetter.setButton.mock.calls[index][0].getImgSrcs()
        ).toMatchObject(imgSrcs);
        expect(
          buttonSetter.setButton.mock.calls[index][0].target.classList.contains(
            'ProfileTweet-actionList'
          )
        ).toBeTruthy();
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

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TIMELINE] = isTrue;
      buttonSetter._setButtonOnTimeline(options);

      expect(buttonSetter.setButton).toHaveBeenCalledTimes(3);
      imgSrcsSet.forEach((imgSrcs, index) => {
        expect(
          buttonSetter.setButton.mock.calls[index][0].className
        ).toStrictEqual('tooi-button-container-timeline');
        expect(
          buttonSetter.setButton.mock.calls[index][0].getImgSrcs()
        ).toMatchObject(imgSrcs);
        expect(
          buttonSetter.setButton.mock.calls[index][0].target.classList.contains(
            'ProfileTweet-actionList'
          )
        ).toBeTruthy();
      });
    });

    it('動画/GIFのツイート1つにボタンつけない', () => {
      const imgSrcs = [];
      makeTweet(imgSrcs, [document.createElement('video')]);

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TIMELINE] = isTrue;
      buttonSetter._setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('画像1枚ツイート1つでも,もうボタンあったらボタンつけない', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeTweet(imgSrcs, [], true);

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TIMELINE] = isTrue;
      buttonSetter._setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('画像ツイート1つあっても画像なかったらボタンつけない', () => {
      const imgSrcs = [];
      makeTweet(imgSrcs);

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TIMELINE] = isTrue;
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

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TIMELINE] = isTrue;
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

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TIMELINE] = isTrue;
      buttonSetter._setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('画像ツイートなかったら何もしない', () => {
      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TIMELINE] = isTrue;
      buttonSetter._setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('設定がOFFなら何もしない', () => {
      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TIMELINE] = isFalse;
      buttonSetter.setButtonOnTimeline(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });
  });

  describe('_setButtonOnTweetDetail', () => {
    /**
     * @param {string[]} imgSrcs
     * @param {HTMLElement[]} extraElements
     * @param {boolean} hasButton
     */
    const makeTweetDetail = (
      imgSrcs,
      extraElements = [],
      hasButton = false
    ) => {
      const root = document.createElement('div');
      root.classList.add('permalink-tweet-container');

      const actionList = document.createElement('div');
      actionList.classList.add('ProfileTweet-actionList');
      if (hasButton) {
        const button = document.createElement('div');
        button.classList.add('tooi-button-container-detail');
        actionList.appendChild(button);
      }

      imgSrcs.forEach(src => {
        const media = document.createElement('div');
        media.classList.add('AdaptiveMedia-photoContainer');

        const img = document.createElement('img');
        img.src = src;

        media.appendChild(img);
        root.appendChild(media);
      });

      extraElements.forEach(element => root.appendChild(element));

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

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEET_DETAIL] = isTrue;
      buttonSetter._setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).toHaveBeenCalledTimes(1);
      expect(buttonSetter.setButton.mock.calls[0][0].className).toStrictEqual(
        'tooi-button-container-detail'
      );
      expect(
        buttonSetter.setButton.mock.calls[0][0].getImgSrcs()
      ).toMatchObject(imgSrcs);
      expect(
        buttonSetter.setButton.mock.calls[0][0].target.classList.contains(
          'ProfileTweet-actionList'
        )
      ).toBeTruthy();
    });

    it('画像4枚ツイート詳細にボタンつけようとする', () => {
      const imgSrcs = [
        'https://g.co/img1',
        'https://g.co/img2',
        'https://g.co/img3',
        'https://g.co/img4',
      ];
      makeTweetDetail(imgSrcs);

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEET_DETAIL] = isTrue;
      buttonSetter._setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).toHaveBeenCalledTimes(1);
      expect(buttonSetter.setButton.mock.calls[0][0].className).toStrictEqual(
        'tooi-button-container-detail'
      );
      expect(
        buttonSetter.setButton.mock.calls[0][0].getImgSrcs()
      ).toMatchObject(imgSrcs);
      expect(
        buttonSetter.setButton.mock.calls[0][0].target.classList.contains(
          'ProfileTweet-actionList'
        )
      ).toBeTruthy();
    });

    it('画像でないツイート1つにボタンつけない', () => {
      const imgSrcs = ['https://g.co/video1'];
      makeTweetDetail(imgSrcs);

      const media = document.querySelectorAll('.AdaptiveMedia-photoContainer');
      media.forEach(medium =>
        medium.classList.remove('AdaptiveMedia-photoContainer')
      );

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEET_DETAIL] = isTrue;
      buttonSetter._setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('画像1枚ツイート1つでも,もうボタンあったらボタンつけない', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeTweetDetail(imgSrcs, [], true);

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEET_DETAIL] = isTrue;
      buttonSetter._setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('ツイート1つあっても画像なかったらボタンつけない', () => {
      const imgSrcs = ['https://g.co/img1'];
      makeTweetDetail(imgSrcs);

      // 画像を全部消す
      const media = document.querySelectorAll('.AdaptiveMedia-photoContainer');
      media.forEach(medium => medium.parentNode.removeChild(medium));

      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEET_DETAIL] = isTrue;
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

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEET_DETAIL] = isTrue;
      buttonSetter._setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('画像ツイートなかったら何もしない', () => {
      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEET_DETAIL] = isTrue;
      buttonSetter._setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });

    it('設定がOFFなら何もしない', () => {
      const buttonSetter = new ButtonSetter();
      buttonSetter.setButton = jest.fn();

      const options = INITIAL_OPTIONS;
      options[SHOW_ON_TWEET_DETAIL] = isFalse;
      buttonSetter.setButtonOnTweetDetail(options);

      expect(buttonSetter.setButton).not.toHaveBeenCalled();
    });
  });
});
