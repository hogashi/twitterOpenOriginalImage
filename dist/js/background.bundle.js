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
/******/ 	return __webpack_require__(__webpack_require__.s = 67);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return OPTION_UPDATED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GET_LOCAL_STORAGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return HOST_TWITTER_COM; });
/* unused harmony export OPEN_WITH_KEY_PRESS */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return SHOW_ON_TIMELINE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return SHOW_ON_TWEET_DETAIL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return HOST_TWEETDECK_TWITTER_COM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return SHOW_ON_TWEETDECK_TIMELINE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return SHOW_ON_TWEETDECK_TWEET_DETAIL; });
/* unused harmony export STRIP_IMAGE_SUFFIX */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return isTrue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return isFalse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return INITIAL_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return OPTIONS_TEXT; });
// 定数
// 設定取得メッセージ
const OPTION_UPDATED = 'OPTION_UPDATED';
const GET_LOCAL_STORAGE = 'GET_LOCAL_STORAGE'; // 公式Web

const HOST_TWITTER_COM = 'twitter.com';
const OPEN_WITH_KEY_PRESS = 'OPEN_WITH_KEY_PRESS';
const SHOW_ON_TIMELINE = 'SHOW_ON_TIMELINE';
const SHOW_ON_TWEET_DETAIL = 'SHOW_ON_TWEET_DETAIL'; // TweetDeck

const HOST_TWEETDECK_TWITTER_COM = 'tweetdeck.twitter.com';
const SHOW_ON_TWEETDECK_TIMELINE = 'SHOW_ON_TWEETDECK_TIMELINE';
const SHOW_ON_TWEETDECK_TWEET_DETAIL = 'SHOW_ON_TWEETDECK_TWEET_DETAIL'; // 画像ページ

const STRIP_IMAGE_SUFFIX = 'STRIP_IMAGE_SUFFIX'; // 設定
// 設定に使う真偽値

const isTrue = 'istrue';
const isFalse = 'isfalse'; // 設定項目の初期値は「無効」(最初のボタン表示が早過ぎる/一旦表示すると消さないため)
// 有効だった場合はDOMが変更される間に設定が読み込まれて有効になる
// 無効だった場合はそのままボタンは表示されない

const INITIAL_OPTIONS = {
  // 公式Web
  OPEN_WITH_KEY_PRESS: isFalse,
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
  OPEN_WITH_KEY_PRESS: '',
  SHOW_ON_TIMELINE: 'タイムラインにボタンを表示',
  SHOW_ON_TWEET_DETAIL: 'ツイート詳細にボタンを表示',
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: 'タイムラインにボタンを表示',
  SHOW_ON_TWEETDECK_TWEET_DETAIL: 'ツイート詳細にボタンを表示',
  // 画像ページ
  STRIP_IMAGE_SUFFIX: ''
};

/***/ }),

/***/ 67:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
 // バックグラウンドで実行される
// chrome.runtime.sendMessage で送るメッセージ

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  console.log(chrome.runtime.lastError);

  if (request.method === _helpers_Constants__WEBPACK_IMPORTED_MODULE_0__[/* GET_LOCAL_STORAGE */ "a"]) {
    sendResponse({
      data: localStorage[request.key]
    });
    console.log(request.key + ' : ' + localStorage[request.key]); // debug
  } else {
    sendResponse({
      data: null
    });
  }

  return true;
});

/***/ })

/******/ });