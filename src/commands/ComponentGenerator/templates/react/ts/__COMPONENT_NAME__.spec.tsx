import React from 'react';
import { render } from '@testing-library/react';

import { __COMPONENT_NAME__ } from './__COMPONENT_NAME__';

describe('__COMPONENT_NAME__ test', () => {
    it('renders the component', () => {
        const { getByText } = render(<__COMPONENT_NAME__ />);
        const text = getByText('__COMPONENT_NAME__ works!');
        expect(text).toBeTruthy();
    });
});
