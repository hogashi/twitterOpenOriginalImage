import { GET_LOCAL_STORAGE, initialOptions, initialOptionsBool, isTrue, OptionsBool, OPTION_KEYS } from './constants';
import { MessageRequest, MessageResponseBool } from './utils';

// バックグラウンドで実行される

window.chrome.runtime.onMessage.addListener(
  (request: MessageRequest, _, sendResponse: (res: MessageResponseBool) => void) => {
    // console.log(chrome.runtime.lastError);
    if (request.method === GET_LOCAL_STORAGE) {
      // chrome.storageから取ってきつつ,
      // ない値はlocalStorageあるいは初期値で埋める
      // TODO: むずい感じになってきたので, テストできるようにlocalStorageとchrome.storageだけ返すことにしたい
      chrome.storage.sync.get(OPTION_KEYS, (got) => {
        const newOptions = { ...initialOptions, ...localStorage };
        // 真偽値にして返す
        const newOptionsBool = { ...initialOptionsBool };
        OPTION_KEYS.forEach((key) => {
          newOptionsBool[key] = newOptions[key] === isTrue;
        });
        sendResponse({ data: { ...newOptionsBool, ...got } });
      });
    } else {
      sendResponse({ data: null });
    }
    return true;
  },
);
