/* popup.js */
// ツールバー右に表示される拡張機能のボタンをクリック、または
// [設定]->[拡張機能]の[オプション]から出る設定画面

const optionKeys = [
  'SHOW_ON_TWEET_DETAIL',
  'SHOW_ON_TIMELINE',
  'OPEN_WITH_KEY_PRESS',
  'SHOW_ON_TWEETDECK_TIMELINE',
  'SHOW_ON_TWEETDECK_TWEET_DETAIL',
  'STRIP_IMAGE_SUFFIX',
];

// 各設定項目について
optionKeys.forEach(value => {
  // 最初はどっちも機能オンであってほしい
  // 最初は値が入っていないので、「if isfalseでないなら機能オン」とする
  document.getElementsByClassName(value)[0].checked = localStorage[value] !== 'isfalse';
});

document.getElementById('save').addEventListener('click', e => {
  optionKeys.forEach(value => {
    const checked = document
      .getElementsByClassName(value)[0]
      .checked.toString();
    localStorage[value] = `is${checked}`;
  });
  browser.tabs.query({}).then(result => {
    result.forEach(value => {
      // console.log(value.id)
      chrome.tabs.sendMessage(
        value.id,
        { method: 'OPTION_UPDATED' },
        response => {
          // console.log('res:', response);
        }
      );
    });
  });
});
