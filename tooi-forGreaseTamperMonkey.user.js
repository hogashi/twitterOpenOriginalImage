// ==UserScript==
// @author          hogashi
// @name            twitterOpenOriginalImage
// @namespace       https://hogashi.hatenablog.com/
// @description     TwitterページでOriginalボタンを押すと原寸の画像が開きます(https://hogashi.hatenablog.com)
// @include         https://twitter.com*
// @include         https://tweetdeck.twitter.com*
// @include         https://pbs.twimg.com/media*
// @version         3.2.0
// ==/UserScript==


// 設定
// 'isfalse' とすると、その設定がオフになる
var options = {
  // 公式Web
  SHOW_ON_TIMELINE: 'istrue',
  SHOW_ON_TWEET_DETAIL: 'istrue',
  // TweetDeck
  SHOW_ON_TWEETDECK_TIMELINE: 'istrue',
  SHOW_ON_TWEETDECK_TWEET_DETAIL: 'istrue',
  // 画像ページ
  STRIP_IMAGE_SUFFIX: 'istrue'
};

// --- 以下は編集しない ---


  //! %%% splitter for userjs %%%
  var OPTION_UPDATED = "OPTION_UPDATED";
  var GET_LOCAL_STORAGE = "GET_LOCAL_STORAGE";
  var HOST_TWITTER_COM = "twitter.com";
  var HOST_MOBILE_TWITTER_COM = "mobile.twitter.com";
  var SHOW_ON_TIMELINE = "SHOW_ON_TIMELINE";
  var SHOW_ON_TWEET_DETAIL = "SHOW_ON_TWEET_DETAIL";
  var HOST_TWEETDECK_TWITTER_COM = "tweetdeck.twitter.com";
  var SHOW_ON_TWEETDECK_TIMELINE = "SHOW_ON_TWEETDECK_TIMELINE";
  var SHOW_ON_TWEETDECK_TWEET_DETAIL = "SHOW_ON_TWEETDECK_TWEET_DETAIL";
  var HOST_PBS_TWIMG_COM = "pbs.twimg.com";
  var STRIP_IMAGE_SUFFIX = "STRIP_IMAGE_SUFFIX";
  var isTwitter = () => window.location.hostname === HOST_TWITTER_COM || window.location.hostname === HOST_MOBILE_TWITTER_COM;
  var isTweetdeck = () => window.location.hostname === HOST_TWEETDECK_TWITTER_COM;
  var isImageTab = () => window.location.hostname === HOST_PBS_TWIMG_COM;
  var isNativeChromeExtension = () => window.chrome !== void 0 && window.chrome.runtime !== void 0 && window.chrome.runtime.id !== void 0;
  var isTrue = "istrue";
  var isFalse = "isfalse";
  var OPTION_KEYS = [
    SHOW_ON_TIMELINE,
    SHOW_ON_TWEET_DETAIL,
    SHOW_ON_TWEETDECK_TIMELINE,
    SHOW_ON_TWEETDECK_TWEET_DETAIL,
    STRIP_IMAGE_SUFFIX
  ];
  var printException = (tooiException) => {
    try {
      throw new Error("tooi: " + tooiException + " at: " + window.location.href);
    } catch (err) {
      console.log(err);
    }
  };
  var collectUrlParams = (rawUrl) => {
    if (!/https:\/\/pbs\.twimg\.com\/media/.test(rawUrl)) {
      return null;
    }
    const url = new URL(rawUrl);
    const searchSet = {
      format: "jpg",
      name: null
    };
    url.search.slice(1).split("&").forEach((set) => {
      const [key, value] = set.split("=");
      if (key === "format" || key === "name") {
        searchSet[key] = value;
      }
    });
    const matched = url.pathname.match(/^(.*?)(?:|\.([^.:]+))(?:|:([a-z]+))$/);
    const pathnameWithoutExtension = matched[1];
    const extension = matched[2];
    const legacyName = matched[3] || null;
    return {
      protocol: url.protocol,
      host: url.host,
      pathname: pathnameWithoutExtension,
      format: extension || searchSet.format,
      name: searchSet.name || legacyName
    };
  };
  var formatUrl = (imgUrl) => {
    if (imgUrl.length === 0) {
      return null;
    }
    const params = collectUrlParams(imgUrl);
    if (!params) {
      return imgUrl;
    }
    const { protocol, host, pathname, format } = params;
    return `${protocol}//${host}${pathname}?format=${format}&name=orig`;
  };
  var openImages = (imgSrcs) => {
    if (imgSrcs.length === 0) {
      printException("zero image urls");
      return;
    }
    Array.from(imgSrcs).reverse().forEach((imgSrc) => {
      const url = formatUrl(imgSrc);
      if (url) {
        window.open(url);
      } else {
        printException("no image url");
      }
    });
  };
  var setStyle = (element, propertySet) => {
    Object.entries(propertySet).forEach(([key, value]) => element.style.setProperty(key, value));
  };
  var onOriginalButtonClick = (e, imgSrcs) => {
    e.preventDefault();
    e.stopPropagation();
    openImages(imgSrcs);
  };
  var getImageFilenameByUrl = (imgUrl) => {
    const params = collectUrlParams(imgUrl);
    if (!params) {
      return null;
    }
    const { pathname, format, name } = params;
    const basename = pathname.match(/([^/.]*)$/)[1];
    return `${basename}${name ? `-${name}` : ""}.${format}`;
  };
  var downloadImage = (e) => {
    if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
      const imageSrc = document.querySelector("img").src;
      const filename = getImageFilenameByUrl(imageSrc);
      if (!filename) {
        return;
      }
      e.preventDefault();
      const a = document.createElement("a");
      a.href = window.location.href;
      a.setAttribute("download", filename);
      a.dispatchEvent(new MouseEvent("click"));
    }
  };
  var getOptions = () => {
    console.log("get options");
    if (isNativeChromeExtension()) {
      return new Promise((resolve, reject) => {
        const request = {
          method: GET_LOCAL_STORAGE
        };
        const callback = (response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject();
          }
        };
        window.chrome.runtime.sendMessage(request, callback);
      }).then((data) => {
        const options2 = {};
        OPTION_KEYS.map((key) => {
          options2[key] = data[key] || isTrue;
        });
        console.log("get options (then): ", options2);
        return options2;
      });
    } else {
      return Promise.resolve(options);
    }
  };
  var ButtonSetter = class {
    setButtonOnTimeline(options2) {
      if (document.querySelector("#react-root")) {
        this._setButtonOnReactLayoutTimeline(options2);
        return;
      }
      this._setButtonOnTimeline(options2);
    }
    setButtonOnTweetDetail(options2) {
      this._setButtonOnTweetDetail(options2);
    }
    setButton({
      className,
      getImgSrcs,
      target
    }) {
      const style = {
        width: "70px",
        "font-size": "13px",
        color: this.getActionButtonColor()
      };
      const button = document.createElement("input");
      button.className = "tooi-button";
      setStyle(button, style);
      button.type = "button";
      button.value = "Original";
      button.addEventListener("click", (e) => {
        onOriginalButtonClick(e, getImgSrcs());
      });
      const container = document.createElement("div");
      container.classList.add("ProfileTweet-action", className);
      target.appendChild(container);
      container.appendChild(button);
    }
    setReactLayoutButton({
      className,
      getImgSrcs,
      target
    }) {
      const button = document.createElement("input");
      button.type = "button";
      button.value = "Original";
      const color = this.getReactLayoutActionButtonColor();
      setStyle(button, {
        "font-size": "13px",
        padding: "4px 8px",
        color,
        "background-color": "rgba(0, 0, 0, 0)",
        border: `1px solid ${color}`,
        "border-radius": "3px",
        cursor: "pointer"
      });
      button.addEventListener("click", (e) => {
        onOriginalButtonClick(e, getImgSrcs());
      });
      const container = document.createElement("div");
      container.classList.add(className);
      setStyle(container, {
        display: "flex",
        "margin-left": "20px",
        "flex-flow": "column",
        "justify-content": "center"
      });
      target.appendChild(container);
      container.appendChild(button);
    }
    _setButtonOnTimeline(options2) {
      if (!(options2[SHOW_ON_TIMELINE] !== isFalse)) {
        return;
      }
      const tweets = document.getElementsByClassName("js-stream-tweet");
      if (!tweets.length) {
        return;
      }
      const className = "tooi-button-container-timeline";
      Array.from(tweets).forEach((tweet) => {
        if (!(tweet.getElementsByClassName("AdaptiveMedia-container").length !== 0 && tweet.getElementsByClassName("AdaptiveMedia-container")[0].getElementsByTagName("img").length !== 0) || tweet.getElementsByClassName(className).length !== 0) {
          return;
        }
        const actionList = tweet.querySelector(".ProfileTweet-actionList");
        if (!actionList) {
          printException("no target");
          return;
        }
        const mediaContainer = tweet.getElementsByClassName("AdaptiveMedia-container")[0];
        const getImgSrcs = () => Array.from(mediaContainer.getElementsByClassName("AdaptiveMedia-photoContainer")).map((element) => element.getElementsByTagName("img")[0].src);
        this.setButton({
          className,
          getImgSrcs,
          target: actionList
        });
      });
    }
    _setButtonOnTweetDetail(options2) {
      if (!(options2[SHOW_ON_TWEET_DETAIL] !== isFalse)) {
        return;
      }
      const className = "tooi-button-container-detail";
      if (!document.getElementsByClassName("permalink-tweet-container")[0] || !document.getElementsByClassName("permalink-tweet-container")[0].getElementsByClassName("AdaptiveMedia-photoContainer")[0] || document.getElementsByClassName(className).length !== 0) {
        return;
      }
      const actionList = document.querySelector(".permalink-tweet-container .ProfileTweet-actionList");
      if (!actionList) {
        printException("no target");
        return;
      }
      const getImgSrcs = () => Array.from(document.getElementsByClassName("permalink-tweet-container")[0].getElementsByClassName("AdaptiveMedia-photoContainer")).map((element) => element.getElementsByTagName("img")[0].src);
      this.setButton({
        className,
        getImgSrcs,
        target: actionList
      });
    }
    _setButtonOnReactLayoutTimeline(options2) {
      if (!(options2[SHOW_ON_TIMELINE] !== isFalse)) {
        return;
      }
      const className = "tooi-button-container-react-timeline";
      const tweets = Array.from(document.querySelectorAll("#react-root main section article"));
      if (!tweets.length) {
        return;
      }
      tweets.forEach((tweet) => {
        const tweetATags = Array.from(tweet.querySelectorAll("a")).filter((aTag) => /\/status\/[0-9]+\/photo\//.test(aTag.href));
        if (tweetATags.length === 0 || tweetATags.every((aTag) => !aTag.querySelector("img")) || tweet.getElementsByClassName(className)[0]) {
          return;
        }
        const target = tweet.querySelector('div[role="group"]');
        if (!target) {
          printException("no target");
          return;
        }
        const getImgSrcs = () => {
          const tweetImgs = tweetATags.map((aTag) => aTag.querySelector("img"));
          if (tweetImgs.length === 4) {
            const tweetimgTmp = tweetImgs[1];
            tweetImgs[1] = tweetImgs[2];
            tweetImgs[2] = tweetimgTmp;
          }
          return tweetImgs.map((img) => img ? img.src : "").filter((src) => src != "");
        };
        this.setReactLayoutButton({
          className,
          getImgSrcs,
          target
        });
      });
    }
    getActionButtonColor() {
      const contrastLimitColor = "#697b8c";
      const actionButton = document.querySelector(".ProfileTweet-actionButton");
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
      let color = "#697b8c";
      const actionButton = document.querySelector('div[role="group"] div[role="button"]');
      if (actionButton && actionButton.children[0] && actionButton.children[0].style) {
        const buttonColor = window.getComputedStyle(actionButton.children[0]).color;
        if (buttonColor && buttonColor.length > 0) {
          color = buttonColor;
        }
      }
      return color;
    }
  };
  var ButtonSetterTweetDeck = class {
    setButtonOnTimeline(options2) {
      if (!(options2[SHOW_ON_TWEETDECK_TIMELINE] !== isFalse)) {
        return;
      }
      const tweets = document.getElementsByClassName("js-stream-item is-actionable");
      if (!tweets.length) {
        return;
      }
      const className = "tooi-button-container-tweetdeck-timeline";
      Array.from(tweets).forEach((tweet) => {
        if (!tweet.getElementsByClassName("js-media-image-link").length || tweet.getElementsByClassName("is-video").length || tweet.getElementsByClassName("is-gif").length || tweet.getElementsByClassName(className).length) {
          return;
        }
        const target = tweet.querySelector("footer");
        if (!target) {
          printException("no target");
          return;
        }
        const getImgSrcs = () => {
          return Array.from(tweet.getElementsByClassName("js-media-image-link")).map((element) => {
            const urlstr = this.getBackgroundImageUrl(element);
            return urlstr ? urlstr : "";
          }).filter((urlstr) => urlstr != "");
        };
        this.setButton({
          className,
          getImgSrcs,
          target
        });
      });
    }
    setButtonOnTweetDetail(options2) {
      if (!(options2[SHOW_ON_TWEETDECK_TWEET_DETAIL] !== isFalse)) {
        return;
      }
      const tweets = document.getElementsByClassName("js-tweet-detail");
      if (!tweets.length) {
        return;
      }
      const className = "tooi-button-container-tweetdeck-detail";
      Array.from(tweets).forEach((tweet) => {
        if (!tweet.getElementsByClassName("media-img").length && !tweet.getElementsByClassName("media-image").length || tweet.getElementsByClassName(className).length) {
          return;
        }
        const target = tweet.querySelector("footer");
        if (!target) {
          printException("no target");
          return;
        }
        const getImgSrcs = () => {
          if (tweet.getElementsByClassName("media-img").length !== 0) {
            return [
              tweet.getElementsByClassName("media-img")[0].src
            ];
          } else {
            return Array.from(tweet.getElementsByClassName("media-image")).map((element) => {
              const urlstr = this.getBackgroundImageUrl(element);
              return urlstr ? urlstr : "";
            }).filter((urlstr) => urlstr != "");
          }
        };
        this.setButton({
          className,
          getImgSrcs,
          target
        });
      });
    }
    setButton({
      className,
      getImgSrcs,
      target
    }) {
      const txtMute = document.querySelector(".txt-mute");
      const borderColor = txtMute ? window.getComputedStyle(txtMute).color : "#697b8c";
      const style = {
        border: `1px solid ${borderColor}`,
        "border-radius": "2px",
        display: "inline-block",
        "font-size": "0.75em",
        "margin-top": "5px",
        padding: "1px 1px 0",
        "line-height": "1.5em",
        cursor: "pointer"
      };
      const button = document.createElement("a");
      button.className = `pull-left margin-txs txt-mute ${className}`;
      setStyle(button, style);
      button.addEventListener("click", (e) => {
        onOriginalButtonClick(e, getImgSrcs());
      });
      button.insertAdjacentHTML("beforeend", "Original");
      target.appendChild(button);
    }
    getBackgroundImageUrl(element) {
      if (element.style.backgroundImage) {
        return element.style.backgroundImage.replace(/url\("?([^"]*)"?\)/, "$1");
      }
      return null;
    }
  };
  var getButtonSetter = () => {
    if (isTwitter()) {
      return new ButtonSetter();
    } else if (isTweetdeck()) {
      return new ButtonSetterTweetDeck();
    } else {
      printException("none of twitter page");
      return new ButtonSetter();
    }
  };
  var tooiMain = () => {
    if (isTwitter() || isTweetdeck()) {
      const INTERVAL = 300;
      const buttonSetter = getButtonSetter();
      const setButton = () => {
        buttonSetter.setButtonOnTimeline(options);
        buttonSetter.setButtonOnTweetDetail(options);
      };
      let isInterval = false;
      let deferred = false;
      const setButtonWithInterval = () => {
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
      getOptions().then((newOptions) => {
        Object.keys(newOptions).forEach((key) => {
          options[key] = newOptions[key];
        });
        setButtonWithInterval();
      });
      const observer = new MutationObserver(setButtonWithInterval);
      const target = document.querySelector("body");
      const config = { childList: true, subtree: true };
      observer.observe(target, config);
      if (isNativeChromeExtension()) {
        window.chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
          console.log(window.chrome.runtime.lastError);
          if (request.method === OPTION_UPDATED) {
            getOptions().then((newOptions) => {
              Object.keys(newOptions).forEach((key) => {
                options[key] = newOptions[key];
              });
              setButtonWithInterval();
              sendResponse({ data: "done" });
            });
            return true;
          }
          sendResponse({ data: "yet" });
          return true;
        });
      }
    } else if (isImageTab()) {
      getOptions().then((newOptions) => {
        Object.keys(newOptions).forEach((key) => {
          options[key] = newOptions[key];
        });
      });
      document.addEventListener("keydown", (e) => {
        console.log(options[STRIP_IMAGE_SUFFIX]);
        if (options[STRIP_IMAGE_SUFFIX] !== "isfalse") {
          downloadImage(e);
        }
      });
    } else {
      printException("not twitter/tweetdeck/image page");
    }
  };
  if (isTwitter() || isTweetdeck() || isImageTab()) {
    tooiMain();
  }
})();
