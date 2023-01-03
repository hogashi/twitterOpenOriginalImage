import { initialOptions, SHOW_ON_TIMELINE, isFalse } from '../src/constants';
import { getOptions } from '../src/options';

let storageOptions = {};
chrome.storage.sync.get = jest.fn(() => storageOptions);

describe('設定とってくるヘルパ', () => {
  it('最初は初期値', () => {
    expect(getOptions()).resolves.toMatchObject(initialOptions);
  });
  it('設定入れるとそれが入ってる', () => {
    storageOptions = { [SHOW_ON_TIMELINE]: isFalse };
    expect(getOptions()).resolves.toMatchObject({
      ...initialOptions,
      [SHOW_ON_TIMELINE]: isFalse,
    });
  });
});
