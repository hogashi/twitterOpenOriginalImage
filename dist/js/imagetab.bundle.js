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
/******/ 	return __webpack_require__(__webpack_require__.s = 28);
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

/***/ 28:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "downloadImage", function() { return downloadImage; });
/* harmony import */ var _helpers_Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _helpers_Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* imagetab.ts */
// https://pbs.twimg.com/* で実行される
// twitterの画像を表示したときのC-sを拡張
// 画像のファイル名を「～.jpg-orig」「～.png-orig」ではなく「～-orig.jpg」「～-orig.png」にする



let options = _objectSpread({}, _helpers_Constants__WEBPACK_IMPORTED_MODULE_0__[/* INITIAL_OPTIONS */ "e"]);

const getImageFilenameByUrl = imgUrl => {
  const params = Object(_helpers_Utils__WEBPACK_IMPORTED_MODULE_1__[/* collectUrlParams */ "a"])(imgUrl);

  if (!params) {
    return null;
  }

  const pathname = params.pathname,
        format = params.format,
        name = params.name;
  const basename = pathname.match(/([^/.]*?)(?:\..+)?$/)[1];
  return "".concat(basename).concat(name ? "-".concat(name) : '', ".").concat(format);
};

const downloadImage = e => {
  // if 押されたキーがC-s の状態なら
  // かつ 開いているURLが画像URLの定形なら(pbs.twimg.comを使うものは他にも存在するので)
  if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
    const imageSrc = document.querySelector('img').src;
    const filename = getImageFilenameByUrl(imageSrc);

    if (!filename) {
      return;
    } // もとの挙動(ブラウザが行う保存)をしないよう中止


    e.preventDefault(); // download属性に正しい拡張子の画像名を入れたaタグをつくってクリックする

    const a = document.createElement('a');
    a.href = window.location.href;
    a.setAttribute('download', filename);
    a.dispatchEvent(new MouseEvent('click'));
  }
};
Object(_helpers_Utils__WEBPACK_IMPORTED_MODULE_1__[/* getOptions */ "b"])().then(newOptions => {
  Object.keys(newOptions).forEach(key => {
    options[key] = newOptions[key];
  });
}); // キーを押したとき

document.addEventListener('keydown', e => {
  console.log(options[_helpers_Constants__WEBPACK_IMPORTED_MODULE_0__[/* STRIP_IMAGE_SUFFIX */ "l"]]); // 設定が有効なら

  if (options[_helpers_Constants__WEBPACK_IMPORTED_MODULE_0__[/* STRIP_IMAGE_SUFFIX */ "l"]] !== 'isfalse') {
    downloadImage(e);
  }
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