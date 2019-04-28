import { GET_LOCAL_STORAGE } from './Constants';

// 設定項目更新
export const updateOptions = (options) => {
  console.log('update options: ', options) // debug
  return Promise.all(
    Object.keys(options).map(key =>
      new Promise((resolve, reject) => {
        const request: MessageRequest = {
          method: GET_LOCAL_STORAGE,
          key,
        };
        const callback = (response: MessageResponse) => {
          if (response && response.data) {
            options[key] = response.data;
            resolve();
          } else {
            reject();
          }
        };
        chrome.runtime.sendMessage(request, callback);
      })
    )
  ).then(() => {
    console.log('update options: ', options) // debug
  });
};
