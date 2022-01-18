// ==UserScript==
// @author          hogashi
// @name            twitterOpenOriginalImage
// @namespace       https://hogashi.hatenablog.com/
// @description     TwitterページでOriginalボタンを押すと原寸の画像が開きます(https://hogashi.hatenablog.com)
// @include         https://twitter.com*
// @include         https://mobile.twitter.com*
// @include         https://tweetdeck.twitter.com*
// @include         https://pbs.twimg.com/media*
// @version         3.2.2
// ==/UserScript==

/**
 * userjs 用の設定項目
 * 'isfalse' とすると、その設定がオフになる
 */
var userjsOptions = {
    // 公式Web
    SHOW_ON_TIMELINE: 'istrue',
    SHOW_ON_TWEET_DETAIL: 'istrue',
    // TweetDeck
    SHOW_ON_TWEETDECK_TIMELINE: 'istrue',
    SHOW_ON_TWEETDECK_TWEET_DETAIL: 'istrue',
    // 画像ページ
    STRIP_IMAGE_SUFFIX: 'istrue'
};
/**
 * Constants
 */
// 定数
// 設定取得メッセージ
var OPTION_UPDATED = 'OPTION_UPDATED';
var GET_LOCAL_STORAGE = 'GET_LOCAL_STORAGE';
// 公式Web
var HOST_TWITTER_COM = 'twitter.com';
var HOST_MOBILE_TWITTER_COM = 'mobile.twitter.com';
var SHOW_ON_TIMELINE = 'SHOW_ON_TIMELINE';
var SHOW_ON_TWEET_DETAIL = 'SHOW_ON_TWEET_DETAIL';
// TweetDeck
var HOST_TWEETDECK_TWITTER_COM = 'tweetdeck.twitter.com';
var SHOW_ON_TWEETDECK_TIMELINE = 'SHOW_ON_TWEETDECK_TIMELINE';
var SHOW_ON_TWEETDECK_TWEET_DETAIL = 'SHOW_ON_TWEETDECK_TWEET_DETAIL';
// 画像ページ
var HOST_PBS_TWIMG_COM = 'pbs.twimg.com';
var STRIP_IMAGE_SUFFIX = 'STRIP_IMAGE_SUFFIX';
/** 公式Webかどうか */
var isTwitter = function () {
    return window.location.hostname === HOST_TWITTER_COM ||
        window.location.hostname === HOST_MOBILE_TWITTER_COM;
};
/** Tweetdeckかどうか */
var isTweetdeck = function () {
    return window.location.hostname === HOST_TWEETDECK_TWITTER_COM;
};
/** 画像ページかどうか */
var isImageTab = function () {
    return window.location.hostname === HOST_PBS_TWIMG_COM;
};
/** これ自体がChrome拡張機能かどうか */
var isNativeChromeExtension = function () {
    return window.chrome !== undefined &&
        window.chrome.runtime !== undefined &&
        window.chrome.runtime.id !== undefined;
};
// 設定
// 設定に使う真偽値
var isTrue = 'istrue';
var isFalse = 'isfalse';
var OPTION_KEYS = [
    SHOW_ON_TIMELINE,
    SHOW_ON_TWEET_DETAIL,
    SHOW_ON_TWEETDECK_TIMELINE,
    SHOW_ON_TWEETDECK_TWEET_DETAIL,
    STRIP_IMAGE_SUFFIX,
];
var OPTIONS_TEXT = {
    // 公式Web
    SHOW_ON_TIMELINE: 'タイムラインにボタンを表示',
    SHOW_ON_TWEET_DETAIL: 'ツイート詳細にボタンを表示',
    // TweetDeck
    SHOW_ON_TWEETDECK_TIMELINE: 'タイムラインにボタンを表示',
    SHOW_ON_TWEETDECK_TWEET_DETAIL: 'ツイート詳細にボタンを表示',
    // 画像ページ
    STRIP_IMAGE_SUFFIX: '[Ctrl]+[s]で拡張子を校正'
};
/** エラーメッセージの表示(予期せぬ状況の確認) */
var printException = function (tooiException) {
    try {
        throw new Error('tooi: ' + tooiException + ' at: ' + window.location.href);
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
    }
};
/** 画像urlの要素を集める */
var collectUrlParams = function (rawUrl) {
    if (!/https:\/\/pbs\.twimg\.com\/media/.test(rawUrl)) {
        // twitterの画像URLでないときnull
        return null;
    }
    var url = new URL(rawUrl);
    var searchSet = {
        format: 'jpg',
        name: null
    };
    url.search
        .slice(1)
        .split('&')
        .forEach(function (set) {
        var _a = set.split('='), key = _a[0], value = _a[1];
        if (key === 'format' || key === 'name') {
            searchSet[key] = value;
        }
    });
    // 空文字でもどんな文字列でもマッチする正規表現なのでnon-null
    var matched = url.pathname.match(/^(.*?)(?:|\.([^.:]+))(?:|:([a-z]+))$/);
    // どんな文字列でも空文字は最低入るのでnon-null
    var pathnameWithoutExtension = matched[1];
    // 拡張子はないかもしれないのでundefinedも示しておく
    var extension = matched[2];
    // コロンを使う大きさ指定はないかもしれないのでなかったらnull
    var legacyName = matched[3] || null;
    return {
        protocol: url.protocol,
        host: url.host,
        pathname: pathnameWithoutExtension,
        // 2.1.11時点ではクエリパラメータを使うのはTweetDeckのみ
        // TweetDeckのURLでは拡張子を優先する
        // ref: https://hogashi.hatenablog.com/entry/2018/08/15/042044
        format: extension || searchSet.format,
        name: searchSet.name || legacyName
    };
};
/** 画像URLを https～?format=〜&name=orig に揃える */
var formatUrl = function (imgUrl) {
    if (imgUrl.length === 0) {
        return null;
    }
    var params = collectUrlParams(imgUrl);
    if (!params) {
        // twitterの画像URLでないときそのまま返す
        return imgUrl;
    }
    var protocol = params.protocol, host = params.host, pathname = params.pathname, format = params.format;
    return "".concat(protocol, "//").concat(host).concat(pathname, "?format=").concat(format, "&name=orig");
};
/** 画像を開く */
var openImages = function (imgSrcs) {
    if (imgSrcs.length === 0) {
        printException('zero image urls');
        return;
    }
    Array.from(imgSrcs)
        .reverse() // 逆順に開くことで右側のタブから読める
        .forEach(function (imgSrc) {
        // if 画像URLが取得できたなら
        var url = formatUrl(imgSrc);
        if (url) {
            window.open(url);
        }
        else {
            printException('no image url');
        }
    });
};
/**
 * エレメントにスタイル当てる
 * @param {HTMLElement} element スタイル当てる対象エレメント
 * @param {Object} propertySet プロパティ名('font-size')と値('10px')のオブジェクト
 */
