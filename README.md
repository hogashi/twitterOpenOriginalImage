# twitterOpenOriginalImage

This is an GoogleChrome extension which opens original-sized tweeted-image(s) into new tab(s).

##Installation

Available in Chrome Web Store:<br />
  https://chrome.google.com/webstore/detail/kmcomcgcopagkhcbmcmcfhpcmdolfijg<br />

##Usage

###Tweet detail page

  1. Open an image tweet (e.g. [https://twitter.com/hogextend/status/598896954270060544](https://twitter.com/hogextend/status/598896954270060544)).<br />
  2. Click the button "Original" or press the [Enter(Return)] key.<br />
<img alt="usage2" src="./images/detail1.jpg" height="350px" /><br />
  3. It opens original image in new tab.<br />
<img alt="usage3" src="./images/detail2.jpg" height="350px" /><br />

###Timeline

  1. Click the button "Original" (on image tweet).<br />
<img alt="usage3" src="./images/timeline1.jpg" height="350px" /><br />

  2. It opens original image in new tab.<br />
<img alt="usage4" src="./images/timeline2.jpg" height="350px" /><br />

  ! "Original image" means like this; "https://pbs.twimg.com/media/CE-1mwkVAAE6Rop.jpg:orig"<br />
  ! It's the resized image's url "https://pbs.twimg.com/media/CE-1mwkVAAE6Rop.jpg" plus ":orig"<br />

###Option

  1. Press the extension button in top right of chrome.<br />
<img alt="usage4" src="./images/option.jpg" height="350px" /><br />
  2. Modify which function you use and press the botton "設定を保存" (Save the Settings).

If you want to edit this project, please contact me as you possible.<br />

##Contact:

  twitter: [@hogextend](https://twitter.com/hogextend)

---

# twitter画像原寸ボタン

画像ツイートの画像の原寸を新しいタブで開く、GoogleChrome拡張機能です。

## インストール

Chromeウェブストアで入手できます: [twitter画像原寸ボタン](https://chrome.google.com/webstore/detail/kmcomcgcopagkhcbmcmcfhpcmdolfijg)<br />

## 使い方

### ツイート詳細ページ

  1. 画像ツイートを開きます(例: [https://twitter.com/hogextend/status/598896954270060544](https://twitter.com/hogextend/status/598896954270060544))。<br />
  2. "Original"ボタンをクリック、または [Enter(Return)] キーを押します。<br />
<img alt="usage2" src="./images/detail1.jpg" height="350px" /><br />
  3. 原寸画像が新しいタブに開かれます。<br />
<img alt="usage3" src="./images/detail2.jpg" height="350px" /><br />

### タイムライン

  1. 画像ツイートにある"Original"ボタンをクリックしてください。<br />
<img alt="usage3" src="./images/timeline1.jpg" height="350px" /><br />

  2. 原寸画像が新しいタブに開かれます。<br />
<img alt="usage4" src="./images/timeline2.jpg" height="350px" /><br />

  ! "原寸画像"とは、次のような画像を指します: "https://pbs.twimg.com/media/CE-1mwkVAAE6Rop.jpg:orig"<br />
  ! これは通常の(縮小された)画像のURL ("https://pbs.twimg.com/media/CE-1mwkVAAE6Rop.jpg") に ":orig" を足したものです。<br />

### 設定

  1. Chromeのウィンドウ右上にある拡張機能のボタンをクリックしてください。<br />
<img alt="usage4" src="./images/option.jpg" height="350px" /><br />
  2. 使いたい機能にチェックを入れ、"設定を保存"をクリックしてください。

## 連絡先

  twitter: [@hogextend](https://twitter.com/hogextend)

---

## Changes
ver.2.1 [2016/04/23] Set Original-button on Tweetdeck (timeline only) and improved saving behavior.<br />
ver.2.0.5 [2016/03/19] Fixed "don't open images with return-key when replying", "show Original-button on tweet-image-gallery", "don't get rid of Original-button on timeline".<br />
ver.2.0.4 [2016/02/06] Fixed that tweet opens in popup when you press the Original-button.<br />
ver.2.0.3 [2016/01/22] Add "Open with Return Key" option.<br />
ver.2.0.2 [2016/01/13] Fixed URL to open (":bla" to ":orig").<br />
ver.2.0.1 [2016/01/13] Fixed URL to open (it had had ":orig:orig" in its tail).<br />
ver.2.0 [2016/01/01] Changed the Original-button appearance (appears in timeline, too) and add option to choose which function to use.<br />
ver.1.6.2 [2015/12/09] Fixed Original-button appearance (not to appear the button on a non-photo-tweet)<br />
ver.1.6.1 [2015/12/09] Coped with the change of photo-tweet showing in twitter (again)<br />
ver.1.6 [2015/10/28] Coped with the change of photo-tweet showing in twitter<br />
ver.1.5.2 [2015/10/20] Fixed Original-button position (to the side of action-buttons). <br />
ver.1.5.1 [2015/08/02] Fixed the behavior of multiple-photo-tweet-reply to multiple-photo-tweet situation.  It did open former photos (and so on). <br />
ver.1.5 [2015/07/20] Coped with the change of multiple-photo-tweet showing in twitter<br />
ver.1.3 [2015/05/14] Coped with reply-photo-tweet to photo-tweet<br />
　[2015/03/24] Fixed readme.txt<br />
ver.1.2 [2015/03/19] Coped with multiple-photo-tweet, fixed behavior<br />
ver.1.1 [2015/02/16] Added operation procedure ([Enter(Return)] key), fixed behavior<br />
ver.1.0 [2015/02/15] Released<br />

## 更新履歴
ver. 2.1 TweetDeckのタイムラインに対応、保存動作を向上<br />
ver. 2.0.5 リプライ中はEnterキーで画像が開かないように修正、画像をクリックしたポップアップにもOriginalボタンを表示、タイムラインでのOriginalボタンの表示を安定化<br />
ver. 2.0.4 タイムライン上のOriginalボタンを押してもツイートがポップアップしないよう修正<br />
ver. 2.0.3 設定項目「Enterキーで画像を開く」を追加<br />
ver. 2.0.2 画像URLの「:」以降が何であっても「:orig」と出来るよう改善<br />
ver. 2.0.1 画像URLが「:orig:orig」となる不具合を修正<br />
ver. 2.0 タイムラインへOriginalボタンの表示、設定画面の追加<br />
ver. 1.6.1 twiter公式のツイート及び画像の表示の更新への対応((また)完全に何も動作しない症状を改善)<br />
ver. 1.6 twiter公式のツイート及び画像の表示の更新への対応(完全に何も動作しない症状を改善)<br />
ver. 1.5.2 Originalボタンが下に入り込んでいたのを公式の操作ボタンと横並びにした<br />
ver. 1.5.1 twitter公式の画像表示の更新への対応(画像ツイートへの複数画像ツイートリプライにおける画像が正しく取得されない症状を改善)<br />
ver. 1.5 twitter公式の画像表示の更新への対応(複数画像が1枚しか出ない症状を改善)<br />
ver. 1.3 画像ツイートに対するリプライ画像ツイートに対応<br />
ver. 1.2 動作の改良、複数画像ツイートに対応<br />
ver. 1.1 動作の改良、操作方法の追加(Enterキー)<br />
ver. 1.0 公開<br />
