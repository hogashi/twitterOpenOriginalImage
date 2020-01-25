import { GET_LOCAL_STORAGE, MessageRequest, MessageResponse } from './main';

// バックグラウンドで実行される

chrome.runtime.onMessage.addListener(
  (
    request: MessageRequest,
    _,
    sendResponse: (res: MessageResponse) => void
  ) => {
    // console.log(chrome.runtime.lastError);
    if (request.method === GET_LOCAL_STORAGE) {
      sendResponse({ data: localStorage });
    } else {
      sendResponse({ data: null });
    }
    return true;
  }
);
