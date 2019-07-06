import ButtonSetter from '../../src/helpers/ButtonSetter';
import { INITIAL_OPTIONS } from '../../src/helpers/Constants';
import { openImages, printException } from '../../src/helpers/Utils';

jest.mock('../../src/helpers/Utils');

describe('ButtonSetters', () => {
  describe('setButtonOnTimeline', () => {
    it('従来のレイアウト(not React)', () => {
      const buttonSetter = new ButtonSetter();
      buttonSetter._setButtonOnTimeline = jest.fn();
      buttonSetter._setButtonOnReactLayoutTimeline = jest.fn();

      buttonSetter.setButtonOnTimeline(INITIAL_OPTIONS);

      expect(buttonSetter._setButtonOnTimeline).toHaveBeenCalledTimes(1);
      expect(buttonSetter._setButtonOnTimeline.mock.calls[0][0]).toStrictEqual(INITIAL_OPTIONS);

      expect(buttonSetter._setButtonOnReactLayoutTimeline).not.toHaveBeenCalled();
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

      expect(buttonSetter._setButtonOnReactLayoutTimeline).toHaveBeenCalledTimes(1);
      expect(buttonSetter._setButtonOnReactLayoutTimeline.mock.calls[0][0]).toStrictEqual(INITIAL_OPTIONS);
    });
  });

  describe('setButtonOnTweetDetail', () => {
    it('詳細ツイートでもボタン置く(従来レイアウトのみ)', () => {
      const buttonSetter = new ButtonSetter();
      buttonSetter._setButtonOnTweetDetail = jest.fn();

      buttonSetter.setButtonOnTweetDetail(INITIAL_OPTIONS);
      expect(buttonSetter._setButtonOnTweetDetail).toHaveBeenCalledTimes(1);
      expect(buttonSetter._setButtonOnTweetDetail.mock.calls[0][0]).toStrictEqual(INITIAL_OPTIONS);
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
    const element = document.createElement('div');
    const style = {
      display: 'block',
      'background-color': 'green',
    };

    const buttonSetter = new ButtonSetter();
    buttonSetter.setStyle(element, style);

    expect(element.getAttribute('style')).toBe('display: block; background-color: green');
  });
});
