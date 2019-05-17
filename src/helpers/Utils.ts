import { GET_LOCAL_STORAGE, Options, isTrue } from './Constants';
import { MessageRequest, MessageResponse } from '../background';

// エラーメッセージの表示(予期せぬ状況の確認)
export const printException = (tooiException: string) => {
  console.log('tooi: ' + tooiException + ' at: ' + window.location.href);
};

// 画像urlの要素を集める
export const collectUrlParams = (rawUrl: string): {
  protocol: string,
  host: string,
  pathname: string,
  format: string,
  name: string | null,
} | null => {
  if (!/https:\/\/pbs\.twimg\.com\/media/.test(rawUrl)) {
    // twitterの画像URLでないときnull
    return null;
  }

  const url = new URL(rawUrl);
  const searchSet: {
    format: string,
    name: string | null,
  } = {
    format: 'jpg', // 拡張子が無い場合はjpgにフォールバック
    name: null, // 大きさ指定がない場合はnull
  };
  url.search
    .slice(1)
    .split('&')
    .forEach(set => {
      const [key, value] = set.split('=');
      if (key === 'format' || key === 'name') {
        searchSet[key] = value;
      }
    });

  // 空文字でもどんな文字列でもマッチする正規表現なのでnon-null
  const matched = url.pathname.match(/^(.*?)(?:|\.([^.:]+))(?:|:[a-z]+)$/)!;
  // どんな文字列でも空文字は最低入るのでnon-null
  const pathname = matched[1]!;
  // 拡張子はないかもしれないのでundefinedも示しておく
  const extension = matched[2] as string | undefined;

  return {
    protocol: url.protocol,
    host: url.host,
    pathname,
    // 2.1.11時点ではクエリパラメータを使うのはTweetDeckのみ
    // TweetDeckのURLでは拡張子を優先する
    // ref: https://hogashi.hatenablog.com/entry/2018/08/15/042044
    format: extension || searchSet.format,
    name: searchSet.name,
  };
};

// 画像URLを https～?format=〜&name=orig に揃える
export const formatUrl = (imgUrl?: string) => {
  if (!imgUrl || imgUrl.length === 0) {
    return null;
  }

  const params = collectUrlParams(imgUrl);
  if (!params) {
    // twitterの画像URLでないときそのまま返す
    return imgUrl;
  }

  const { protocol, host, pathname, format } = params;
  return `${protocol}//${host}${pathname}?format=${format}&name=orig`;
};

// 画像を開く
export const openImages = (imgSrcs: string[]) => {
  Array.from(imgSrcs)
    .reverse() // 逆順に開くことで右側のタブから読める
    .forEach(imgSrc => {
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
  console.log('update options: ', options); // debug
  return Promise.all(
    Object.keys(options).map(
      key =>
        new Promise((resolve, reject) => {
          const request: MessageRequest = {
            method: GET_LOCAL_STORAGE,
            key,
          };
          const callback = (response: MessageResponse) => {
            if (response) {
              options[key] = response.data || isTrue;
              resolve();
            } else {
              reject();
            }
          };
          chrome.runtime.sendMessage(request, callback);
        })
    )
  ).then(() => {
    console.log('update options: ', options); // debug
  });
};
