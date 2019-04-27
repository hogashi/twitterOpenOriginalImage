import * as Constants from './constants';

// バックグラウンドで実行される

chrome.runtime.onMessage.addListener((request: MessageRequest, _, sendResponse: (res: MessageResponse) => void) => {
  if (request.method === Constants.GET_LOCAL_STORAGE) {
    sendResponse({ data: localStorage[request.key] });
    console.log(request.key + " : " + localStorage[request.key]);  // debug
  } else {
    sendResponse({ data: null });
  }
});
