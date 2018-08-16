/* popup.js */
// ツールバー右に表示される拡張機能のボタンをクリック、または
// [設定]->[拡張機能]の[オプション]から出る設定画面

const optionKeys = Object.keys(options);

// 各設定項目について
optionKeys.forEach(key => {
  // 最初はどっちも機能オンであってほしい
  // 最初は値が入っていないので、「if isfalseでないなら機能オン」とする
  document.getElementsByClassName(key)[0].checked =
    localStorage[key] !== 'isfalse';
});

document.getElementById('save').addEventListener('click', e => {
  optionKeys.forEach(value => {
    const checked = document
      .getElementsByClassName(value)[0]
      .checked.toString();
    localStorage[value] = `is${checked}`;
  });
  chrome.tabs.query({}, result =>
    result.forEach(value => {
      // console.log(value);
      chrome.tabs.sendMessage(value.id, { method: OPTION_UPDATED }, response =>
        console.log('res:', response)
      );
    })
  );
});
