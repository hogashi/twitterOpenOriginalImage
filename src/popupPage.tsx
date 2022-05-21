import React from 'react';
import ReactDOM from 'react-dom';

import {
  OPTIONS_TEXT,
  OPTION_KEYS,
  printException,
  updateOptions,
} from './main';

import { Popup } from './components/Popup';

const optionsText = OPTIONS_TEXT;
const optionKeys = OPTION_KEYS;

const props = {
  optionsText,
  optionKeys,
};

let root = document.getElementById('root');
if (!root) {
  root = document.createElement('div');
  root.id = 'root';
  const body = document.querySelector('body');
  if (body) {
    body.appendChild(root);
  } else {
    printException('cant find body');
  }
}

updateOptions().then(options => {
  ReactDOM.render(
    <Popup {...props} options={options} />,
    document.getElementById('root')
  );
});
