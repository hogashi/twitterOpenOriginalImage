import { chrome } from 'jest-chrome';
import { SHOW_ON_TIMELINE, SHOW_ON_TWEETDECK_TWEET_DETAIL, initialOptionsBool } from '../src/constants';

import { getOptions, setOptions } from '../src/extension-contexts/options';

let chromeStorage = {};
chrome.storage.sync.set.mockImplementation((items, callback) => {
  chromeStorage = { ...chromeStorage, ...items };
  callback();
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
});

describe('options', () => {
  describe('getOptions', () => {
    it('chrome.storageが空の状態で呼んだら, 初期値が返る (chrome.storageは空のまま)', () => {
      expect(getOptions()).resolves.toMatchObject(initialOptionsBool);
      expect(chromeStorage).toMatchObject({});
    });
    it('chrome.storageに保存された設定があるなら, それが返る', () => {
      chromeStorage = {
        ...initialOptionsBool,
        [SHOW_ON_TIMELINE]: false,
      };
      const expected = { ...initialOptionsBool, [SHOW_ON_TIMELINE]: false };
      expect(getOptions()).resolves.toMatchObject(expected);
      expect(chromeStorage).toMatchObject(expected);
    });
  });
  describe('setOptions', () => {
    const expected = { ...initialOptionsBool, [SHOW_ON_TWEETDECK_TWEET_DETAIL]: false };
    setOptions(expected);
    expect(chrome.storage.sync.set.mock.calls.length).toBe(1);
    expect(chrome.storage.sync.set.mock.lastCall[0]).toBe(expected);
  });
});
