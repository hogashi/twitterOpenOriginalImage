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
/******/ 	return __webpack_require__(__webpack_require__.s = 29);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return OPTION_UPDATED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GET_LOCAL_STORAGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return HOST_TWITTER_COM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return SHOW_ON_TIMELINE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return SHOW_ON_TWEET_DETAIL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return HOST_TWEETDECK_TWITTER_COM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return SHOW_ON_TWEETDECK_TIMELINE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return SHOW_ON_TWEETDECK_TWEET_DETAIL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return HOST_PBS_TWIMG_COM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return STRIP_IMAGE_SUFFIX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return isTrue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return isFalse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return INITIAL_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return OPTIONS_TEXT; });
// 定数
// 設定取得メッセージ
const OPTION_UPDATED = 'OPTION_UPDATED';
const GET_LOCAL_STORAGE = 'GET_LOCAL_STORAGE'; // 公式Web

const HOST_TWITTER_COM = 'twitter.com';
const SHOW_ON_TIMELINE = 'SHOW_ON_TIMELINE';
const SHOW_ON_TWEET_DETAIL = 'SHOW_ON_TWEET_DETAIL'; // TweetDeck

const HOST_TWEETDECK_TWITTER_COM = 'tweetdeck.twitter.com';
const SHOW_ON_TWEETDECK_TIMELINE = 'SHOW_ON_TWEETDECK_TIMELINE';
const SHOW_ON_TWEETDECK_TWEET_DETAIL = 'SHOW_ON_TWEETDECK_TWEET_DETAIL'; // 画像ページ

const HOST_PBS_TWIMG_COM = 'pbs.twimg.com';
const STRIP_IMAGE_SUFFIX = 'STRIP_IMAGE_SUFFIX'; // 設定
// 設定に使う真偽値

const isTrue = 'istrue';
const isFalse = 'isfalse';
const INITIAL_OPTIONS = {
  // 公式Web
  SHOW_ON_TIMELINE: isFalse,
  SHOW_ON_TWEET_DETAIL: isFalse,
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: isFalse,
  SHOW_ON_TWEETDECK_TWEET_DETAIL: isFalse,
  // 画像ページ
  STRIP_IMAGE_SUFFIX: isFalse
};
const OPTIONS_TEXT = {
  // 公式Web
  SHOW_ON_TIMELINE: 'タイムラインにボタンを表示',
  SHOW_ON_TWEET_DETAIL: 'ツイート詳細にボタンを表示',
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: 'タイムラインにボタンを表示',
  SHOW_ON_TWEETDECK_TWEET_DETAIL: 'ツイート詳細にボタンを表示',
  // 画像ページ
  STRIP_IMAGE_SUFFIX: '[Ctrl]+[s]で拡張子を校正'
};

/***/ }),

/***/ 29:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./src/helpers/Constants.ts
var Constants = __webpack_require__(0);

// EXTERNAL MODULE: ./src/helpers/Utils.ts
var Utils = __webpack_require__(3);

// CONCATENATED MODULE: ./src/helpers/ButtonSetter.ts
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }


 // twitter.comでボタンを設置するクラス

class ButtonSetter_ButtonSetter {
  // タイムラインにボタン表示
  setButtonOnTimeline(options) {
    if (document.querySelector('#react-root')) {
      this._setButtonOnReactLayoutTimeline(options);

      return;
    }

    this._setButtonOnTimeline(options);
  } // ツイート詳細にボタン表示


  setButtonOnTweetDetail(options) {
    // TODO: Reactレイアウトでも実装する必要がある？
    this._setButtonOnTweetDetail(options);
  }

  onClick(e, imgSrcs) {
    // イベント(MouseEvent)による既定の動作をキャンセル
    e.preventDefault(); // イベント(MouseEvent)の親要素への伝播を停止

    e.stopPropagation();
    Object(Utils["c" /* openImages */])(imgSrcs);
  }
  /**
   * エレメントにスタイル当てる
   * @param {HTMLElement} element スタイル当てる対象エレメント
   * @param {Object} propertySet プロパティ名('font-size')と値('10px')のオブジェクト
   */


  setStyle(element, propertySet) {
    Object.entries(propertySet).forEach((_ref) => {
      let _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      return element.style.setProperty(key, value);
    });
  }

