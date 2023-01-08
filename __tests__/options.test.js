import { chrome } from 'jest-chrome';
import { initialOptionsBool, MIGRATED_TO_CHROME_STORAGE } from '../src/constants';

import { getOptions, setOptions } from '../src/extension-contexts/options';

let chromeStorage = {};
chrome.storage.sync.set.mockImplementation((items) => {
  chromeStorage = { ...chromeStorage, ...items };
});
chrome.storage.sync.get.mockImplementation(() => chromeStorage);
beforeEach(() => {
  chromeStorage = {};
  window.localStorage = {};
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
    it('未移行で, localStorageに設定があったら, localStorageの内容が移行されつつ返って, 移行済みになる', () => {});
    it('移行済みなら, 保存された設定が返る', () => {});
    describe('setOptions', () => {});
  });
});
