import { GET_LOCAL_STORAGE } from './constants';
import { getOptions } from './options';
import { MessageRequest, MessageResponseBool } from './utils';

// バックグラウンドで実行される

window.chrome.runtime.onMessage.addListener(
  (request: MessageRequest, _, sendResponse: (res: MessageResponseBool) => void) => {
    // console.log(chrome.runtime.lastError);
    if (request.method === GET_LOCAL_STORAGE) {
      getOptions().then((options) => {
        sendResponse({ data: options });
      });
    } else {
      sendResponse({ data: null });
    }
    return true;
  },
);