  setButton(_ref3) {
    let className = _ref3.className,
        getImgSrcs = _ref3.getImgSrcs,
        target = _ref3.target;
    const style = {
      width: '70px',
      'font-size': '13px',
      color: this.getActionButtonColor()
    }; // <div className='ProfileTweet-action tooi-button-container'>
    //   <input
    //     className='tooi-button'
    //     style={style}
    //     type='button'
    //     value='Original'
    //     onClick={(e) => {
    //       this.onClick(e, imgSrcs);
    //     }}
    //   />
    // </div>

    const button = document.createElement('input');
    button.className = 'tooi-button';
    this.setStyle(button, style);
    button.type = 'button';
    button.value = 'Original';
    button.addEventListener('click', e => {
      this.onClick(e, getImgSrcs());
    });
    const container = document.createElement('div');
    container.classList.add('ProfileTweet-action', className);
    target.appendChild(container);
    container.appendChild(button);
  }

  setReactLayoutButton(_ref4) {
    let className = _ref4.className,
        getImgSrcs = _ref4.getImgSrcs,
        target = _ref4.target;

    if (!target) {
      Object(Utils["d" /* printException */])('no target');
      return;
    }

    const button = document.createElement('input');
    button.type = 'button';
    button.value = 'Original';
    const color = this.getReactLayoutActionButtonColor();
    this.setStyle(button, {
      'font-size': '13px',
      padding: '4px 8px',
      color,
      'background-color': 'rgba(0, 0, 0, 0)',
      border: "1px solid ".concat(color),
      'border-radius': '3px',
      cursor: 'pointer'
    });
    button.addEventListener('click', e => {
      this.onClick(e, getImgSrcs());
    });
    const container = document.createElement('div'); // container.id = '' + tweet.id

    container.classList.add(className);
    this.setStyle(container, {
      display: 'flex',
      'flex-flow': 'column',
      'justify-content': 'center'
    });
    target.appendChild(container);
    container.appendChild(button);
  }

  _setButtonOnTimeline(options) {
    // タイムラインにボタン表示する設定がされているときだけ実行する
    // - isTrue か 設定なし のとき ON
    if (!(options[Constants["h" /* SHOW_ON_TIMELINE */]] !== Constants["m" /* isFalse */])) {
      return;
    }

    const tweets = document.getElementsByClassName('js-stream-tweet');

    if (!tweets.length) {
      return;
    }

    const className = 'tooi-button-container-timeline'; // 各ツイートに対して

    Array.from(tweets).forEach(tweet => {
      // 画像ツイートかつまだ処理を行っていないときのみ行う
      if (!(tweet.getElementsByClassName('AdaptiveMedia-container').length !== 0 && tweet.getElementsByClassName('AdaptiveMedia-container')[0].getElementsByTagName('img').length !== 0) || tweet.getElementsByClassName(className).length !== 0) {
        return;
      } // 操作ボタンの外側は様式にあわせる


      const actionList = tweet.getElementsByClassName('ProfileTweet-actionList')[0]; // 画像の親が取得できたら

      const mediaContainer = tweet.getElementsByClassName('AdaptiveMedia-container')[0];

      if (mediaContainer) {
        const getImgSrcs = () => Array.from(mediaContainer.getElementsByClassName('AdaptiveMedia-photoContainer')).map(element => element.getElementsByTagName('img')[0].src);

        this.setButton({
          className,
          getImgSrcs,
          target: actionList
        });
      }
    });
  }

  _setButtonOnTweetDetail(options) {
    // ツイート詳細にボタン表示する設定がされているときだけ実行する
    // - isTrue か 設定なし のとき ON
    if (!(options[Constants["k" /* SHOW_ON_TWEET_DETAIL */]] !== Constants["m" /* isFalse */])) {
      return;
    }

    const className = 'tooi-button-container-detail';

    if (!document.getElementsByClassName('permalink-tweet-container')[0] || !document.getElementsByClassName('permalink-tweet-container')[0].getElementsByClassName('AdaptiveMedia-photoContainer')[0] || document.getElementsByClassName(className).length !== 0) {
      // ツイート詳細ページでない、または、メインツイートが画像ツイートでないとき
      // または、すでに処理を行ってあるとき
      // 何もしない
      return;
    } // Originalボタンの親の親となる枠


    const actionList = document.getElementsByClassName('permalink-tweet-container')[0].getElementsByClassName('ProfileTweet-actionList')[0]; // .AdaptiveMedia-photoContainer: 画像のエレメントからURLを取得する

    const getImgSrcs = () => Array.from(document.getElementsByClassName('permalink-tweet-container')[0].getElementsByClassName('AdaptiveMedia-photoContainer')).map(element => element.getElementsByTagName('img')[0].src);

    this.setButton({
      className,
      getImgSrcs,
      target: actionList
    });
  }

