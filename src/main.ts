interface Options {
  // 公式Web
  SHOW_ON_TIMELINE: TooiBoolean;
  SHOW_ON_TWEET_DETAIL: TooiBoolean;
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: TooiBoolean;
  SHOW_ON_TWEETDECK_TWEET_DETAIL: TooiBoolean;
  // 画像ページ
  STRIP_IMAGE_SUFFIX: TooiBoolean;
}

type OptionsMaybe = { [key in keyof Options]?: TooiBoolean };

/**
 * 設定項目の初期値は「無効」(最初のボタン表示が早過ぎる/一旦表示すると消さないため)
 * 有効だった場合はDOMが変更される間に設定が読み込まれて有効になる
 * 無効だった場合はそのままボタンは表示されない
 */
export const options: Options = {
  // 公式Web
  SHOW_ON_TIMELINE: 'isfalse',
  SHOW_ON_TWEET_DETAIL: 'isfalse',
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: 'isfalse',
  SHOW_ON_TWEETDECK_TWEET_DETAIL: 'isfalse',
  // 画像ページ
  STRIP_IMAGE_SUFFIX: 'isfalse',
};

// %%% splitter for userjs %%%

/**
 * Constants
 */
// 定数

// 設定取得メッセージ
export const OPTION_UPDATED = 'OPTION_UPDATED';
export const GET_LOCAL_STORAGE = 'GET_LOCAL_STORAGE';

// 公式Web
export const HOST_TWITTER_COM = 'twitter.com';
export const HOST_MOBILE_TWITTER_COM = 'mobile.twitter.com';
export const SHOW_ON_TIMELINE = 'SHOW_ON_TIMELINE';
export const SHOW_ON_TWEET_DETAIL = 'SHOW_ON_TWEET_DETAIL';
// TweetDeck
export const HOST_TWEETDECK_TWITTER_COM = 'tweetdeck.twitter.com';
export const SHOW_ON_TWEETDECK_TIMELINE = 'SHOW_ON_TWEETDECK_TIMELINE';
export const SHOW_ON_TWEETDECK_TWEET_DETAIL = 'SHOW_ON_TWEETDECK_TWEET_DETAIL';
// 画像ページ
export const HOST_PBS_TWIMG_COM = 'pbs.twimg.com';
export const STRIP_IMAGE_SUFFIX = 'STRIP_IMAGE_SUFFIX';

/** 公式Webかどうか */
export const isTwitter = (): boolean =>
  window.location.hostname === HOST_TWITTER_COM ||
  window.location.hostname === HOST_MOBILE_TWITTER_COM;
/** Tweetdeckかどうか */
export const isTweetdeck = (): boolean =>
  window.location.hostname === HOST_TWEETDECK_TWITTER_COM;
/** 画像ページかどうか */
export const isImageTab = (): boolean =>
  window.location.hostname === HOST_PBS_TWIMG_COM;

/** これ自体がChrome拡張機能かどうか */
export const isNativeChromeExtension = (): boolean =>
  window.chrome !== undefined &&
  window.chrome.runtime !== undefined &&
  window.chrome.runtime.id !== undefined;

// 設定

// 設定に使う真偽値
export const isTrue = 'istrue';
export const isFalse = 'isfalse';
type TooiBoolean = typeof isTrue | typeof isFalse;

export const OPTION_KEYS = [
  SHOW_ON_TIMELINE,
  SHOW_ON_TWEET_DETAIL,
  SHOW_ON_TWEETDECK_TIMELINE,
  SHOW_ON_TWEETDECK_TWEET_DETAIL,
  STRIP_IMAGE_SUFFIX,
] as const;
export const OPTIONS_TEXT: { [key: string]: string } = {
  // 公式Web
  SHOW_ON_TIMELINE: 'タイムラインにボタンを表示',
  SHOW_ON_TWEET_DETAIL: 'ツイート詳細にボタンを表示',
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: 'タイムラインにボタンを表示',
  SHOW_ON_TWEETDECK_TWEET_DETAIL: 'ツイート詳細にボタンを表示',
  // 画像ページ
  STRIP_IMAGE_SUFFIX: '[Ctrl]+[s]で拡張子を校正',
};

