# 「twitter画像原寸ボタン」 Privacy Policy / プライバシーポリシー

- Source code: https://github.com/hogashi/twitterOpenOriginalImage/
- Chrome Web Store: https://chrome.google.com/webstore/detail/kmcomcgcopagkhcbmcmcfhpcmdolfijg
- Twitter: [@hogextend](https://twitter.com/hogextend)

## Does / すること

This Chrome extension does:

- save settings locally with users' own LocalStorage
- tell updated settings to every tabs which this extension is loaded in users' Chrome browser with [`chrome.tabs` API](https://developer.chrome.com/extensions/tabs) (load target URL is described in `"content_scripts" > "matches"` section in [manifest.json](./dist/manifest.json))

この Chrome 拡張機能は以下をします:

- ユーザ自身の LocalStorage に設定を保存すること
- 更新された設定を、 [`chrome.tabs` API](https://developer.chrome.com/extensions/tabs) を使って、この拡張機能が読み込まれたタブに伝えること (この拡張機能が読み込まれる対象の URL は、 [manifest.json](./dist/manifest.json) の `"content_scripts" > "matches"` 部分に書かれている)

## Does Not / しないこと

This Chrome extension does not:

- send any data to anywhere in Internet

この拡張機能は以下をしません:

- 何かのデータをインターネットのどこかに送ること

## Changelog / 更新

- 2020/02/03 create this document / この文書を作成
