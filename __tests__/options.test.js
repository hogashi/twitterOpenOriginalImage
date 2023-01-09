import { chrome } from 'jest-chrome';
import {
  initialOptions,
  initialOptionsBool,
  isFalse,
  MIGRATED_TO_CHROME_STORAGE,
  SHOW_ON_TWEETDECK_TIMELINE,
  SHOW_ON_TIMELINE,
  SHOW_ON_TWEETDECK_TWEET_DETAIL,
} from '../src/constants';

import { getOptions, setOptions } from '../src/extension-contexts/options';

let chromeStorage = {};
chrome.storage.sync.set.mockImplementation((items) => {
  chromeStorage = { ...chromeStorage, ...items };
});
chrome.storage.sync.get.mockImplementation((keys, callback) => {
  if (typeof keys === 'string') {
    callback({ [keys]: chromeStorage[keys] });
  } else {
    callback(Object.fromEntries(Object.entries(chromeStorage).filter(([k, _]) => keys.find((key) => k === key))));
  }
});
beforeEach(() => {
  chromeStorage = {};
  localStorage.clear();
});

describe('options', () => {
  describe('getOptions', () => {
    it('何もない状態で呼んだら, 初期値が返って, 初期値が保存されて, 移行済みになる', () => {
      expect(getOptions()).resolves.toMatchObject(initialOptionsBool);
      expect(chromeStorage).toMatchObject({
        ...initialOptionsBool,
        [MIGRATED_TO_CHROME_STORAGE]: true,
      });
    });
    it('未移行で, localStorageに設定があったら, localStorageの内容が移行されつつ返って, 移行済みになる', () => {
      Object.entries({ ...initialOptions, [SHOW_ON_TWEETDECK_TIMELINE]: isFalse }).map(([k, v]) => {
        localStorage.setItem(k, v);
      });
      const expected = { ...initialOptionsBool, [SHOW_ON_TWEETDECK_TIMELINE]: false };
      expect(getOptions()).resolves.toMatchObject(expected);
      expect(chromeStorage).toMatchObject({
        ...expected,
        [MIGRATED_TO_CHROME_STORAGE]: true,
      });
    });
    it('移行済みなら, 保存された設定が返る', () => {
      Object.entries({ ...initialOptions, [SHOW_ON_TWEETDECK_TIMELINE]: isFalse }).map(([k, v]) => {
        localStorage.setItem(k, v);
      });
      chromeStorage = {
        ...initialOptionsBool,
        [SHOW_ON_TIMELINE]: false,
        [MIGRATED_TO_CHROME_STORAGE]: true,
      };
      const expected = { ...initialOptionsBool, [SHOW_ON_TIMELINE]: false };
      expect(getOptions()).resolves.toMatchObject(expected);
      expect(chromeStorage).toMatchObject({
        ...expected,
        [MIGRATED_TO_CHROME_STORAGE]: true,
      });
    });
  });
  describe('setOptions', () => {
    const expected = { ...initialOptionsBool, [SHOW_ON_TWEETDECK_TWEET_DETAIL]: false };
    setOptions(expected);
    expect(chrome.storage.sync.set.mock.calls.length).toBe(1);
    expect(chrome.storage.sync.set.mock.lastCall[0]).toBe(expected);
  });
});
