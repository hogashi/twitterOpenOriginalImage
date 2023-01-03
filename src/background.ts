import { GET_LOCAL_STORAGE } from './constants';
import { MessageRequest, MessageResponse } from './utils';

// バックグラウンドで実行される

window.chrome.runtime.onMessage.addListener(
  (request: MessageRequest, _, sendResponse: (res: MessageResponse) => void) => {
    // console.log(chrome.runtime.lastError);
    if (request.method === GET_LOCAL_STORAGE) {
      sendResponse({ data: localStorage });
    } else {
      sendResponse({ data: null });
    }
    return true;
  },
);
