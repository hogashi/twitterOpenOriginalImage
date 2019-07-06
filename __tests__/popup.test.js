import * as React from 'react';
import renderer from 'react-test-renderer';

import { OPTIONS_TEXT, INITIAL_OPTIONS } from '../src/helpers/Constants';
import { Popup } from '../src/popup';

describe('Popup', () => {
  it('render', () => {
    const optionsText = OPTIONS_TEXT;
    const optionKeys = Object.keys(INITIAL_OPTIONS);
    const optionsEnabled = INITIAL_OPTIONS;

    const props = {
      optionsText,
      optionKeys,
      optionsEnabled,
    };

    window.chrome = {
      tabs: {
        query: jest.fn(),
        sendMessage: jest.fn(),
      },
    };
    const tree = renderer.create(<Popup {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
