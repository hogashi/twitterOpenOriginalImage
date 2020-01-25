import { GET_LOCAL_STORAGE } from './main';

// バックグラウンドで実行される

// chrome.runtime.sendMessage で送るメッセージ
export interface MessageRequest {
  method: string;
}
// chrome.runtime.sendMessage で返るメッセージ
export interface MessageResponse {
  data: { [key: string]: string } | null;
}

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
