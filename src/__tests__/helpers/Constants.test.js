import {
  OPTION_UPDATED,
  GET_LOCAL_STORAGE,
  HOST_TWITTER_COM,
  SHOW_ON_TIMELINE,
  SHOW_ON_TWEET_DETAIL,
  HOST_TWEETDECK_TWITTER_COM,
  SHOW_ON_TWEETDECK_TIMELINE,
  SHOW_ON_TWEETDECK_TWEET_DETAIL,
  HOST_PBS_TWIMG_COM,
  STRIP_IMAGE_SUFFIX,
  isTrue,
  isFalse,
  INITIAL_OPTIONS,
  OPTIONS_TEXT,
} from '../../helpers/Constants';

describe('定数', () => {
  it('設定取得メッセージ', () => {
    expect(OPTION_UPDATED).toBe('OPTION_UPDATED');
    expect(GET_LOCAL_STORAGE).toBe('GET_LOCAL_STORAGE');
  });

  it('公式Web', () => {
    expect(HOST_TWITTER_COM).toBe('twitter.com');
    expect(SHOW_ON_TIMELINE).toBe('SHOW_ON_TIMELINE');
    expect(SHOW_ON_TWEET_DETAIL).toBe('SHOW_ON_TWEET_DETAIL');
  });
  it('TweetDeck', () => {
    expect(HOST_TWEETDECK_TWITTER_COM).toBe('tweetdeck.twitter.com');
    expect(SHOW_ON_TWEETDECK_TIMELINE).toBe('SHOW_ON_TWEETDECK_TIMELINE');
    expect(SHOW_ON_TWEETDECK_TWEET_DETAIL).toBe(
      'SHOW_ON_TWEETDECK_TWEET_DETAIL'
    );
  });
  it('画像ページ', () => {
    expect(HOST_PBS_TWIMG_COM).toBe('pbs.twimg.com');
    expect(STRIP_IMAGE_SUFFIX).toBe('STRIP_IMAGE_SUFFIX');
  });

  it('設定に使う真偽値', () => {
    expect(isTrue).toBe('istrue');
    expect(isFalse).toBe('isfalse');
  });

  it('設定項目の初期値', () => {
    // 設定項目の初期値は「無効」(最初のボタン表示が早過ぎる/一旦表示すると消さないため)
    // 有効だった場合はDOMが変更される間に設定が読み込まれて有効になる
    // 無効だった場合はそのままボタンは表示されない
    expect(INITIAL_OPTIONS).toStrictEqual({
      // 公式Web
      SHOW_ON_TIMELINE: 'isfalse',
      SHOW_ON_TWEET_DETAIL: 'isfalse',
      // TweetDeck
      SHOW_ON_TWEETDECK_TIMELINE: 'isfalse',
      SHOW_ON_TWEETDECK_TWEET_DETAIL: 'isfalse',
      // 画像ページ
      STRIP_IMAGE_SUFFIX: 'isfalse',
    });
    expect(OPTIONS_TEXT).toStrictEqual({
      // 公式Web
      SHOW_ON_TIMELINE: 'タイムラインにボタンを表示',
      SHOW_ON_TWEET_DETAIL: 'ツイート詳細にボタンを表示',
      // TweetDeck
      SHOW_ON_TWEETDECK_TIMELINE: 'タイムラインにボタンを表示',
      SHOW_ON_TWEETDECK_TWEET_DETAIL: 'ツイート詳細にボタンを表示',
      // 画像ページ
      STRIP_IMAGE_SUFFIX: '[Ctrl]+[s]で拡張子を校正',
    });
  });
});