var setStyle = function (element, propertySet) {
    Object.entries(propertySet).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        return element.style.setProperty(key, value);
    });
};
var onOriginalButtonClick = function (e, imgSrcs) {
    // イベント(MouseEvent)による既定の動作をキャンセル
    e.preventDefault();
    // イベント(MouseEvent)の親要素への伝播を停止
    e.stopPropagation();
    openImages(imgSrcs);
};
var getImageFilenameByUrl = function (imgUrl) {
    var params = collectUrlParams(imgUrl);
    if (!params) {
        return null;
    }
    var pathname = params.pathname, format = params.format, name = params.name;
    var basename = pathname.match(/([^/.]*)$/)[1];
    return "".concat(basename).concat(name ? "-".concat(name) : '', ".").concat(format);
};
var downloadImage = function (e) {
    // if 押されたキーがC-s の状態なら
    // かつ 開いているURLが画像URLの定形なら(pbs.twimg.comを使うものは他にも存在するので)
    if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        var imageSrc = document.querySelector('img').src;
        var filename = getImageFilenameByUrl(imageSrc);
        if (!filename) {
            return;
        }
        // もとの挙動(ブラウザが行う保存)をしないよう中止
        e.preventDefault();
        // download属性に正しい拡張子の画像名を入れたaタグをつくってクリックする
        var a = document.createElement('a');
        a.href = window.location.href;
        a.setAttribute('download', filename);
        a.dispatchEvent(new MouseEvent('click'));
    }
};
/**
 * twitter.comでボタンを設置するクラス
 */
