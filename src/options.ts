import { initialOptions, OPTION_KEYS, Options } from './constants';
import { updateOptions } from './utils';

export const getOptions = (): Promise<Options> => {
  return new Promise((resolve) =>
    // chrome.storageから取ってきつつ,
    // ない値はlocalStorageあるいは初期値で埋める
    chrome.storage.sync.get(OPTION_KEYS, (got) => {
      updateOptions().then((localStorageOptions) => {
        const newOptions = { ...initialOptions, ...localStorageOptions, ...got };
        resolve(newOptions);
      });
    }),
  );
};
