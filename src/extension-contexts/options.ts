import { OPTION_KEYS, OptionsBool, initialOptionsBool } from '../constants';

export const setOptions = (options: OptionsBool, callback?: () => void): void => {
  chrome.storage.sync.set(options, () => {
    console.log('options set');
    if (callback) {
      callback();
    }
  });
};

export const getOptions = (): Promise<OptionsBool> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(OPTION_KEYS, (got) => {
      // 初期値をフォールバックとしておく
      resolve({ ...initialOptionsBool, ...got });
    });
  });
};