  _setButtonOnReactLayoutTimeline(options) {
    // ツイート詳細にボタン表示する設定がされているときだけ実行する
    // - isTrue か 設定なし のとき ON
    if (!(options[Constants["h" /* SHOW_ON_TIMELINE */]] !== Constants["m" /* isFalse */])) {
      return;
    }

    const className = 'tooi-button-container-react-timeline';
    const tweets = Array.from(document.querySelectorAll('#react-root main section article'));

    if (!tweets.length) {
      return;
    } // 各ツイートに対して


    tweets.forEach(tweet => {
      // 画像ツイート かつ まだ処理を行っていないときのみ実行
      const tweetATags = Array.from(tweet.querySelectorAll('a')).filter(aTag => /\/status\/[0-9]+\/photo\//.test(aTag.href));

      if (tweetATags.length === 0 || tweet.getElementsByClassName(className)[0]) {
        return;
      } // ボタンを設置
      // 操作ボタンの外側は様式にあわせる


      const target = tweet.querySelector('div[role="group"]');

      const getImgSrcs = () => {
        const tweetImgs = tweetATags.map(aTag => aTag.querySelector('img')); // 画像エレメントが取得できなかったら終了

        if (tweetImgs.length === 0) {
          Object(Utils["d" /* printException */])('no image elements on timeline in react layout');
          return [];
        }

        if (tweetImgs.length === 4) {
          // 4枚のとき2枚目と3枚目のDOMの順序が前後するので直す
          const tweetimgTmp = tweetImgs[1];
          tweetImgs[1] = tweetImgs[2];
          tweetImgs[2] = tweetimgTmp;
        }

        return tweetImgs.map(img => img && img.src);
      };

      this.setReactLayoutButton({
        className,
        getImgSrcs,
        target
      });
    });
  } // openFromTimeline end


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

  getReactLayoutActionButtonColor() {
    // 文字色
    // 初期値: コントラスト比4.5(chromeの推奨する最低ライン)の色
    let color = '#697b8c'; // ツイートアクション(返信とか)のボタンのクラス(夜間モードか否かでクラス名が違う)

    const actionButton = document.querySelector('.rn-1re7ezh') || document.querySelector('.rn-111h2gw');

    if (actionButton && actionButton.style) {
      const buttonColor = window.getComputedStyle(actionButton).color;

      if (buttonColor && buttonColor.length > 0) {
        color = buttonColor;
      }
    }

    return color;
  }

}
// CONCATENATED MODULE: ./src/helpers/ButtonSetterTweetDeck.ts


 // tweetdeck.twitter.comでボタンを設置するクラス

class ButtonSetterTweetDeck_ButtonSetterTweetDeck extends ButtonSetter_ButtonSetter {
  // タイムラインにボタン表示
  setButtonOnTimeline(options) {
    // タイムラインにボタン表示する設定がされているときだけ実行する
    // - isTrue か 設定なし のとき ON
    if (!(options[Constants["i" /* SHOW_ON_TWEETDECK_TIMELINE */]] !== Constants["m" /* isFalse */])) {
      return;
    } // if タイムラインのツイートを取得できたら
    // is-actionable: タイムラインのみ


    const tweets = document.getElementsByClassName('js-stream-item is-actionable');

    if (!tweets.length) {
      return;
    }

    const className = 'tooi-button-container-tweetdeck-timeline'; // 各ツイートに対して

    Array.from(tweets).forEach(tweet => {
      if (!tweet.getElementsByClassName('js-media-image-link').length || tweet.getElementsByClassName('is-video').length || tweet.getElementsByClassName('is-gif').length || tweet.getElementsByClassName(className).length) {
        // メディアツイートでない
        // または メディアが画像でない(動画/GIF)
        // または すでにボタンをおいてあるとき
        // 何もしない
        return;
      }

      const target = tweet.getElementsByTagName('footer')[0];

      if (tweet.getElementsByClassName('js-media')) {
        const getImgSrcs = () => {
          return Array.from(tweet.getElementsByClassName('js-media-image-link')).map(element => this.getBackgroundImageUrl(element));
        };

        this.setButton({
          className,
          getImgSrcs,
          target
        });
      } else {
        Object(Utils["d" /* printException */])('no image elements on tweetdeck timeline');
      }
    });
  } // ツイート詳細にボタン表示