/**
 * Utils
 */
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
    throw new Error('tooi: ' + tooiException + ' at: ' + window.location.href);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

/** 画像urlの要素を集める */
export const collectUrlParams = (
  rawUrl: string
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
    .forEach(set => {
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

/**
 * エレメントにスタイル当てる
 * @param {HTMLElement} element スタイル当てる対象エレメント
 * @param {Object} propertySet プロパティ名('font-size')と値('10px')のオブジェクト
 */
export const setStyle = (
  element: HTMLElement,
  propertySet: { [key: string]: string }
): void => {
  Object.entries(propertySet).forEach(([key, value]) =>
    element.style.setProperty(key, value)
  );
};

export const onOriginalButtonClick = (
  e: MouseEvent,
  imgSrcs: string[]
): void => {
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

interface ButtonSetterType {
  setButtonOnTimeline: (currentOptions: Options) => void;
  setButtonOnTweetDetail: (currentOptions: Options) => void;
}

/**
 * twitter.comでボタンを設置するクラス
 */
export class ButtonSetter implements ButtonSetterType {
  // タイムラインにボタン表示
  public setButtonOnTimeline(currentOptions: Options): void {
    // 昔のビューの処理はしばらく残す
    // ref: https://github.com/hogashi/twitterOpenOriginalImage/issues/32#issuecomment-578510155
    if (document.querySelector('#react-root')) {
      this._setButtonOnReactLayoutTimeline(currentOptions);
      return;
    }
    this._setButtonOnTimeline(currentOptions);
  }

  // ツイート詳細にボタン表示
  public setButtonOnTweetDetail(currentOptions: Options): void {
    // 昔のビューの処理はしばらく残す
    // TODO: Reactレイアウトでも実装する必要がある？
    // ref: https://github.com/hogashi/twitterOpenOriginalImage/issues/32#issuecomment-578510155
    this._setButtonOnTweetDetail(currentOptions);
  }

  private setButton({
    className,
    getImgSrcs,
    target,
  }: {
    className: string;
    getImgSrcs: () => string[];
    target: HTMLElement;
  }): void {
    const style = {
      width: '70px',
      'font-size': '13px',
      color: this.getActionButtonColor(),
    };

    /* つくるDOMは以下 */
    /*
      <div className='ProfileTweet-action tooi-button-container'>
        <input
          className='tooi-button'
          style={style}
          type='button'
          value='Original'
          onClick={(e) => {
            onOriginalButtonClick(e, imgSrcs);
          }}
        />
      </div>
    */

    const button = document.createElement('input');
    button.className = 'tooi-button';
    setStyle(button, style);
    button.type = 'button';
    button.value = 'Original';
    button.addEventListener('click', e => {
      onOriginalButtonClick(e, getImgSrcs());
    });

    const container = document.createElement('div');
    container.classList.add('ProfileTweet-action', className);

    target.appendChild(container);
    container.appendChild(button);
  }

  private setReactLayoutButton({
    className,
    getImgSrcs,
    target,
  }: {
    className: string;
    getImgSrcs: () => string[];
    target: HTMLElement;
  }): void {
    const button = document.createElement('input');

    button.type = 'button';
    button.value = 'Original';
    const color = this.getReactLayoutActionButtonColor();
    setStyle(button, {
      'font-size': '13px',
      padding: '4px 8px',
      color,
      'background-color': 'rgba(0, 0, 0, 0)',
      border: `1px solid ${color}`,
      'border-radius': '3px',
      cursor: 'pointer',
    });
    button.addEventListener('click', e => {
      onOriginalButtonClick(e, getImgSrcs());
    });

    const container = document.createElement('div');
    // container.id = '' + tweet.id
    container.classList.add(className);
    setStyle(container, {
      display: 'flex',
      'margin-left': '20px',
      'flex-flow': 'column',
      'justify-content': 'center',
    });

    target.appendChild(container);
    container.appendChild(button);
  }

  private _setButtonOnTimeline(currentOptions: Options): void {
    // タイムラインにボタン表示する設定がされているときだけ実行する
    // - isTrue か 設定なし のとき ON
    // - isFalse のとき OFF
    if (!(currentOptions[SHOW_ON_TIMELINE] !== isFalse)) {
      return;
    }
    const tweets = document.getElementsByClassName('js-stream-tweet');
    if (!tweets.length) {
      return;
    }
    const className = 'tooi-button-container-timeline';
    // 各ツイートに対して
    Array.from(tweets).forEach(tweet => {
      // 画像ツイートかつまだ処理を行っていないときのみ行う
      if (
        !(
          tweet.getElementsByClassName('AdaptiveMedia-container').length !==
            0 &&
          tweet
            .getElementsByClassName('AdaptiveMedia-container')[0]
            .getElementsByTagName('img').length !== 0
        ) ||
        tweet.getElementsByClassName(className).length !== 0
      ) {
        return;
      }
      // 操作ボタンの外側は様式にあわせる
      const actionList = tweet.querySelector<HTMLElement>(
        '.ProfileTweet-actionList'
      );
      if (!actionList) {
        printException('no target');
        return;
      }

      // 画像の親が取得できたら
      const mediaContainer = tweet.getElementsByClassName(
        'AdaptiveMedia-container'
      )[0] as HTMLElement;
      const getImgSrcs = (): string[] =>
        Array.from(
          mediaContainer.getElementsByClassName('AdaptiveMedia-photoContainer')
        ).map(element => element.getElementsByTagName('img')[0].src);
      this.setButton({
        className,
        getImgSrcs,
        target: actionList,
      });
    });
  }

  private _setButtonOnTweetDetail(currentOptions: Options): void {
    // ツイート詳細にボタン表示する設定がされているときだけ実行する
    // - isTrue か 設定なし のとき ON
    // - isFalse のとき OFF
    if (!(currentOptions[SHOW_ON_TWEET_DETAIL] !== isFalse)) {
      return;
    }
    const className = 'tooi-button-container-detail';
    if (
      !document.getElementsByClassName('permalink-tweet-container')[0] ||
      !document
        .getElementsByClassName('permalink-tweet-container')[0]
        .getElementsByClassName('AdaptiveMedia-photoContainer')[0] ||
      document.getElementsByClassName(className).length !== 0
    ) {
      // ツイート詳細ページでない、または、メインツイートが画像ツイートでないとき
      // または、すでに処理を行ってあるとき
      // 何もしない
      return;
    }
    // Originalボタンの親の親となる枠
    const actionList = document.querySelector<HTMLElement>(
      '.permalink-tweet-container .ProfileTweet-actionList'
    );
    if (!actionList) {
      printException('no target');
      return;
    }

    // .AdaptiveMedia-photoContainer: 画像のエレメントからURLを取得する
    const getImgSrcs = (): string[] =>
      Array.from(
        document
          .getElementsByClassName('permalink-tweet-container')[0]
          .getElementsByClassName('AdaptiveMedia-photoContainer')
      ).map(element => element.getElementsByTagName('img')[0].src);
    this.setButton({
      className,
      getImgSrcs,
      target: actionList,
    });
  }

  private _setButtonOnReactLayoutTimeline(currentOptions: Options): void {
    // ツイート詳細にボタン表示する設定がされているときだけ実行する
    // - isTrue か 設定なし のとき ON
    // - isFalse のとき OFF
    if (!(currentOptions[SHOW_ON_TIMELINE] !== isFalse)) {
      return;
    }
    const className = 'tooi-button-container-react-timeline';
    const tweets = Array.from(
      document.querySelectorAll('#react-root main section article')
    );
    if (!tweets.length) {
      return;
    }
    // 各ツイートに対して
    tweets.forEach(tweet => {
      // 画像ツイート かつ 画像が1枚でもある かつ まだ処理を行っていないときのみ実行
      const tweetATags = Array.from(tweet.querySelectorAll('a')).filter(aTag =>
        /\/status\/[0-9]+\/photo\//.test(aTag.href)
      );
      if (
        tweetATags.length === 0 ||
        tweetATags.every(aTag => !aTag.querySelector('img')) ||
        tweet.getElementsByClassName(className)[0]
      ) {
        return;
      }
      // ボタンを設置
      // 操作ボタンの外側は様式にあわせる
      const target = tweet.querySelector<HTMLElement>('div[role="group"]');
      if (!target) {
        printException('no target');
        return;
      }

      const getImgSrcs = (): string[] => {
        const tweetImgs = tweetATags.map(aTag => aTag.querySelector('img'));
        if (tweetImgs.length === 4) {
          // 4枚のとき2枚目と3枚目のDOMの順序が前後するので直す
          const tweetimgTmp = tweetImgs[1];
          tweetImgs[1] = tweetImgs[2];
          tweetImgs[2] = tweetimgTmp;
        }
        return tweetImgs
          .map(img =>
            // filter で string[] にするためにここで string[] にする……
            img ? img.src : ''
          )
          .filter(src => src != '');
      };

      this.setReactLayoutButton({
        className,
        getImgSrcs,
        target,
      });
    });
  }

  private getActionButtonColor(): string {
    // コントラスト比4.5(chromeの推奨する最低ライン)の色
    const contrastLimitColor = '#697b8c';

    const actionButton = document.querySelector(
      '.ProfileTweet-actionButton'
    ) as HTMLElement;
    if (!(actionButton && actionButton.style)) {
      return contrastLimitColor;
    }

    const buttonColor = window.getComputedStyle(actionButton).color;
    if (buttonColor && buttonColor.length > 0) {
      return buttonColor;
    }
    return contrastLimitColor;
  }

  private getReactLayoutActionButtonColor(): string {
    // 文字色
    // 初期値: コントラスト比4.5(chromeの推奨する最低ライン)の色
    let color = '#697b8c';
    // ツイートアクション(返信とか)のボタンのクラス(夜間モードか否かでクラス名が違う)
    const actionButton = document.querySelector<HTMLElement>(
      'div[role="group"] div[role="button"]'
    );
    if (
      actionButton &&
      actionButton.children[0] &&
      (actionButton.children[0] as HTMLElement).style
    ) {
      const buttonColor = window.getComputedStyle(
        actionButton.children[0]
      ).color;
      if (buttonColor && buttonColor.length > 0) {
        color = buttonColor;
      }
    }

    return color;
  }
}

/**
 * tweetdeck.twitter.comでボタンを設置するクラス
 */
export class ButtonSetterTweetDeck implements ButtonSetterType {
  // タイムラインにボタン表示
  public setButtonOnTimeline(currentOptions: Options): void {
    // タイムラインにボタン表示する設定がされているときだけ実行する
    // - isTrue か 設定なし のとき ON
    // - isFalse のとき OFF
    if (!(currentOptions[SHOW_ON_TWEETDECK_TIMELINE] !== isFalse)) {
      return;
    }
    // if タイムラインのツイートを取得できたら
    // is-actionable: タイムラインのみ
    const tweets = document.getElementsByClassName(
      'js-stream-item is-actionable'
    ) as HTMLCollectionOf<HTMLElement>;
    if (!tweets.length) {
      return;
    }
    const className = 'tooi-button-container-tweetdeck-timeline';
    // 各ツイートに対して
    Array.from(tweets).forEach(tweet => {
      if (
        !tweet.getElementsByClassName('js-media-image-link').length ||
        tweet.getElementsByClassName('is-video').length ||
        tweet.getElementsByClassName('is-gif').length ||
        tweet.getElementsByClassName(className).length
      ) {
        // メディアツイートでない
        // または メディアが画像でない(動画/GIF)
        // または すでにボタンをおいてあるとき
        // 何もしない
        return;
      }

      const target = tweet.querySelector('footer');
      if (!target) {
        // ボタンを置く場所がないとき
        // 何もしない
        printException('no target');
        return;
      }

      const getImgSrcs = (): string[] => {
        return Array.from(tweet.getElementsByClassName('js-media-image-link'))
          .map(element => {
            const urlstr = this.getBackgroundImageUrl(element as HTMLElement);
            // filter で string[] にするためにここで string[] にする……
            return urlstr ? urlstr : '';
          })
          .filter(urlstr => urlstr != '');
      };
      this.setButton({
        className,
        getImgSrcs,
        target,
      });
    });
  }

  // ツイート詳細にボタン表示
  public setButtonOnTweetDetail(currentOptions: Options): void {
    // ツイート詳細にボタン表示する設定がされているときだけ実行する
    // - isTrue か 設定なし のとき ON
    // - isFalse のとき OFF
    if (!(currentOptions[SHOW_ON_TWEETDECK_TWEET_DETAIL] !== isFalse)) {
      return;
    }
    // if ツイート詳細を取得できたら
    const tweets = document.getElementsByClassName(
      'js-tweet-detail'
    ) as HTMLCollectionOf<HTMLElement>;
    if (!tweets.length) {
      return;
    }
    const className = 'tooi-button-container-tweetdeck-detail';
    // 各ツイートに対して
    Array.from(tweets).forEach(tweet => {
      if (
        (!tweet.getElementsByClassName('media-img').length &&
          !tweet.getElementsByClassName('media-image').length) ||
        tweet.getElementsByClassName(className).length
      ) {
        // メディアツイートでない (画像のタグが取得できない)
        // または すでにボタンをおいてあるとき
        // 何もしない
        return;
      }
      const target = tweet.querySelector('footer');
      if (!target) {
        // ボタンを置く場所がないとき
        // 何もしない
        printException('no target');
        return;
      }

      const getImgSrcs = (): string[] => {
        if (tweet.getElementsByClassName('media-img').length !== 0) {
          return [
            (tweet.getElementsByClassName('media-img')[0] as HTMLImageElement)
              .src,
          ];
        } else {
          return Array.from(tweet.getElementsByClassName('media-image'))
            .map(element => {
              const urlstr = this.getBackgroundImageUrl(element as HTMLElement);
              // filter で string[] にするためにここで string[] にする……
              return urlstr ? urlstr : '';
            })
            .filter(urlstr => urlstr != '');
        }
      };

      this.setButton({
        className,
        getImgSrcs,
        target,
      });
    });
  }

  private setButton({
    className,
    getImgSrcs,
    target,
  }: {
    className: string;
    getImgSrcs: () => string[];
    target: HTMLElement;
  }): void {
    // 枠線の色は'Original'と同じく'.txt-mute'の色を使うので取得する
    const txtMute = document.querySelector('.txt-mute');
    const borderColor = txtMute
      ? window.getComputedStyle(txtMute).color
      : '#697b8c';
    // ボタンのスタイル設定
    const style = {
      border: `1px solid ${borderColor}`,
      'border-radius': '2px',
      display: 'inline-block',
      'font-size': '0.75em',
      'margin-top': '5px',
      padding: '1px 1px 0',
      'line-height': '1.5em',
      cursor: 'pointer',
    };

    /* つくるDOMは以下 */
    /*
      <a
        className={className}
        style={style}
        onClick={(e) => {
          onOriginalButtonClick(e, imgSrcs);
        }}
      >
        Original
      </a>
    */

    // tweetdeckのツイート右上の時刻などに使われているclassを使う
    // 設置の有無の判別用にclassNameを付与する
    const button = document.createElement('a');
    button.className = `pull-left margin-txs txt-mute ${className}`;
    setStyle(button, style);
    button.addEventListener('click', e => {
      onOriginalButtonClick(e, getImgSrcs());
    });
    button.insertAdjacentHTML('beforeend', 'Original');

    target.appendChild(button);
  }

  private getBackgroundImageUrl(element: HTMLElement): string | null {
    if (element.style.backgroundImage) {
      return element.style.backgroundImage.replace(/url\("?([^"]*)"?\)/, '$1');
    }
    return null;
  }
}

export const getButtonSetter = (): ButtonSetterType => {
  if (isTweetdeck()) {
    return new ButtonSetterTweetDeck();
  }
  return new ButtonSetter();
};

/**
 * 設定項目更新
 * background script に問い合わせて返ってきた値で options を書き換える
 */
export const updateOptions = (): Promise<void> => {
  // これ自体はChrome拡張機能でない(UserScriptとして読み込まれている)とき
  // 設定は変わりようがないので何もしない
  if (!isNativeChromeExtension()) {
    return Promise.resolve();
  }
  return new Promise<OptionsMaybe>(resolve => {
    const request: MessageRequest = {
      method: GET_LOCAL_STORAGE,
    };
    const callback = (response: MessageResponse): void => {
      // 何かおかしくて設定内容取ってこれなかったらデフォルトということにする
      resolve(response && response.data ? response.data : {});
    };
    window.chrome.runtime.sendMessage(request, callback);
  }).then((data: OptionsMaybe) => {
    const newOptions: OptionsMaybe = {};
    // ここで全部埋めるので newOptions は Options になる
    OPTION_KEYS.forEach(key => {
      newOptions[key] = data[key] || isTrue;
    });

    // console.log('get options (then): ', newOptions); // debug

    (Object.keys(newOptions) as Array<keyof Options>).forEach(key => {
      options[key] = (newOptions as Options)[key];
    });
  });
};

/** Originalボタンおく */
const setOriginalButton = (): void => {
  // 実行の間隔(ms)
  const INTERVAL = 300;

  // ボタン設置クラス
  const buttonSetter = getButtonSetter();

  // ボタンを設置
  const setButton = (): void => {
    // console.log('setButton: ' + options['SHOW_ON_TIMELINE'] + ' ' + options['SHOW_ON_TWEET_DETAIL']) // debug
    buttonSetter.setButtonOnTimeline(options);
    buttonSetter.setButtonOnTweetDetail(options);
  };

  let isInterval = false;
  let deferred = false;
  const setButtonWithInterval = (): void => {
    // 短時間に何回も実行しないようインターバルを設ける
    if (isInterval) {
      deferred = true;
      return;
    }
    isInterval = true;
    setTimeout(() => {
      isInterval = false;
      if (deferred) {
        setButton();
        deferred = false;
      }
    }, INTERVAL);

    setButton();
  };

  // ボタンを(再)設置
  setButtonWithInterval();

  // ページ全体でDOMの変更を検知し都度ボタン設置
  const observer = new MutationObserver(setButtonWithInterval);
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
        updateOptions().then(() => {
          // ボタンを(再)設置
          setButtonWithInterval();
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
const fixFileNameOnSaveCommand = (): void => {
  // キーを押したとき
  document.addEventListener('keydown', e => {
    // 設定が有効なら
    if (options[STRIP_IMAGE_SUFFIX] !== 'isfalse') {
      downloadImage(e);
    }
  });
};

/** メインの処理 */
updateOptions().then(() => {
  if (isTwitter() || isTweetdeck()) {
    /** 公式Web/TweetDeck */
    setOriginalButton();
  } else if (isImageTab()) {
    /** 画像ページ(https://pbs.twimg.com/*) */
    fixFileNameOnSaveCommand();
  }
});
