import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import {
  isTrue,
  isFalse,
  OPTIONS_TEXT,
  OPTION_UPDATED,
  INITIAL_OPTIONS,
  SHOW_ON_TIMELINE,
  SHOW_ON_TWEET_DETAIL,
  SHOW_ON_TWEETDECK_TIMELINE,
  SHOW_ON_TWEETDECK_TWEET_DETAIL,
} from './helpers/Constants';
import { Checkbox } from '@material-ui/core';

const { useCallback, useState } = React;

/* popup.js */
// ツールバー右に表示される拡張機能のボタンをクリック、または
// [設定]->[拡張機能]の[オプション]から出る設定画面

const optionsText = OPTIONS_TEXT;
const optionKeys = Object.keys(INITIAL_OPTIONS);
const optionsEnabled: { [key: string]: boolean } = {};
optionKeys.forEach(key => {
  // 最初はどっちも機能オンであってほしい
  // 最初は値が入っていないので、「if isfalseでないなら機能オン」とする
  optionsEnabled[key] = localStorage[key] !== isFalse;
});
const Popup = () => {
  const [enabled, setEnabled] = useState(optionsEnabled);

  const onSave = useCallback(() => {
    optionKeys.forEach(key => {
      localStorage[key] = enabled[key] ? isTrue : isFalse;
    });
    chrome.tabs.query({}, result =>
      result.forEach(tab => {
        // console.log(tab);
        chrome.tabs.sendMessage(tab.id, { method: OPTION_UPDATED }, response =>
          console.log('res:', response)
        );
      })
    );
  }, [enabled]);

  const optionsItems: { [key: string]: JSX.Element } = {};
  optionKeys.forEach(key => {
    optionsItems[key] = (
      <ListItem
        dense
        button
        onClick={() => {
          setEnabled(Object.assign({ ...enabled }, { [key]: !enabled[key] }));
        }}
      >
        <Checkbox checked={enabled[key]} tabIndex={-1} disableRipple />
        <ListItemText primary={optionsText[key]} />
      </ListItem>
    );
  });
  return (
    <div>
      <List
        subheader={
          <ListSubheader component="div">Options - 設定</ListSubheader>
        }
      >
        <List
          subheader={
            <ListSubheader component="div">TwitterWeb公式</ListSubheader>
          }
        >
          {optionsItems[SHOW_ON_TIMELINE]}
          {optionsItems[SHOW_ON_TWEET_DETAIL]}
        </List>
        <List
          subheader={<ListSubheader component="div">TweetDeck</ListSubheader>}
        >
          {optionsItems[SHOW_ON_TWEETDECK_TIMELINE]}
          {optionsItems[SHOW_ON_TWEETDECK_TWEET_DETAIL]}
        </List>
        <hr />
      </List>
      <Button variant="contained" color="primary" onClick={onSave}>
        設定を保存
      </Button>
      <footer>twitter画像原寸ボタン - hogashi</footer>
    </div>
  );
};

ReactDOM.render(<Popup />, document.querySelector('body'));
