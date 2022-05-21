import TestRenderer from 'react-test-renderer';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
const { shallow } = Enzyme;

import {
  OPTIONS_TEXT,
  SHOW_ON_TIMELINE,
  isFalse,
  SHOW_ON_TWEETDECK_TIMELINE,
  isTrue,
  OPTION_KEYS,
} from '../src/main';
import { Popup } from '../src/components/Popup';

describe('Popup', () => {
  it('render', () => {
    const optionsText = OPTIONS_TEXT;
    const optionKeys = OPTION_KEYS;
    const options = {};
    optionKeys.forEach(key => {
      options[key] = isTrue;
    });

    const props = {
      optionsText,
      optionKeys,
      options,
    };
    const tree = TestRenderer.create(<Popup {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('保存ボタン押すと設定が保存される', () => {
    window.localStorage = {};
    it('最初は空', () => {
      expect(window.localStorage).toMatchObject({});
    });

    const optionsText = OPTIONS_TEXT;
    const optionKeys = OPTION_KEYS;
    const options = {};
    const expectOptions = {};
    optionKeys.forEach(key => {
      options[key] = isTrue;
      expectOptions[key] = isTrue;
    });
    // 初期設定いっこOFFにしてみる
    options[SHOW_ON_TIMELINE] = isFalse;
    expectOptions[SHOW_ON_TIMELINE] = isFalse;

    const props = {
      optionsText,
      optionKeys,
      options,
    };

    window.chrome = {
      tabs: {
        query: jest.fn((_, callback) => {
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
        }),
        sendMessage: jest.fn((id, option, callback) => {
          callback('mock ok');
        }),
      },
    };
    const wrapper = shallow(<Popup {...props} />);

    it('渡した設定がそのまま保存される', () => {
      wrapper.find('.saveSettingButton').simulate('click');
      // 送りたいタブは正しい形式かつ対象ホストなタブのみ
      expect(window.chrome.tabs.query.mock.calls.length).toBe(1);

      expect(window.localStorage).toMatchObject(expectOptions);
    });

    it('チェックボックスをクリックして保存すると設定変えられる', () => {
      wrapper.find(`.${SHOW_ON_TIMELINE}`).simulate('click');
      wrapper.find(`.${SHOW_ON_TWEETDECK_TIMELINE}`).simulate('click');
      expectOptions[SHOW_ON_TIMELINE] = isTrue;
      expectOptions[SHOW_ON_TWEETDECK_TIMELINE] = isFalse;

      wrapper.find('.saveSettingButton').simulate('click');
      expect(window.localStorage).toMatchObject(expectOptions);
    });

    it('何度も設定変えられる', () => {
      wrapper.find(`.${SHOW_ON_TIMELINE}`).simulate('click');
      expectOptions[SHOW_ON_TIMELINE] = isFalse;

      wrapper.find('.saveSettingButton').simulate('click');
      expect(window.localStorage).toMatchObject(expectOptions);
    });
  });
});
