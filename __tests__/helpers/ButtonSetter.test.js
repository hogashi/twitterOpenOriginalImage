import ButtonSetter from '../../src/helpers/ButtonSetter';
import { INITIAL_OPTIONS } from '../../src/helpers/Constants';

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
});
