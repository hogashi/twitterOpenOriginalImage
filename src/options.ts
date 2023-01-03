import { initialOptions, OPTION_KEYS, isTrue, OptionsBool, initialOptionsBool } from './constants';
import { updateOptions } from './utils';

export const getOptions = (): Promise<OptionsBool> => {
  return new Promise((resolve) =>
    // chrome.storageから取ってきつつ,
    // ない値はlocalStorageあるいは初期値で埋める
    chrome.storage.sync.get(OPTION_KEYS, (got) => {
      updateOptions().then((localStorageOptions) => {
        const newOptions = { ...initialOptions, ...localStorageOptions, ...got };
        const newOptionsBool = { ...initialOptionsBool };
        OPTION_KEYS.forEach((key) => {
          newOptionsBool[key] = newOptions[key] === isTrue;
        });
        resolve(newOptionsBool);
      });
    }),
  );
};
