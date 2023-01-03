import { initialOptionsBool, SHOW_ON_TIMELINE } from '../src/constants';
import { getOptions } from '../src/options';

let storageOptions = {};
chrome.storage.sync.get = jest.fn((_keys, callback) => callback(storageOptions));

describe('設定とってくるヘルパ', () => {
  it('最初は初期値', () => {
    expect(getOptions()).resolves.toMatchObject(initialOptionsBool);
  });
  it('設定入れるとそれが入ってる', () => {
    storageOptions = { [SHOW_ON_TIMELINE]: false };
    expect(getOptions()).resolves.toMatchObject({
      ...initialOptionsBool,
      [SHOW_ON_TIMELINE]: false,
    });
  });
});
