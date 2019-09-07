import * as React from 'react';
import TestRenderer from 'react-test-renderer';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
const { shallow } = Enzyme;

import {
  OPTIONS_TEXT,
  INITIAL_OPTIONS,
  SHOW_ON_TIMELINE,
  isFalse,
  SHOW_ON_TWEETDECK_TIMELINE,
  isTrue,
} from '../src/helpers/Constants';
import { Popup } from '../src/popup';

describe('Popup', () => {
  it('render', () => {
    const optionsText = OPTIONS_TEXT;
    const optionKeys = Object.keys(INITIAL_OPTIONS);
    const optionsEnabled = {};
    optionKeys.forEach(key => {
      optionsEnabled[key] = true;
    });

    const props = {
      optionsText,
      optionKeys,
      optionsEnabled,
    };
    const tree = TestRenderer.create(<Popup {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('保存ボタン押すと設定が保存される', () => {
    window.localStorage = {};
    expect(window.localStorage).toMatchObject({});

    const optionsText = OPTIONS_TEXT;
    const optionKeys = Object.keys(INITIAL_OPTIONS);
    const optionsEnabled = {};
    const expectOptions = {};
    optionKeys.forEach(key => {
      optionsEnabled[key] = true;
      expectOptions[key] = isTrue;
    });
    // 初期設定いっこOFFにしてみる
    optionsEnabled[SHOW_ON_TIMELINE] = false;
    expectOptions[SHOW_ON_TIMELINE] = isFalse;

    const props = {
      optionsText,
      optionKeys,
      optionsEnabled,
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