  setButtonOnTweetDetail(options) {
    // ツイート詳細にボタン表示する設定がされているときだけ実行する
    // - isTrue か 設定なし のとき ON
    if (!(options[Constants["j" /* SHOW_ON_TWEETDECK_TWEET_DETAIL */]] !== Constants["m" /* isFalse */])) {
      return;
    } // console.log('TODO, ボタン実装') // TODO, debug
    // if タイムラインのツイートを取得できたら
    // is-actionable: タイムラインのみ


    const tweets = document.getElementsByClassName('js-tweet-detail');

    if (!tweets.length) {
      return;
    }

    const className = 'tooi-button-container-tweetdeck-detail'; // 各ツイートに対して

    Array.from(tweets).forEach(tweet => {
      if (!tweet.getElementsByClassName('media-img').length && !tweet.getElementsByClassName('media-image').length || tweet.getElementsByClassName(className).length) {
        // メディアツイートでない (画像のタグが取得できない)
        // または すでにボタンをおいてあるとき
        // 何もしない
        return;
      }

      const target = tweet.getElementsByTagName('footer')[0]; // 画像エレメントがなかったら終了

      if (tweet.getElementsByClassName('js-media-image-link').length === 0) {
        Object(Utils["d" /* printException */])('no image elements on tweetdeck tweet detail');
        return;
      }

      const getImgSrcs = () => {
        if (tweet.getElementsByClassName('media-img').length !== 0) {
          return [tweet.getElementsByClassName('media-img')[0].src];
        } else {
          return Array.from(tweet.getElementsByClassName('js-media-image-link')).map(element => this.getBackgroundImageUrl(element));
        }
      };

      this.setButton({
        className,
        getImgSrcs,
        target
      });
    });
  }

  setButton(_ref) {
    let className = _ref.className,
        getImgSrcs = _ref.getImgSrcs,
        target = _ref.target;

    if (!target) {
      Object(Utils["d" /* printException */])('no target');
      return;
    } // 枠線の色は'Original'と同じく'.txt-mute'の色を使うので取得する


    const txtMute = document.querySelector('.txt-mute');
    const borderColor = txtMute ? window.getComputedStyle(txtMute).color : '#697b8c'; // ボタンのスタイル設定

    const style = {
      border: "1px solid ".concat(borderColor),
      'border-radius': '2px',
      display: 'inline-block',
      'font-size': '0.75em',
      'margin-top': '5px',
      padding: '1px 1px 0',
      'line-height': '1.5em',
      cursor: 'pointer'
    }; // <a
    //   className={className}
    //   style={style}
    //   onClick={(e) => {
    //     this.onClick(e, imgSrcs);
    //   }}
    // >
    //   Original
    // </a>
    // tweetdeckのツイート右上の時刻などに使われているclassを使う
    // 設置の有無の判別用にclassNameを付与する

    const button = document.createElement('a');
    button.className = "pull-left margin-txs txt-mute ".concat(className);
    this.setStyle(button, style);
    button.addEventListener('click', e => {
      this.onClick(e, getImgSrcs());
    });
    button.insertAdjacentText('beforeend', 'Original');
    target.appendChild(button);
  }

  getBackgroundImageUrl(element) {
    if (element.style && element.style.backgroundImage) {
      return element.style.backgroundImage.replace(/url\("([^"]*)"\)/, '$1');
    }

    return null;
  }

}
// CONCATENATED MODULE: ./src/helpers/ButtonSetters.ts



// ボタンを設置するクラスのまとめ
const ButtonSetters = {};
ButtonSetters[Constants["d" /* HOST_TWITTER_COM */]] = new ButtonSetter_ButtonSetter();
ButtonSetters[Constants["c" /* HOST_TWEETDECK_TWITTER_COM */]] = new ButtonSetterTweetDeck_ButtonSetterTweetDeck();
/* harmony default export */ var helpers_ButtonSetters = (ButtonSetters);
// CONCATENATED MODULE: ./src/main.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setButton", function() { return setButton; });
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



 // 設定

let main_options = _objectSpread({}, Constants["e" /* INITIAL_OPTIONS */]); // ボタンを設置


const setButton = _options => {
  // console.log('setButton');
  // ボタン設置クラス
  const hostname = new URL(window.location.href).hostname;
  const buttonSetters = helpers_ButtonSetters[hostname]; // console.log('setButton: ' + _options['SHOW_ON_TIMELINE'] + ' ' + _options['SHOW_ON_TWEET_DETAIL'] + ' ' + _options['OPEN_WITH_KEY_PRESS']) // debug

  buttonSetters.setButtonOnTimeline(_options);
  buttonSetters.setButtonOnTweetDetail(_options);
};
let isInterval = false;
let deferred = false;

const setButtonWithInterval = () => {
  // 短時間に何回も実行しないようインターバルを設ける
  if (isInterval) {
    deferred = true;
    return;
  }

  isInterval = true;
  setTimeout(() => {
    isInterval = false;

    if (deferred) {
      setButton(main_options);
      deferred = false;
    }
  }, 300);
  setButton(main_options);
}; // ページ全体でDOMの変更を検知し都度ボタン設置


const observer = new MutationObserver(setButtonWithInterval);
const main_target = document.querySelector('body');
const config = {
  childList: true,
  subtree: true
};
observer.observe(main_target, config); // 設定読み込み

Object(Utils["b" /* getOptions */])().then(newOptions => {
  Object.keys(newOptions).forEach(key => {
    main_options[key] = newOptions[key];
  }); // ボタンを(再)設置

  setButtonWithInterval();
}); // 設定反映のためのリスナー設置

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  console.log(chrome.runtime.lastError);