var ButtonSetter = /** @class */ (function () {
    function ButtonSetter() {
    }
    // タイムラインにボタン表示
    ButtonSetter.prototype.setButtonOnTimeline = function (currentOptions) {
        // 昔のビューの処理はしばらく残す
        // ref: https://github.com/hogashi/twitterOpenOriginalImage/issues/32#issuecomment-578510155
        if (document.querySelector('#react-root')) {
            this._setButtonOnReactLayoutTimeline(currentOptions);
            return;
        }
        this._setButtonOnTimeline(currentOptions);
    };
    // ツイート詳細にボタン表示
    ButtonSetter.prototype.setButtonOnTweetDetail = function (currentOptions) {
        // 昔のビューの処理はしばらく残す
        // TODO: Reactレイアウトでも実装する必要がある？
        // ref: https://github.com/hogashi/twitterOpenOriginalImage/issues/32#issuecomment-578510155
        this._setButtonOnTweetDetail(currentOptions);
    };
    ButtonSetter.prototype.setButton = function (_a) {
        var className = _a.className, getImgSrcs = _a.getImgSrcs, target = _a.target;
        var style = {
            width: '70px',
            'font-size': '13px',
            color: this.getActionButtonColor()
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
        var button = document.createElement('input');
        button.className = 'tooi-button';
        setStyle(button, style);
        button.type = 'button';
        button.value = 'Original';
        button.addEventListener('click', function (e) {
            onOriginalButtonClick(e, getImgSrcs());
        });
        var container = document.createElement('div');
        container.classList.add('ProfileTweet-action', className);
        target.appendChild(container);
        container.appendChild(button);
    };
    ButtonSetter.prototype.setReactLayoutButton = function (_a) {
        var className = _a.className, getImgSrcs = _a.getImgSrcs, target = _a.target;
        var button = document.createElement('input');
        button.type = 'button';
        button.value = 'Original';
        var color = this.getReactLayoutActionButtonColor();
        setStyle(button, {
            'font-size': '13px',
            padding: '4px 8px',
            color: color,
            'background-color': 'rgba(0, 0, 0, 0)',
            border: "1px solid ".concat(color),
            'border-radius': '3px',
            cursor: 'pointer'
        });
        button.addEventListener('click', function (e) {
            onOriginalButtonClick(e, getImgSrcs());
        });
        var container = document.createElement('div');
        // container.id = '' + tweet.id
        container.classList.add(className);
        setStyle(container, {
            display: 'flex',
            'margin-left': '20px',
            'flex-flow': 'column',
            'justify-content': 'center'
        });
        target.appendChild(container);
        container.appendChild(button);
    };
    ButtonSetter.prototype._setButtonOnTimeline = function (currentOptions) {
        var _this = this;
        // タイムラインにボタン表示する設定がされているときだけ実行する
        // - isTrue か 設定なし のとき ON
        // - isFalse のとき OFF
        if (!(currentOptions[SHOW_ON_TIMELINE] !== isFalse)) {
            return;
        }
        var tweets = document.getElementsByClassName('js-stream-tweet');
        if (!tweets.length) {
            return;
        }
        var className = 'tooi-button-container-timeline';
        // 各ツイートに対して
        Array.from(tweets).forEach(function (tweet) {
            // 画像ツイートかつまだ処理を行っていないときのみ行う
            if (!(tweet.getElementsByClassName('AdaptiveMedia-container').length !==
                0 &&
                tweet
                    .getElementsByClassName('AdaptiveMedia-container')[0]
                    .getElementsByTagName('img').length !== 0) ||
                tweet.getElementsByClassName(className).length !== 0) {
                return;
            }
            // 操作ボタンの外側は様式にあわせる
            var actionList = tweet.querySelector('.ProfileTweet-actionList');
            if (!actionList) {
                printException('no target');
                return;
            }
            // 画像の親が取得できたら
            var mediaContainer = tweet.getElementsByClassName('AdaptiveMedia-container')[0];
            var getImgSrcs = function () {
                return Array.from(mediaContainer.getElementsByClassName('AdaptiveMedia-photoContainer')).map(function (element) { return element.getElementsByTagName('img')[0].src; });
            };
            _this.setButton({
                className: className,
                getImgSrcs: getImgSrcs,
                target: actionList
            });
        });
    };
    ButtonSetter.prototype._setButtonOnTweetDetail = function (currentOptions) {
        // ツイート詳細にボタン表示する設定がされているときだけ実行する
        // - isTrue か 設定なし のとき ON
        // - isFalse のとき OFF
        if (!(currentOptions[SHOW_ON_TWEET_DETAIL] !== isFalse)) {
            return;
        }
        var className = 'tooi-button-container-detail';
        if (!document.getElementsByClassName('permalink-tweet-container')[0] ||
            !document
                .getElementsByClassName('permalink-tweet-container')[0]
                .getElementsByClassName('AdaptiveMedia-photoContainer')[0] ||
            document.getElementsByClassName(className).length !== 0) {
            // ツイート詳細ページでない、または、メインツイートが画像ツイートでないとき
            // または、すでに処理を行ってあるとき
            // 何もしない
            return;
        }
        // Originalボタンの親の親となる枠
        var actionList = document.querySelector('.permalink-tweet-container .ProfileTweet-actionList');
        if (!actionList) {
            printException('no target');
            return;
        }
        // .AdaptiveMedia-photoContainer: 画像のエレメントからURLを取得する
        var getImgSrcs = function () {
            return Array.from(document
                .getElementsByClassName('permalink-tweet-container')[0]
                .getElementsByClassName('AdaptiveMedia-photoContainer')).map(function (element) { return element.getElementsByTagName('img')[0].src; });
        };
        this.setButton({
            className: className,
            getImgSrcs: getImgSrcs,
            target: actionList
        });
    };
    ButtonSetter.prototype._setButtonOnReactLayoutTimeline = function (currentOptions) {
        var _this = this;
        // ツイート詳細にボタン表示する設定がされているときだけ実行する
        // - isTrue か 設定なし のとき ON
        // - isFalse のとき OFF
        if (!(currentOptions[SHOW_ON_TIMELINE] !== isFalse)) {
            return;
        }
        var className = 'tooi-button-container-react-timeline';
        var tweets = Array.from(document.querySelectorAll('#react-root main section article'));
        if (!tweets.length) {
            return;
        }
        // 各ツイートに対して
        tweets.forEach(function (tweet) {
            // 画像ツイート かつ 画像が1枚でもある かつ まだ処理を行っていないときのみ実行
            var tweetATags = Array.from(tweet.querySelectorAll('a')).filter(function (aTag) {
                return /\/status\/[0-9]+\/photo\//.test(aTag.href);
            });
            if (tweetATags.length === 0 ||
                tweetATags.every(function (aTag) { return !aTag.querySelector('img'); }) ||
                tweet.getElementsByClassName(className)[0]) {
                return;
            }
            // ボタンを設置
            // 操作ボタンの外側は様式にあわせる
            var target = tweet.querySelector('div[role="group"]');
            if (!target) {
                printException('no target');
                return;
            }
            var getImgSrcs = function () {
                var tweetImgs = tweetATags.map(function (aTag) { return aTag.querySelector('img'); });
                if (tweetImgs.length === 4) {
                    // 4枚のとき2枚目と3枚目のDOMの順序が前後するので直す
                    var tweetimgTmp = tweetImgs[1];
                    tweetImgs[1] = tweetImgs[2];
                    tweetImgs[2] = tweetimgTmp;
                }
                return tweetImgs
                    .map(function (img) {
                    // filter で string[] にするためにここで string[] にする……
                    return img ? img.src : '';
                })
                    .filter(function (src) { return src != ''; });
            };
            _this.setReactLayoutButton({
                className: className,
                getImgSrcs: getImgSrcs,
                target: target
            });
        });
    };
    ButtonSetter.prototype.getActionButtonColor = function () {
        // コントラスト比4.5(chromeの推奨する最低ライン)の色
        var contrastLimitColor = '#697b8c';
        var actionButton = document.querySelector('.ProfileTweet-actionButton');
        if (!(actionButton && actionButton.style)) {
            return contrastLimitColor;
        }
        var buttonColor = window.getComputedStyle(actionButton).color;
        if (buttonColor && buttonColor.length > 0) {
            return buttonColor;
        }
        return contrastLimitColor;
    };
    ButtonSetter.prototype.getReactLayoutActionButtonColor = function () {
        // 文字色
        // 初期値: コントラスト比4.5(chromeの推奨する最低ライン)の色
        var color = '#697b8c';
        // ツイートアクション(返信とか)のボタンのクラス(夜間モードか否かでクラス名が違う)
        var actionButton = document.querySelector('div[role="group"] div[role="button"]');
        if (actionButton &&
            actionButton.children[0] &&
            actionButton.children[0].style) {
            var buttonColor = window.getComputedStyle(actionButton.children[0]).color;
            if (buttonColor && buttonColor.length > 0) {
                color = buttonColor;
            }
        }
        return color;
    };
    return ButtonSetter;
}());
/**
 * tweetdeck.twitter.comでボタンを設置するクラス
 */
var ButtonSetterTweetDeck = /** @class */ (function () {
    function ButtonSetterTweetDeck() {
    }
    // タイムラインにボタン表示
    ButtonSetterTweetDeck.prototype.setButtonOnTimeline = function (currentOptions) {
        var _this = this;
        // タイムラインにボタン表示する設定がされているときだけ実行する
        // - isTrue か 設定なし のとき ON
        // - isFalse のとき OFF
        if (!(currentOptions[SHOW_ON_TWEETDECK_TIMELINE] !== isFalse)) {
            return;
        }
        // if タイムラインのツイートを取得できたら
        // is-actionable: タイムラインのみ
        var tweets = document.getElementsByClassName('js-stream-item is-actionable');
        if (!tweets.length) {
            return;
        }
        var className = 'tooi-button-container-tweetdeck-timeline';
        // 各ツイートに対して
        Array.from(tweets).forEach(function (tweet) {
            if (!tweet.getElementsByClassName('js-media-image-link').length ||
                tweet.getElementsByClassName('is-video').length ||
                tweet.getElementsByClassName('is-gif').length ||
                tweet.getElementsByClassName(className).length) {
                // メディアツイートでない
                // または メディアが画像でない(動画/GIF)
                // または すでにボタンをおいてあるとき
                // 何もしない
                return;
            }
            var target = tweet.querySelector('footer');
            if (!target) {
                // ボタンを置く場所がないとき
                // 何もしない
                printException('no target');
                return;
            }
            var getImgSrcs = function () {
                return Array.from(tweet.getElementsByClassName('js-media-image-link'))
                    .map(function (element) {
                    var urlstr = _this.getBackgroundImageUrl(element);
                    // filter で string[] にするためにここで string[] にする……
                    return urlstr ? urlstr : '';
                })
                    .filter(function (urlstr) { return urlstr != ''; });
            };
            _this.setButton({
                className: className,
                getImgSrcs: getImgSrcs,
                target: target
            });
        });
    };
    // ツイート詳細にボタン表示
    ButtonSetterTweetDeck.prototype.setButtonOnTweetDetail = function (currentOptions) {
        var _this = this;
        // ツイート詳細にボタン表示する設定がされているときだけ実行する
        // - isTrue か 設定なし のとき ON
        // - isFalse のとき OFF
        if (!(currentOptions[SHOW_ON_TWEETDECK_TWEET_DETAIL] !== isFalse)) {
            return;
        }
        // if ツイート詳細を取得できたら
        var tweets = document.getElementsByClassName('js-tweet-detail');
        if (!tweets.length) {
            return;
        }
        var className = 'tooi-button-container-tweetdeck-detail';
        // 各ツイートに対して
        Array.from(tweets).forEach(function (tweet) {
            if ((!tweet.getElementsByClassName('media-img').length &&
                !tweet.getElementsByClassName('media-image').length) ||
                tweet.getElementsByClassName(className).length) {
                // メディアツイートでない (画像のタグが取得できない)
                // または すでにボタンをおいてあるとき
                // 何もしない
                return;
            }
            var target = tweet.querySelector('footer');
            if (!target) {
                // ボタンを置く場所がないとき
                // 何もしない
                printException('no target');
                return;
            }
            var getImgSrcs = function () {
                if (tweet.getElementsByClassName('media-img').length !== 0) {
                    return [
                        tweet.getElementsByClassName('media-img')[0]
                            .src,
                    ];
                }
                else {
                    return Array.from(tweet.getElementsByClassName('media-image'))
                        .map(function (element) {
                        var urlstr = _this.getBackgroundImageUrl(element);
                        // filter で string[] にするためにここで string[] にする……
                        return urlstr ? urlstr : '';
                    })
                        .filter(function (urlstr) { return urlstr != ''; });
                }
            };
            _this.setButton({
                className: className,
                getImgSrcs: getImgSrcs,
                target: target
            });
        });
    };
    ButtonSetterTweetDeck.prototype.setButton = function (_a) {
        var className = _a.className, getImgSrcs = _a.getImgSrcs, target = _a.target;
        // 枠線の色は'Original'と同じく'.txt-mute'の色を使うので取得する
        var txtMute = document.querySelector('.txt-mute');
        var borderColor = txtMute
            ? window.getComputedStyle(txtMute).color
            : '#697b8c';
        // ボタンのスタイル設定
        var style = {
            border: "1px solid ".concat(borderColor),
            'border-radius': '2px',
            display: 'inline-block',
            'font-size': '0.75em',
            'margin-top': '5px',
            padding: '1px 1px 0',
            'line-height': '1.5em',
            cursor: 'pointer'
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
        var button = document.createElement('a');
        button.className = "pull-left margin-txs txt-mute ".concat(className);
        setStyle(button, style);
        button.addEventListener('click', function (e) {
            onOriginalButtonClick(e, getImgSrcs());
        });
        button.insertAdjacentHTML('beforeend', 'Original');
        target.appendChild(button);
    };
    ButtonSetterTweetDeck.prototype.getBackgroundImageUrl = function (element) {
        if (element.style.backgroundImage) {
            return element.style.backgroundImage.replace(/url\("?([^"]*)"?\)/, '$1');
        }
        return null;
    };
    return ButtonSetterTweetDeck;
}());
var getButtonSetter = function () {
    return isTweetdeck() ? new ButtonSetterTweetDeck() : new ButtonSetter();
};
/**
 * 設定項目更新
 * background script に問い合わせて返ってきた値で options をつくって返す
 */
var updateOptions = function () {
    // これ自体はChrome拡張機能でない(UserScriptとして読み込まれている)とき
    // 設定は変わりようがないので何もしない
    if (!isNativeChromeExtension()) {
        return Promise.resolve(userjsOptions);
    }
    return new Promise(function (resolve) {
        var request = {
            method: GET_LOCAL_STORAGE
        };
        var callback = function (response) {
            // 何かおかしくて設定内容取ってこれなかったらデフォルトということにする
            resolve(response && response.data ? response.data : {});
        };
        window.chrome.runtime.sendMessage(request, callback);
    }).then(function (data) {
        var newOptions = {};
        // ここで全部埋めるので newOptions は Options になる
        OPTION_KEYS.forEach(function (key) {
            newOptions[key] = data[key] || isTrue;
        });
        // console.log('get options (then): ', newOptions); // debug
        return newOptions;
    });
};
/** Originalボタンおく */
var setOriginalButton = function (options) {
    // 実行の間隔(ms)
    var INTERVAL = 300;
    // ボタン設置クラス
    var buttonSetter = getButtonSetter();
    // ボタンを設置
    var setButton = function (currentOptions) {
        // console.log('setButton: ' + currentOptions['SHOW_ON_TIMELINE'] + ' ' + currentOptions['SHOW_ON_TWEET_DETAIL']) // debug
        buttonSetter.setButtonOnTimeline(currentOptions);
        buttonSetter.setButtonOnTweetDetail(currentOptions);
    };
    var isInterval = false;
    var deferred = false;
    var setButtonWithInterval = function (currentOptions) {
        // 短時間に何回も実行しないようインターバルを設ける
        if (isInterval) {
            deferred = true;
            return;
        }
        isInterval = true;
        setTimeout(function () {
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
    var observer = new MutationObserver(function () { return setButtonWithInterval(options); });
    var target = document.querySelector('body');
    var config = { childList: true, subtree: true };
    observer.observe(target, config);
    // 設定反映のためのリスナー設置
    // これ自体がChrome拡張機能のときだけ設置する
    // (Chrome拡張機能でないときは設定反映できる機構ないので)
    if (isNativeChromeExtension()) {
        window.chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
            // Unchecked runtime.lastError みたいなエラーが出ることがあるので,
            // ひとまず console.log で出すようにしてみている
            if (window.chrome.runtime.lastError !== undefined) {
                // eslint-disable-next-line no-console
                console.log(window.chrome.runtime.lastError);
            }
            if (request.method === OPTION_UPDATED) {
                updateOptions().then(function (options) {
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
var fixFileNameOnSaveCommand = function (options) {
    // キーを押したとき
    document.addEventListener('keydown', function (e) {
        // 設定が有効なら
        if (options[STRIP_IMAGE_SUFFIX] !== 'isfalse') {
            downloadImage(e);
        }
    });
};
/**
 * メインの処理
 * 設定を取得できたらそれに沿ってやっていく
 */
updateOptions().then(function (options) {
    if (isTwitter() || isTweetdeck()) {
        /** 公式Web/TweetDeck */
        setOriginalButton(options);
    }
    else if (isImageTab()) {
        /** 画像ページ(https://pbs.twimg.com/*) */
        fixFileNameOnSaveCommand(options);
    }
});
