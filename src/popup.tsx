import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import {
  isTrue,
  isFalse,
  OPTIONS_TEXT,
  OPTION_UPDATED,
  INITIAL_OPTIONS,
  HOST_TWITTER_COM,
  HOST_TWEETDECK_TWITTER_COM,
  HOST_PBS_TWIMG_COM,
  SHOW_ON_TIMELINE,
  SHOW_ON_TWEET_DETAIL,
  SHOW_ON_TWEETDECK_TIMELINE,
  SHOW_ON_TWEETDECK_TWEET_DETAIL,
  STRIP_IMAGE_SUFFIX,
  Options,
} from './helpers/Constants';

const { useState, useCallback } = React;

/* popup.js */
// ツールバー右に表示される拡張機能のボタンをクリック、または
// [設定]->[拡張機能]の[オプション]から出る設定画面

interface Props {
  optionsText: { [key: string]: string };
  optionKeys: string[]; // Array<keyof Options>
  optionsEnabled: { [key: string]: boolean };
};

export const Popup = (props: Props) => {
  const { optionsText, optionKeys, optionsEnabled } = props;
  const [enabled, setEnabled] = useState(optionsEnabled);

  const onSave = useCallback(() => {
    optionKeys.forEach(key => {
      localStorage[key] = enabled[key] ? isTrue : isFalse;
    });
    chrome.tabs.query({}, result =>
      result.forEach(tab => {
        // console.log(tab);
        if (!tab.url || !tab.id) {
          return;
        }
        const tabUrl = new URL(tab.url).hostname;
        if (
          ![
            HOST_TWITTER_COM,
            HOST_TWEETDECK_TWITTER_COM,
            HOST_PBS_TWIMG_COM,
          ].some(url => url === tabUrl)
        ) {
          // 送り先タブが拡張機能が動作する対象ではないならメッセージを送らない
          return;
        }
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
        <Checkbox
          checked={enabled[key]}
          style={{ padding: '4px 12px' }}
          tabIndex={-1}
          disableRipple
        />
        <ListItemText primary={optionsText[key]} />
      </ListItem>
    );
  });

  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'column',
        justifyContent: 'center',
        minWidth: '300px',
      }}
    >
      <AppBar position="static">
        <Toolbar
          variant="dense"
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography color="inherit" variant="h5" style={{ flex: '0 1 auto' }}>
            Options - 設定
          </Typography>
        </Toolbar>
      </AppBar>
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
      <List
        subheader={<ListSubheader component="div">画像ページ</ListSubheader>}
      >
        {optionsItems[STRIP_IMAGE_SUFFIX]}
      </List>
      <Button
        variant="contained"
        color="primary"
        onClick={onSave}
        style={{ flex: '0 1 auto' }}
      >
        設定を保存
      </Button>
      <footer
        style={{
          textAlign: 'center',
          marginTop: '3px',
        }}
      >
        twitter画像原寸ボタン - hogashi
      </footer>
    </div>
  );
};

const optionsText = OPTIONS_TEXT;
const optionKeys = Object.keys(INITIAL_OPTIONS);
const optionsEnabled: { [key: string]: boolean } = {};
optionKeys.forEach(key => {
  // 最初はどっちも機能オンであってほしい
  // 最初は値が入っていないので、「if isfalseでないなら機能オン」とする
  optionsEnabled[key] = localStorage[key] !== isFalse;
});

const props = {
  optionsText,
  optionKeys,
  optionsEnabled,
};

ReactDOM.render(
  <Popup {...props} />,
  document.querySelector('body'),
);
