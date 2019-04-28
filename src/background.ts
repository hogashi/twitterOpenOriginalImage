import { GET_LOCAL_STORAGE } from './helpers/Constants';

// バックグラウンドで実行される

// chrome.runtime.sendMessage で送るメッセージ
export interface MessageRequest {
  method: string;
  key: string;
}
// chrome.runtime.sendMessage で返るメッセージ
export interface MessageResponse {
  data: string | null;
}

chrome.runtime.onMessage.addListener((request: MessageRequest, _, sendResponse: (res: MessageResponse) => void) => {
  if (request.method === GET_LOCAL_STORAGE) {
    sendResponse({ data: localStorage[request.key] });
    console.log(request.key + " : " + localStorage[request.key]);  // debug
  } else {
    sendResponse({ data: null });
  }
});
