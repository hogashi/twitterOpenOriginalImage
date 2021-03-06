# twitter画像原寸ボタン

[![release version](https://img.shields.io/github/v/release/hogashi/twitterOpenOriginalImage?sort=semver)](https://github.com/hogashi/twitterOpenOriginalImage/releases)
[![Node.js CI](https://github.com/hogashi/twitterOpenOriginalImage/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/hogashi/twitterOpenOriginalImage/actions?query=workflow%3A%22Node.js+CI%22)
[![Coverage Status](https://raw.githubusercontent.com/hogashi/twitterOpenOriginalImage/master/coverage/badge.svg?sanitize=true)](https://github.com/hogashi/twitterOpenOriginalImage/actions?query=branch%3Amaster)

画像ツイートの画像の原寸を新しいタブで開く、GoogleChrome拡張機能です。  
TwitterWeb公式、TweetDeckで動作します。

## インストール

- Chromeウェブストアからインストール: https://chrome.google.com/webstore/detail/kmcomcgcopagkhcbmcmcfhpcmdolfijg
- Edge Addons websiteからインストール: https://microsoftedge.microsoft.com/addons/detail/dkooamjhbcblfbjabpnhefbajlbjoilb

## 使い方

画像ツイートに付いた"Original"ボタンをクリックすると、原寸画像が新しいタブに開かれます。  
<img alt="usage3" src="./images/timeline1.jpg" style="height: 350px" />  
<img alt="usage4" src="./images/timeline2.jpg" style="height: 350px" />

- "原寸画像"とは、次のような画像を指します: `https://pbs.twimg.com/media/CE-1mwkVAAE6Rop?format=jpg&name=orig`
  - これは通常の(縮小された)画像のURL ( `https://pbs.twimg.com/media/CE-1mwkVAAE6Rop.jpg` ) に `?name=orig` を足したものです
  - 縮小の閾値は随時変更されているようなので、 `?name=orig` を付けたものが必ず原寸とは限りません

### 設定

1. Chromeのウィンドウ右上にある拡張機能のボタンをクリックする(またはChromeの拡張機能の設定からこの拡張機能の"オプション"をクリックする)
1. 使いたい機能にチェックを入れ、"設定を保存"をクリックする

<img alt="usage4" src="./images/options.png" />

## 注意

求める権限に「閲覧履歴の読み取り」がありますが、閲覧履歴を読み取ることはしていません。  
タブ間の設定共有のために、タブ操作の権限を使っているため、それが「閲覧履歴の読み取り」と表示されています。

- 公式ドキュメント: [chrome.tabs - Google Chrome](https://developer.chrome.com/extensions/tabs)
- プライバシーポリシー: [./privacy-policy.md](./privacy-policy.md)

## 連絡先

- GitHub: [hogashi](https://github.com/hogashi)
- Twitter: [@hogextend](https://twitter.com/hogextend)
