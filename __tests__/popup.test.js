import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { chrome } from 'jest-chrome';
import React from 'react';

import {
  OPTIONS_TEXT,
  OPTION_KEYS,
  ORIGINAL_BUTTON_TEXT_OPTION_KEY,
  SHOW_ON_TIMELINE,
  SHOW_ON_TWEETDECK_TIMELINE,
  initialOptionsBool,
} from '../src/constants';
import { Popup } from '../src/extension-contexts/popup';

let mockOptions = initialOptionsBool;
chrome.storage.sync.set.mockImplementation((newOptions) => {
  mockOptions = { ...newOptions };
});
chrome.storage.sync.get.mockImplementation(() => mockOptions);

describe('Popup', () => {
  it('renders correctly', () => {
    const optionsText = OPTIONS_TEXT;
    const optionKeys = OPTION_KEYS;
    const optionsEnabled = { ...initialOptionsBool };

    const props = {
      optionsText,
      optionKeys,
      optionsEnabled,
    };

    const { container } = render(<Popup {...props} />);
    expect(container).toMatchSnapshot();
  });

  describe('保存ボタン押すと設定が保存される', () => {
    beforeEach(() => {
      mockOptions = initialOptionsBool;

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
    });

    it('渡した設定がそのまま保存される', async () => {
      const user = userEvent.setup();
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

      render(<Popup {...props} />);

      // Find and click the save button
      const saveButton = screen.getByText('設定を保存');
      await user.click(saveButton);

      // 送りたいタブは正しい形式かつ対象ホストなタブのみ
      expect(window.chrome.tabs.query.mock.calls.length).toBe(1);
      expect(mockOptions).toMatchObject(optionsEnabled);
    });

    it('チェックボックスをクリックして保存すると設定変えられる', async () => {
      const user = userEvent.setup();
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

      render(<Popup {...props} />);

      // Find and click checkboxes
      const timelineCheckbox = document.querySelector(`.${SHOW_ON_TIMELINE}`);
      const tweetdeckCheckbox = document.querySelector(`.${SHOW_ON_TWEETDECK_TIMELINE}`);
      await user.click(timelineCheckbox);
      await user.click(tweetdeckCheckbox);

      // Change text input
      const textInput = document.querySelector(`.${ORIGINAL_BUTTON_TEXT_OPTION_KEY}`);
      await user.clear(textInput);
      await user.type(textInput, '原寸');

      // Save
      const saveButton = screen.getByText('設定を保存');
      await user.click(saveButton);

      expect(mockOptions).toMatchObject({
        ...optionsEnabled,
        [SHOW_ON_TIMELINE]: true,
        [SHOW_ON_TWEETDECK_TIMELINE]: false,
        [ORIGINAL_BUTTON_TEXT_OPTION_KEY]: '原寸',
      });
    });

    it('何度も設定変えられる', async () => {
      const user = userEvent.setup();
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

      render(<Popup {...props} />);

      // First change
      const timelineCheckbox = document.querySelector(`.${SHOW_ON_TIMELINE}`);
      await user.click(timelineCheckbox);

      const textInput = document.querySelector(`.${ORIGINAL_BUTTON_TEXT_OPTION_KEY}`);
      await user.clear(textInput);
      await user.type(textInput, '🎍');

      const saveButton = screen.getByText('設定を保存');
      await user.click(saveButton);

      expect(mockOptions).toMatchObject({
        ...optionsEnabled,
        [SHOW_ON_TIMELINE]: true,
        [ORIGINAL_BUTTON_TEXT_OPTION_KEY]: '🎍',
      });
    });
  });
});
