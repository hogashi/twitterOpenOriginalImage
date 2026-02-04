import { type ChangeEvent, useCallback, useState } from 'react';
import { type Root, createRoot } from 'react-dom/client';
import {
  HOST_MOBILE_TWITTER_COM,
  HOST_MOBILE_X_COM,
  HOST_PRO_TWITTER_COM,
  HOST_PRO_X_COM,
  HOST_TWEETDECK_TWITTER_COM,
  HOST_TWITTER_COM,
  HOST_X_COM,
  OPTION_KEYS,
  OPTION_UPDATED,
  OPTIONS_TEXT,
  type OptionsBool,
  ORIGINAL_BUTTON_TEXT_OPTION_KEY,
  SHOW_ON_TIMELINE,
  SHOW_ON_TWEET_DETAIL,
  SHOW_ON_TWEETDECK_TIMELINE,
  SHOW_ON_TWEETDECK_TWEET_DETAIL,
} from '../constants';
import { printException } from '../utils';
import { getOptions, setOptions } from './options';

/* popup.js */
// ツールバー右に表示される拡張機能のボタンをクリック、または
// [設定]->[拡張機能]の[オプション]から出る設定画面

interface Props {
  optionsText: { [key: string]: string };
  optionKeys: typeof OPTION_KEYS;
  optionsEnabled: OptionsBool;
}

export const Popup = (props: Props): React.JSX.Element => {
  const { optionsText, optionKeys, optionsEnabled } = props;
  const [enabled, setEnabled] = useState(optionsEnabled);
  const [saveButtonText, setSaveButtonText] = useState('設定を保存');

  const onOriginalButtonTextInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setEnabled({ ...enabled, [ORIGINAL_BUTTON_TEXT_OPTION_KEY]: event.target.value });
    },
    [enabled],
  );

  const onSave = useCallback(() => {
    setOptions(enabled, () => {
      setSaveButtonText('しました');
      setTimeout(() => {
        setSaveButtonText('設定を保存');
      }, 500);
    });
    chrome.tabs.query({}, (result) =>
      result.forEach((tab) => {
        // console.log(tab);
        if (!(tab.url && tab.id)) {
          return;
        }
        const tabUrl = new URL(tab.url).hostname;
        if (
          ![
            HOST_TWITTER_COM,
            HOST_MOBILE_TWITTER_COM,
            HOST_TWEETDECK_TWITTER_COM,
            HOST_PRO_TWITTER_COM,
            HOST_X_COM,
            HOST_MOBILE_X_COM,
            HOST_PRO_X_COM,
          ].some((url) => url === tabUrl)
        ) {
          // 送り先タブが拡張機能が動作する対象ではないならメッセージを送らない
          return;
        }
        chrome.tabs.sendMessage(tab.id, { method: OPTION_UPDATED }, (response) => {
          // eslint-disable-next-line no-console
          console.log('res:', response);
        });
      }),
    );
  }, [enabled]);

  const renderCheckboxItem = (key: keyof Omit<OptionsBool, typeof ORIGINAL_BUTTON_TEXT_OPTION_KEY>) => (
    <div className="checkboxListItem relative flex gap-x-2">
      <div className="flex h-6 items-center">
        <input
          id={key}
          name={key}
          type="checkbox"
          checked={enabled[key]}
          className={`${key} h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600`}
          onClick={(): void => {
            setEnabled(Object.assign({ ...enabled }, { [key]: !enabled[key] }));
          }}
        />
      </div>
      <div className="text-sm leading-6">
        <label htmlFor={key} className="font-medium text-gray-900">
          {optionsText[key]}
        </label>
      </div>
    </div>
  );

  return (
    <div
      className="p-3 flex flex-col justify-center items-center"
      style={{
        minWidth: '230px',
      }}
    >
      <h1 className="text-xl font-bold leading-7 text-gray-900 self-center sm:truncate sm:text-3xl sm:tracking-tight">
        Options - 設定
      </h1>
      <div className="my-1">
        <fieldset className="my-1">
          <h2 className="text-base font-semibold leading-7 text-gray-900">TwitterWeb公式</h2>
          {renderCheckboxItem(SHOW_ON_TIMELINE)}
          {renderCheckboxItem(SHOW_ON_TWEET_DETAIL)}
        </fieldset>
        <fieldset className="my-1">
          <h2 className="text-base font-semibold leading-7 text-gray-900">TweetDeck</h2>
          {renderCheckboxItem(SHOW_ON_TWEETDECK_TIMELINE)}
          {renderCheckboxItem(SHOW_ON_TWEETDECK_TWEET_DETAIL)}
        </fieldset>
        <div className="my-1">
          <label htmlFor="button-text" className="text-base font-semibold leading-7 text-gray-900">
            ボタンのテキスト
          </label>
          <div className="mt-2">
            <input
              id="original-button-text"
              name="original-button-text"
              type="text"
              value={enabled[ORIGINAL_BUTTON_TEXT_OPTION_KEY]}
              onChange={onOriginalButtonTextInputChange}
              className={`${ORIGINAL_BUTTON_TEXT_OPTION_KEY} block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2 text-base`}
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="saveSettingButton rounded-md bg-indigo-600 w-4/5 mt-1 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={onSave}
      >
        {saveButtonText}
      </button>
      <footer className="text-center mt-1">twitter画像原寸ボタン - hogashi</footer>
    </div>
  );
};

let reactRoot: Root | null = null;

getOptions().then((optionsEnabled) => {
  const props = {
    optionsText: OPTIONS_TEXT,
    optionKeys: OPTION_KEYS,
    optionsEnabled,
  };

  let rootElement = document.getElementById('root');
  if (!rootElement) {
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    const body = document.querySelector('body');
    if (body) {
      body.appendChild(rootElement);
    } else {
      printException('cant find body');
      return;
    }
  }
  
  if (!reactRoot) {
    reactRoot = createRoot(rootElement);
  }
  reactRoot.render(<Popup {...props} />);
});
