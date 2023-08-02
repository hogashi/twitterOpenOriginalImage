import { OptionsBool, initialOptionsBool, OPTION_KEYS } from '../constants';

export const setOptions = (options: OptionsBool): void => {
  chrome.storage.sync.set(options, () => {
    console.log('options set');
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