  if (request.method === Constants["g" /* OPTION_UPDATED */]) {
    Object(Utils["b" /* getOptions */])().then(newOptions => {
      Object.keys(newOptions).forEach(key => {
        main_options[key] = newOptions[key];
      }); // ボタンを(再)設置

      setButtonWithInterval();
      sendResponse({
        data: 'done'
      });
    });
    return true;
  }

  sendResponse({
    data: 'yet'
  });
  return true;
});

/***/ }),

/***/ 3:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return printException; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return collectUrlParams; });
/* unused harmony export formatUrl */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return openImages; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getOptions; });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }


// エラーメッセージの表示(予期せぬ状況の確認)
const printException = tooiException => {
  console.log('tooi: ' + tooiException + ' at: ' + window.location.href);
}; // 画像urlの要素を集める

const collectUrlParams = rawUrl => {
  if (!/https:\/\/pbs\.twimg\.com\/media/.test(rawUrl)) {
    // twitterの画像URLでないときnull
    return null;
  }

  const url = new URL(rawUrl);
  const searchSet = {
    format: 'jpg',
    // 拡張子が無い場合はjpgにフォールバック
    name: null // 大きさ指定がない場合はnull

  };
  url.search.slice(1).split('&').forEach(set => {
    const _set$split = set.split('='),
          _set$split2 = _slicedToArray(_set$split, 2),
          key = _set$split2[0],
          value = _set$split2[1];

    if (key === 'format' || key === 'name') {
      searchSet[key] = value;
    }
  }); // 空文字でもどんな文字列でもマッチする正規表現なのでnon-null

  const matched = url.pathname.match(/^(.*?)(?:|\.([^.:]+))(?:|:([a-z]+))$/); // どんな文字列でも空文字は最低入るのでnon-null

  const pathnameWithoutExtension = matched[1]; // 拡張子はないかもしれないのでundefinedも示しておく

  const extension = matched[2]; // コロンを使う大きさ指定はないかもしれないのでなかったらnull

  const legacyName = matched[3] || null;
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
}; // 画像URLを https～?format=〜&name=orig に揃える

const formatUrl = imgUrl => {
  if (!imgUrl || imgUrl.length === 0) {
    return null;
  }

  const params = collectUrlParams(imgUrl);

  if (!params) {
    // twitterの画像URLでないときそのまま返す
    return imgUrl;
  }

  const protocol = params.protocol,
        host = params.host,
        pathname = params.pathname,
        format = params.format;
  return "".concat(protocol, "//").concat(host).concat(pathname, "?format=").concat(format, "&name=orig");
}; // 画像を開く

const openImages = imgSrcs => {
  if (imgSrcs.length === 0) {
    printException('zero image urls');
    return;
  }

  Array.from(imgSrcs).reverse() // 逆順に開くことで右側のタブから読める
  .forEach(imgSrc => {
    // if 画像URLが取得できたなら
    const url = formatUrl(imgSrc);

    if (url) {
      window.open(url);
    } else {
      printException('no image url');
    }
  });
}; // 設定項目更新

const getOptions = () => {
  console.log('update options'); // debug

  return new Promise((resolve, reject) => {
    const request = {
      method: _Constants__WEBPACK_IMPORTED_MODULE_0__[/* GET_LOCAL_STORAGE */ "a"]
    };

    const callback = response => {
      if (response.data) {
        resolve(response.data);
      } else {
        reject();
      }
    };

    chrome.runtime.sendMessage(request, callback);
  }).then(data => {
    const options = {};
    Object.keys(_Constants__WEBPACK_IMPORTED_MODULE_0__[/* INITIAL_OPTIONS */ "e"]).map(key => {
      options[key] = data[key] || _Constants__WEBPACK_IMPORTED_MODULE_0__[/* isTrue */ "n"];
    });
    console.log('update options: ', options); // debug

    return options;
  });
};

/***/ })

/******/ });