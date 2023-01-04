import { OptionsBool, initialOptions, initialOptionsBool, OPTION_KEYS, isTrue } from './constants';

const MIGRATED_TO_CHROME_STORAGE = 'MIGRATED_TO_CHROME_STORAGE';

export const getOptions = (): Promise<OptionsBool> => {
  return new Promise((resolve) => {
    // chrome.storageから取ってきつつ,
    // まだ移行してないときはlocalStorageあるいは初期値を移行
    chrome.storage.sync.get(MIGRATED_TO_CHROME_STORAGE, (isMigrated) => {
      if (!isMigrated[MIGRATED_TO_CHROME_STORAGE]) {
        const newOptions = { ...initialOptions, ...localStorage };
        // 真偽値にして移行する
        const newOptionsBool = { ...initialOptionsBool };
        OPTION_KEYS.forEach((key) => {
          newOptionsBool[key] = newOptions[key] === isTrue;
        });
        chrome.storage.sync.set(
          {
            ...newOptionsBool,
            [MIGRATED_TO_CHROME_STORAGE]: true,
          },
          () => {
            // 移行できたら新しい値を返す
            resolve(newOptionsBool);
          },
        );
      } else {
        chrome.storage.sync.get(OPTION_KEYS, (got) => {
          // 初期値をフォールバックとしておく
          resolve({ ...initialOptionsBool, ...got });
        });
      }
    });
  });
};
