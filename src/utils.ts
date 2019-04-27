import * as Constants from './constants';

// 設定項目の初期値は「無効」(最初のボタン表示が早過ぎる/一旦表示すると消さないため)
// 有効だった場合はDOMが変更される間に設定が読み込まれて有効になる
// 無効だった場合はそのままボタンは表示されない
const options = Constants.INITIAL_OPTIONS;

// 設定項目更新
export const updateOptions = () => {
  console.log('update options: ', options) // debug
  return Promise.all(
    Object.keys(options).map(key =>
      new Promise((resolve, reject) => {
        const request: MessageRequest = {
          method: Constants.GET_LOCAL_STORAGE,
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
