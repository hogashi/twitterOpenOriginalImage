// common.js

// 設定取得メッセージ
const OPTION_UPDATED = 'OPTION_UPDATED';
const GET_LOCAL_STORAGE = 'GET_LOCAL_STORAGE';

// 公式Web
const OPEN_WITH_KEY_PRESS = 'OPEN_WITH_KEY_PRESS';
const SHOW_ON_TIMELINE = 'SHOW_ON_TIMELINE';
const SHOW_ON_TWEET_DETAIL = 'SHOW_ON_TWEET_DETAIL';
// TweetDeck
const SHOW_ON_TWEETDECK_TIMELINE = 'SHOW_ON_TWEETDECK_TIMELINE';
const SHOW_ON_TWEETDECK_TWEET_DETAIL = 'SHOW_ON_TWEETDECK_TWEET_DETAIL';
// 画像ページ
const STRIP_IMAGE_SUFFIX = 'STRIP_IMAGE_SUFFIX';

// 設定項目の初期値は「無効」(最初のボタン表示が早過ぎる/一旦表示すると消さないため)
// 有効だった場合はDOMが変更される間に設定が読み込まれて有効になる
// 無効だった場合はそのままボタンは表示されない
const options = {
  // 公式Web
  SHOW_ON_TIMELINE: 'isfalse',
  SHOW_ON_TWEET_DETAIL: 'isfalse',
  OPEN_WITH_KEY_PRESS: 'isfalse',
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: 'isfalse',
  SHOW_ON_TWEETDECK_TWEET_DETAIL: 'isfalse',
  // 画像ページ
  STRIP_IMAGE_SUFFIX: 'isfalse',
};

let observer;

function tooiInit(setButtonsCallBack) {
  // 設定読み込み
  updateOptions(setButtonsCallBack);

  if (setButtonsCallBack) {
    // ページ全体でDOMの変更を検知し都度ボタン設置
    observer = new MutationObserver(setButtonsCallBack);
    const target = document.querySelector('body');
    const config = { childList: true, subtree: true };
    // ページ全体でDOMの変更を検知し都度ボタン設置
    observer.observe(target, config);
  }

  // 設定反映のためのリスナー設置
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method === OPTION_UPDATED) {
      updateOptions(setButtonsCallBack);
      sendResponse({ data: 'done' });
    } else {
      sendResponse({ data: 'yet' });
    }
  });
}

// 設定項目更新
function updateOptions(setButtonsCallBack) {
  // console.log('update options: ', options) // debug
  Object.keys(options).map(key => {
    chrome.runtime.sendMessage({ method: GET_LOCAL_STORAGE, key }, function(
      response
    ) {
      if (response) {
        options[key] = response.data;
      }
      // 設定を読み込んだらボタンを置く
      // 設定読込と同スコープに書くことで同期的に呼び出し
      if (setButtonsCallBack){
        setButtonsCallBack();
      }
    });
  });
  // console.log('updated options: ', options) // debug
} // updateOptions end


// ヘルパ

// エラーメッセージの表示(予期せぬ状況の確認)
function printException(tooiException) {
  console.log('tooi: ' + tooiException + ' at: ' + window.location);
}

// エレメントへのstyle属性の設定
function setStyle(element, attrSet) {
  Object.keys(attrSet).forEach(key => (element.style[key] = attrSet[key]));
}

// エレメントのbackgroudImageのurlを取得する(`url("")`を除去する)
function getBackgroundImageUrl(element) {
  return element.style.backgroundImage.replace(/url\("([^"]*)"\)/, '$1');
}

// 画像URLを http～:orig に揃える
function formatUrl(imgurl) {
  if (!imgurl) {
    return null;
  }

  const url = new URL(imgurl);
  const searchSet = {};
  url.search
    .slice(1)
    .split('&')
    .forEach(set => {
      const [key, value] = set.split('=');
      searchSet[key] = value;
    });

  if (/https:\/\/pbs\.twimg\.com\/media/.test(url)) {
    const [_matched, pathname, extension] = url.pathname.match(
      /^(.*?)(?:|\.([^.:]+))(?:|:[a-z]+)$/
    );
    // TweetDeckのURLでは拡張子を優先する
    // ref: https://hogashi.hatenablog.com/entry/2018/08/15/042044
    return `${url.protocol}//${url.host}${pathname}.${
      extension ? extension : searchSet.format
    }:orig`;
  }
  return url;
}

// 画像URLのリストを受け取って、新しいタブに開く
function openImagesInNewTab(imgurls) {
  Array.from(imgurls)
    .reverse()
    .forEach(imgurl => {
      // if 画像URLが取得できたなら
      const url = formatUrl(imgurl);
      if (url) {
        window.open(url);
      } else {
        printException('no image url');
      }
    });
}
