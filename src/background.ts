import {
  GET_LOCAL_STORAGE,
  OPTION_KEYS,
  MessageRequest,
  MessageResponse,
} from './main';

// バックグラウンドで実行される

chrome.runtime.onMessage.addListener(
  (
    request: MessageRequest,
    _,
    sendResponse: (res: MessageResponse) => void
  ) => {
    // console.log(chrome.runtime.lastError);
    if (request.method === GET_LOCAL_STORAGE) {
      chrome.storage.local.get(OPTION_KEYS, res => {
        sendResponse({ data: res });
      });
    } else {
      sendResponse({ data: null });
    }
    return true;
  }
);
