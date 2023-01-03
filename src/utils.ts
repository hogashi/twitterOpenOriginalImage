import { ButtonSetter, ButtonSetterType } from './ButtonSetter';
import { ButtonSetterTweetDeck } from './ButtonSetterTweetDeck';
import {
  GET_LOCAL_STORAGE,
  isNativeChromeExtension,
  isTrue,
  isTweetdeck,
  Options,
  OptionsMaybe,
  OPTION_KEYS,
  OPTION_UPDATED,
  STRIP_IMAGE_SUFFIX,
  initialOptions,
} from './constants';

/** chrome.runtime.sendMessage で送るメッセージ */
export interface MessageRequest {
  method: string;
}
/** chrome.runtime.sendMessage で返るメッセージ */
export interface MessageResponse {
  data: { [key: string]: string } | null;
}

/** エラーメッセージの表示(予期せぬ状況の確認) */
export const printException = (tooiException: string): void => {
  try {
    throw new Error(`tooi: ${tooiException} at: ${window.location.href}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

/** 画像urlの要素を集める */
export const collectUrlParams = (
  rawUrl: string,
): {
  protocol: string;
  host: string;
  pathname: string;
  format: string;
  name: string | null;
} | null => {
  if (!/https:\/\/pbs\.twimg\.com\/media/.test(rawUrl)) {
    // twitterの画像URLでないときnull
    return null;
  }

  const url = new URL(rawUrl);
  const searchSet: {
    format: string;
    name: string | null;
  } = {
    format: 'jpg', // 拡張子が無い場合はjpgにフォールバック
    name: null, // 大きさ指定がない場合はnull
  };
  url.search
    .slice(1)
    .split('&')
    .forEach((set) => {
      const [key, value] = set.split('=');
      if (key === 'format' || key === 'name') {
        searchSet[key] = value;
      }
    });

  // 空文字でもどんな文字列でもマッチする正規表現なのでnon-null
  const matched = url.pathname.match(/^(.*?)(?:|\.([^.:]+))(?:|:([a-z]+))$/)!;
  // どんな文字列でも空文字は最低入るのでnon-null
  const pathnameWithoutExtension = matched[1]!;
  // 拡張子はないかもしれないのでundefinedも示しておく
  const extension = matched[2] as string | undefined;
  // コロンを使う大きさ指定はないかもしれないのでなかったらnull
  const legacyName = matched[3] || null;

  return {
    protocol: url.protocol,
    host: url.host,
    pathname: pathnameWithoutExtension,
    // 2.1.11時点ではクエリパラメータを使うのはTweetDeckのみ
    // TweetDeckのURLでは拡張子を優先する
    // ref: https://hogashi.hatenablog.com/entry/2018/08/15/042044
    format: extension || searchSet.format,
    name: searchSet.name || legacyName,
  };
};

/** 画像URLを https～?format=〜&name=orig に揃える */
export const formatUrl = (imgUrl: string): string | null => {
  if (imgUrl.length === 0) {
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

/** 画像を開く */
export const openImages = (imgSrcs: string[]): void => {
  if (imgSrcs.length === 0) {
    printException('zero image urls');
    return;
  }
  Array.from(imgSrcs)
    .reverse() // 逆順に開くことで右側のタブから読める
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

/**
 * エレメントにスタイル当てる
 * @param {HTMLElement} element スタイル当てる対象エレメント
 * @param {Object} propertySet プロパティ名('font-size')と値('10px')のオブジェクト
 */
export const setStyle = (element: HTMLElement, propertySet: { [key: string]: string }): void => {
  Object.entries(propertySet).forEach(([key, value]) => element.style.setProperty(key, value));
};

export const onOriginalButtonClick = (e: MouseEvent, imgSrcs: string[]): void => {
  // イベント(MouseEvent)による既定の動作をキャンセル
  e.preventDefault();
  // イベント(MouseEvent)の親要素への伝播を停止
  e.stopPropagation();

  openImages(imgSrcs);
};

export const getImageFilenameByUrl = (imgUrl: string): string | null => {
  const params = collectUrlParams(imgUrl);
  if (!params) {
    return null;
  }

  const { pathname, format, name } = params;
  const basename = pathname.match(/([^/.]*)$/)![1];

  return `${basename}${name ? `-${name}` : ''}.${format}`;
};

export const downloadImage = (e: KeyboardEvent): void => {
  // if 押されたキーがC-s の状態なら
  // かつ 開いているURLが画像URLの定形なら(pbs.twimg.comを使うものは他にも存在するので)
  if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
    const imageSrc = document.querySelector('img')!.src;
    const filename = getImageFilenameByUrl(imageSrc);
    if (!filename) {
      return;
    }
    // もとの挙動(ブラウザが行う保存)をしないよう中止
    e.preventDefault();

    // download属性に正しい拡張子の画像名を入れたaタグをつくってクリックする
    const a = document.createElement('a');
    a.href = window.location.href;
    a.setAttribute('download', filename);
    a.dispatchEvent(new MouseEvent('click'));
  }
};

export const getButtonSetter = (): ButtonSetterType =>
  isTweetdeck() ? new ButtonSetterTweetDeck() : new ButtonSetter();

/**
 * 設定項目更新
 * background script に問い合わせて返ってきた値で options をつくって返す
 */
export const updateOptions = (): Promise<Options> => {
  // これ自体はChrome拡張機能でない(UserScriptとして読み込まれている)とき
  // 設定は変わりようがないので何もしない
  if (!isNativeChromeExtension()) {
    return Promise.resolve(initialOptions);
  }
  return new Promise<OptionsMaybe>((resolve) => {
    const request: MessageRequest = {
      method: GET_LOCAL_STORAGE,
    };
    const callback = (response: MessageResponse): void => {
      // 何かおかしくて設定内容取ってこれなかったらデフォルトということにする
      resolve(response?.data ? response.data : {});
    };
    window.chrome.runtime.sendMessage(request, callback);
  }).then((data: OptionsMaybe) => {
    const newOptions: OptionsMaybe = {};
    // ここで全部埋めるので newOptions は Options になる
    OPTION_KEYS.forEach((key) => {
      newOptions[key] = data[key] || isTrue;
    });

    // console.log('get options (then): ', newOptions); // debug

    return newOptions as Options;
  });
};

/** Originalボタンおく */
export const setOriginalButton = (options: Options): void => {
  // 実行の間隔(ms)
  const INTERVAL = 300;

  // ボタン設置クラス
  const buttonSetter = getButtonSetter();

  // ボタンを設置
  const setButton = (currentOptions: Options): void => {
    // console.log('setButton: ' + currentOptions['SHOW_ON_TIMELINE'] + ' ' + currentOptions['SHOW_ON_TWEET_DETAIL']) // debug
    buttonSetter.setButtonOnTimeline(currentOptions);
    buttonSetter.setButtonOnTweetDetail(currentOptions);
  };

  let isInterval = false;
  let deferred = false;
  const setButtonWithInterval = (currentOptions: Options): void => {
    // 短時間に何回も実行しないようインターバルを設ける
    if (isInterval) {
      deferred = true;
      return;
    }
    isInterval = true;
    setTimeout(() => {
      isInterval = false;
      if (deferred) {
        setButton(currentOptions);
        deferred = false;
      }
    }, INTERVAL);

    setButton(currentOptions);
  };

  // ボタンを(再)設置
  setButtonWithInterval(options);

  // ページ全体でDOMの変更を検知し都度ボタン設置
  const observer = new MutationObserver(() => setButtonWithInterval(options));
  const target = document.querySelector('body')!;
  const config = { childList: true, subtree: true };
  observer.observe(target, config);

  // 設定反映のためのリスナー設置
  // これ自体がChrome拡張機能のときだけ設置する
  // (Chrome拡張機能でないときは設定反映できる機構ないので)
  if (isNativeChromeExtension()) {
    window.chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
      // Unchecked runtime.lastError みたいなエラーが出ることがあるので,
      // ひとまず console.log で出すようにしてみている
      if (window.chrome.runtime.lastError !== undefined) {
        // eslint-disable-next-line no-console
        console.log(window.chrome.runtime.lastError);
      }
      if (request.method === OPTION_UPDATED) {
        updateOptions().then((options) => {
          // ボタンを(再)設置
          setButtonWithInterval(options);
          sendResponse({ data: 'done' });
        });
        return true;
      }
      sendResponse({ data: 'yet' });
      return true;
    });
  }
};

/**
 * twitterの画像を表示したときのC-sを拡張
 * 画像のファイル名を「～.jpg-orig」「～.png-orig」ではなく「～-orig.jpg」「～-orig.png」にする
 */
export const fixFileNameOnSaveCommand = (options: Options): void => {
  // キーを押したとき
  document.addEventListener('keydown', (e) => {
    // 設定が有効なら
    if (options[STRIP_IMAGE_SUFFIX] !== 'isfalse') {
      downloadImage(e);
    }
  });
};
