import { GET_LOCAL_STORAGE, Options } from './Constants';
import { MessageRequest, MessageResponse } from '../background';

// エラーメッセージの表示(予期せぬ状況の確認)
export const printException = (tooiException: string) => {
  console.log('tooi: ' + tooiException + ' at: ' + window.location.href);
};

// 画像URLを https～?format=〜&name=orig に揃える
export const formatUrl = (imgUrl: string) => {
  if (!imgUrl) {
    return null;
  }

  if (!/https:\/\/pbs\.twimg\.com\/media/.test(imgUrl)) {
    // twitterの画像URLでないときそのまま返す
    return imgUrl;
  }

  const url = new URL(imgUrl);
  const searchSet: { [key: string]: string } = {
    format: 'jpg',  // 拡張子が無い場合はjpgにフォールバック
  };
  url.search
    .slice(1)
    .split('&')
    .forEach(set => {
      const [key, value] = set.split('=');
      searchSet[key] = value;
    });

  const matched = url.pathname.match(
    /^(.*?)(?:|\.([^.:]+))(?:|:[a-z]+)$/
  );
  const pathname = matched[1];
  const extension = matched[2];
  // 2.1.11時点ではクエリパラメータを使うのはTweetDeckのみ
  // TweetDeckのURLでは拡張子を優先する
  // ref: https://hogashi.hatenablog.com/entry/2018/08/15/042044
  return `${url.protocol}//${url.host}${pathname}?format=${extension || searchSet.format}&name=orig`;
};

// 画像を開く
export const openImages = (imgSrcs: string[]) => {
  Array.from(imgSrcs)
    .reverse()  // 逆順に開くことで右側のタブから読める
    .forEach((imgSrc) => {
      // if 画像URLが取得できたなら
      const url = formatUrl(imgSrc);
      if (url) {
        window.open(url);
      } else {
        printException('no image url');
      }
    });
};

// 設定項目更新
export const updateOptions = (options: Options) => {
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
