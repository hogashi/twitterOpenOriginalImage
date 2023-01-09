import TestRenderer from 'react-test-renderer';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
const { shallow } = Enzyme;
import { chrome } from 'jest-chrome';

import {
  OPTIONS_TEXT,
  SHOW_ON_TIMELINE,
  SHOW_ON_TWEETDECK_TIMELINE,
  OPTION_KEYS,
  initialOptionsBool,
} from '../src/constants';
import { Popup } from '../src/extension-contexts/popup';

let mockOptions = initialOptionsBool;
chrome.storage.sync.set.mockImplementation((newOptions) => {
  mockOptions = { ...newOptions };
});
chrome.storage.sync.get.mockImplementation(() => mockOptions);

describe('Popup', () => {
  it('render', () => {
    const optionsText = OPTIONS_TEXT;
    const optionKeys = OPTION_KEYS;
    const optionsEnabled = { ...initialOptionsBool };

    const props = {
      optionsText,
      optionKeys,
      optionsEnabled,
    };
    const tree = TestRenderer.create(<Popup {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('保存ボタン押すと設定が保存される', () => {
    mockOptions = initialOptionsBool;

    const optionsText = OPTIONS_TEXT;
    const optionKeys = OPTION_KEYS;
    const optionsEnabled = { ...initialOptionsBool };
    // 初期設定いっこOFFにしてみる
    optionsEnabled[SHOW_ON_TIMELINE] = false;

    const props = {
      optionsText,
      optionKeys,
      optionsEnabled,
    };

    chrome.tabs.query.mockImplementation((_, callback) => {
      callback([
        {
          // 対象タブ
          id: 1,
          url: 'http://twitter.com',
        },
        {
          // 対象ではないタブ
          id: 1,
          url: 'http://google.com',
        },
        {
          // 対象ではないタブ
          id: 1,
        },
        {
          // 対象ではないタブ
          url: 'http://twitter.com',
        },
      ]);
    });
    chrome.tabs.sendMessage.mockImplementation((id, option, callback) => {
      callback('mock ok');
    });
    const wrapper = shallow(<Popup {...props} />);

    it('渡した設定がそのまま保存される', () => {
      wrapper.find('.saveSettingButton').simulate('click');
      // 送りたいタブは正しい形式かつ対象ホストなタブのみ
      expect(window.chrome.tabs.query.mock.calls.length).toBe(1);

      expect(mockOptions).toMatchObject(optionsEnabled);
    });

    it('チェックボックスをクリックして保存すると設定変えられる', () => {
      wrapper.find(`.${SHOW_ON_TIMELINE}`).simulate('click');
      wrapper.find(`.${SHOW_ON_TWEETDECK_TIMELINE}`).simulate('click');

      wrapper.find('.saveSettingButton').simulate('click');
      expect(mockOptions).toMatchObject({
        ...optionsEnabled,
        [SHOW_ON_TIMELINE]: true,
        [SHOW_ON_TWEETDECK_TIMELINE]: false,
      });
    });

    it('何度も設定変えられる', () => {
      wrapper.find(`.${SHOW_ON_TIMELINE}`).simulate('click');

      wrapper.find('.saveSettingButton').simulate('click');
      expect(mockOptions).toMatchObject({
        ...optionsEnabled,
        [SHOW_ON_TIMELINE]: false,
        [SHOW_ON_TWEETDECK_TIMELINE]: false,
      });
    });
  });
});
