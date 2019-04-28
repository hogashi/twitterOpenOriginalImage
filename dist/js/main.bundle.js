/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 定数
Object.defineProperty(exports, "__esModule", { value: true });
// 設定取得メッセージ
exports.OPTION_UPDATED = 'OPTION_UPDATED';
exports.GET_LOCAL_STORAGE = 'GET_LOCAL_STORAGE';
// 公式Web
exports.HOST_TWITTER_COM = 'twitter.com';
exports.OPEN_WITH_KEY_PRESS = 'OPEN_WITH_KEY_PRESS';
exports.SHOW_ON_TIMELINE = 'SHOW_ON_TIMELINE';
exports.SHOW_ON_TWEET_DETAIL = 'SHOW_ON_TWEET_DETAIL';
// TweetDeck
exports.HOST_TWEETDECK_TWITTER_COM = 'tweetdeck.twitter.com';
exports.SHOW_ON_TWEETDECK_TIMELINE = 'SHOW_ON_TWEETDECK_TIMELINE';
exports.SHOW_ON_TWEETDECK_TWEET_DETAIL = 'SHOW_ON_TWEETDECK_TWEET_DETAIL';
// 画像ページ
exports.STRIP_IMAGE_SUFFIX = 'STRIP_IMAGE_SUFFIX';
// 設定
// 設定に使う真偽値
exports.isTrue = 'istrue';
exports.isFalse = 'isfalse';
exports.INITIAL_OPTIONS = {
    // 公式Web
    OPEN_WITH_KEY_PRESS: exports.isFalse,
    SHOW_ON_TIMELINE: exports.isFalse,
    SHOW_ON_TWEET_DETAIL: exports.isFalse,
    // TweetDeck
    SHOW_ON_TWEETDECK_TIMELINE: exports.isFalse,
    SHOW_ON_TWEETDECK_TWEET_DETAIL: exports.isFalse,
    // 画像ページ
    STRIP_IMAGE_SUFFIX: exports.isFalse,
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = __webpack_require__(0);
// エラーメッセージの表示(予期せぬ状況の確認)
exports.printException = (tooiException) => {
    console.log('tooi: ' + tooiException + ' at: ' + window.location.href);
};
// 画像URLを https～?format=〜&name=orig に揃える
exports.formatUrl = (imgUrl) => {
    if (!imgUrl) {
        return null;
    }
    if (!/https:\/\/pbs\.twimg\.com\/media/.test(imgUrl)) {
        // twitterの画像URLでないときそのまま返す
        return imgUrl;
    }
    const url = new URL(imgUrl);
    const searchSet = {
        format: 'jpg',
    };
    url.search
        .slice(1)
        .split('&')
        .forEach(set => {
        const [key, value] = set.split('=');
        searchSet[key] = value;
    });
    const matched = url.pathname.match(/^(.*?)(?:|\.([^.:]+))(?:|:[a-z]+)$/);
    const pathname = matched[1];
    const extension = matched[2];
    // 2.1.11時点ではクエリパラメータを使うのはTweetDeckのみ
    // TweetDeckのURLでは拡張子を優先する
    // ref: https://hogashi.hatenablog.com/entry/2018/08/15/042044
    return `${url.protocol}//${url.host}${pathname}?format=${extension || searchSet.format}&name=orig`;
};
// 画像を開く
exports.openImages = (imgSrcs) => {
    Array.from(imgSrcs)
        .reverse() // 逆順に開くことで右側のタブから読める
        .forEach((imgSrc) => {
        // if 画像URLが取得できたなら
        const url = exports.formatUrl(imgSrc);
        if (url) {
            window.open(url);
        }
        else {
            exports.printException('no image url');
        }
    });
};
// 設定項目更新
exports.updateOptions = (options) => {
    console.log('update options: ', options); // debug
    return Promise.all(Object.keys(options).map(key => new Promise((resolve, reject) => {
        const request = {
            method: Constants_1.GET_LOCAL_STORAGE,
            key,
        };
        const callback = (response) => {
            if (response && response.data) {
                options[key] = response.data;
                resolve();
            }
            else {
                reject();
            }
        };
        chrome.runtime.sendMessage(request, callback);
    }))).then(() => {
        console.log('update options: ', options); // debug
    });
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(3);
const ReactDOM = __webpack_require__(4);
const Utils_1 = __webpack_require__(1);
// twitter.comでボタンを設置するクラス
class ButtonSetter {
    // タイムラインにボタン表示
    setButtonOnTimeline() {
        const tweets = document.getElementsByClassName('js-stream-tweet');
        if (!tweets.length) {
            return;
        }
        // 各ツイートに対して
        Array.from(tweets).forEach(tweet => {
            // if 画像ツイート
            // かつ まだ処理を行っていないなら
            if (!!tweet.getElementsByClassName('AdaptiveMedia-container')[0] &&
                !!tweet
                    .getElementsByClassName('AdaptiveMedia-container')[0]
                    .getElementsByTagName('img')[0] &&
                !tweet.getElementsByClassName('tooiDivTimeline')[0]) {
                // 操作ボタンの外側は様式にあわせる
                const actionList = tweet.getElementsByClassName('ProfileTweet-actionList')[0];
                // 画像の親が取得できたら
                const mediaContainer = tweet.getElementsByClassName('AdaptiveMedia-container')[0];
                if (mediaContainer) {
                    const imgSrcs = Array.from(mediaContainer.getElementsByClassName('AdaptiveMedia-photoContainer')).map(element => element.getElementsByTagName('img')[0].src);
                    if (imgSrcs.length) {
                        this.setButton({
                            imgSrcs,
                            target: actionList,
                        });
                    }
                    else {
                        Utils_1.printException('no image urls on timeline');
                    }
                }
                else {
                    Utils_1.printException('no image container on timeline');
                }
            }
        });
    }
    // ツイート詳細にボタン表示
    setButtonOnTweetDetail() {
        if (!document.getElementsByClassName('permalink-tweet-container')[0] ||
            !document
                .getElementsByClassName('permalink-tweet-container')[0]
                .getElementsByClassName('AdaptiveMedia-photoContainer')[0] ||
            document.getElementById('tooiInputDetailpage')) {
            // ツイート詳細ページでない、または、メインツイートが画像ツイートでないとき
            // または、すでに処理を行ってあるとき
            // 何もしない
            return;
        }
        // Originalボタンの親の親となる枠
        const actionList = document
            .getElementsByClassName('permalink-tweet-container')[0]
            .getElementsByClassName('ProfileTweet-actionList')[0];
        // .AdaptiveMedia-photoContainer: 画像のエレメントからURLを取得する
        const imgSrcs = Array.from(document.getElementsByClassName('permalink-tweet-container')[0].getElementsByClassName('AdaptiveMedia-photoContainer')).map(element => element.getElementsByTagName('img')[0].src);
        if (imgSrcs.length) {
            this.setButton({
                imgSrcs,
                target: actionList,
            });
        }
        else {
            Utils_1.printException('no image urls on tweet detail');
        }
    }
    onClick(e, imgSrcs) {
        // イベント(MouseEvent)による既定の動作をキャンセル
        e.preventDefault();
        // イベント(MouseEvent)の親要素への伝播を停止
        e.stopPropagation();
        Utils_1.openImages(imgSrcs);
    }
    setButton({ imgSrcs, target }) {
        const style = {
            width: '70px',
            fontSize: '13px',
            color: this.getActionButtonColor(),
        };
        ReactDOM.render(React.createElement("div", { className: 'ProfileTweet-action tooi-button-container' },
            React.createElement("input", { className: 'tooi-button', style: style, type: 'button', value: 'Original', onClick: (e) => {
                    this.onClick(e, imgSrcs);
                } })), target);
    }
    getActionButtonColor() {
        // コントラスト比4.5(chromeの推奨する最低ライン)の色
        const contrastLimitColor = '#697b8c';
        const actionButton = document.querySelector('.ProfileTweet-actionButton');
        if (!(actionButton && actionButton.style)) {
            return contrastLimitColor;
        }
        const buttonColor = window.getComputedStyle(actionButton).color;
        if (buttonColor && buttonColor.length > 0) {
            return buttonColor;
        }
        return contrastLimitColor;
    }
}
exports.default = ButtonSetter;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ButtonSetters_1 = __webpack_require__(6);
const Constants_1 = __webpack_require__(0);
const Utils_1 = __webpack_require__(1);
// 設定
const options = Constants_1.INITIAL_OPTIONS;
// ボタン設置クラス
const hostname = new URL(window.location.href).hostname;
const buttonSetters = ButtonSetters_1.default[hostname];
// ボタンを設置
const setButton = () => {
    // console.log('setButton: ' + options['SHOW_ON_TIMELINE'] + ' ' + options['SHOW_ON_TWEET_DETAIL'] + ' ' + options['OPEN_WITH_KEY_PRESS']) // debug
    // if タイムラインにボタン表示する設定がされていたら
    if (options[Constants_1.SHOW_ON_TIMELINE] !== 'isfalse') {
        buttonSetters.setButtonOnTimeline();
    }
    // if ツイート詳細にボタン表示する設定がされていたら
    if (options[Constants_1.SHOW_ON_TWEET_DETAIL] !== 'isfalse') {
        buttonSetters.setButtonOnTweetDetail();
    }
};
// ページ全体でDOMの変更を検知し都度ボタン設置
const observer = new MutationObserver(setButton);
const target = document.querySelector('body');
const config = { childList: true, subtree: true };
// ページ全体でDOMの変更を検知し都度ボタン設置
observer.observe(target, config);
// 設定読み込み
Utils_1.updateOptions(options).then(() => {
    // ボタンを(再)設置
    setButton();
});
// 設定反映のためのリスナー設置
chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
    if (request.method === Constants_1.OPTION_UPDATED) {
        Utils_1.updateOptions(options).then(() => {
            // ボタンを(再)設置
            setButton();
            sendResponse({ data: 'done' });
        });
        return;
    }
    sendResponse({ data: 'yet' });
});


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ButtonSetter_1 = __webpack_require__(2);
const ButtonSetterTweetDeck_1 = __webpack_require__(7);
const Constants = __webpack_require__(0);
// ボタンを設置するクラスのまとめ
const ButtonSetters = {};
exports.default = ButtonSetters;
ButtonSetters[Constants.HOST_TWITTER_COM] = new ButtonSetter_1.default;
ButtonSetters[Constants.HOST_TWEETDECK_TWITTER_COM] = new ButtonSetterTweetDeck_1.default;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(3);
const ReactDOM = __webpack_require__(4);
const ButtonSetter_1 = __webpack_require__(2);
const Utils_1 = __webpack_require__(1);
// tweetdeck.twitter.comでボタンを設置するクラス
class ButtonSetterTweetDeck extends ButtonSetter_1.default {
    // タイムラインにボタン表示
    setButtonOnTimeline() {
        // if タイムラインのツイートを取得できたら
        // is-actionable: タイムラインのみ
        const tweets = document.getElementsByClassName('js-stream-item is-actionable');
        if (!tweets.length) {
            return;
        }
        // 各ツイートに対して
        Array.from(tweets).forEach(tweet => {
            if (!tweet.getElementsByClassName('js-media-image-link').length ||
                tweet.getElementsByClassName('is-video').length ||
                tweet.getElementsByClassName('is-gif').length ||
                tweet.getElementsByClassName('tooi-a').length) {
                // メディアツイートでない
                // または メディアが画像でない(動画/GIF)
                // または すでにボタンをおいてあるとき
                // 何もしない
                return;
            }
            const target = tweet.getElementsByTagName('footer')[0];
            if (tweet.getElementsByClassName('js-media')) {
                const imgSrcs = Array.from(tweet.getElementsByClassName('js-media-image-link')).map(element => this.getBackgroundImageUrl(element));
                if (imgSrcs.length) {
                    this.setButton({
                        imgSrcs,
                        target,
                    });
                }
                else {
                    Utils_1.printException('no image srcs on tweetdeck timeline');
                }
            }
            else {
                Utils_1.printException('no image elements on tweetdeck timeline');
            }
        });
    }
    // ツイート詳細にボタン表示
    setButtonOnTweetDetail() {
        // console.log('TODO, ボタン実装') // TODO, debug
        // if タイムラインのツイートを取得できたら
        // is-actionable: タイムラインのみ
        const tweets = document.getElementsByClassName('js-tweet-detail');
        if (!tweets.length) {
            return;
        }
        // 各ツイートに対して
        Array.from(tweets).forEach(tweet => {
            if ((!tweet.getElementsByClassName('media-img').length &&
                !tweet.getElementsByClassName('media-image').length) ||
                tweet.getElementsByClassName('tooi-a').length) {
                // メディアツイートでない (画像のタグが取得できない)
                // または すでにボタンをおいてあるとき
                // 何もしない
                return;
            }
            const target = tweet.getElementsByTagName('footer')[0];
            // 画像エレメントがなかったら終了
            if (tweet.getElementsByClassName('js-media-image-link').length === 0) {
                Utils_1.printException('no image elements on tweetdeck tweet detail');
                return;
            }
            let imgSrcs;
            if (tweet.getElementsByClassName('media-img').length !== 0) {
                imgSrcs = [tweet.getElementsByClassName('media-img')[0].src];
            }
            else {
                imgSrcs = Array.from(tweet.getElementsByClassName('js-media-image-link')).map(element => this.getBackgroundImageUrl(element));
            }
            this.setButton({
                imgSrcs,
                target,
            });
        });
    }
    setButton({ imgSrcs, target }) {
        // tweetdeckのツイート右上の時刻などに使われているclassを使う
        // 設置の有無の判別用に'tooi-a'を付与する
        const className = 'pull-left margin-txs txt-mute tooi-a';
        // 枠線の色は'Original'と同じく'.txt-mute'の色を使うので取得する
        const borderColor = window.getComputedStyle(document.querySelector('.txt-mute')).color;
        // ボタンのスタイル設定
        const style = {
            border: `1px solid ${borderColor}`,
            borderRadius: '2px',
            display: 'inline-block',
            fontSize: '0.75em',
            marginTop: '5px',
            padding: '1px 1px 0',
            lineHeight: '1.5em',
        };
        // ボタンを設置
        ReactDOM.render(React.createElement("a", { className: className, style: style, onClick: (e) => {
                this.onClick(e, imgSrcs);
            } }, "Original"), target);
    }
    getBackgroundImageUrl(element) {
        return element.style.backgroundImage.replace(/url\("([^"]*)"\)/, '$1');
    }
}
exports.default = ButtonSetterTweetDeck;


/***/ })
/******/ ]);