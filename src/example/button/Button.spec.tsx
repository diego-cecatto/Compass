import React from 'react';
import { render } from '@testing-library/react';

import { Button } from './Button';

describe('Button test', () => {
    it('renders the component', () => {
        const { getByText } = render(<Button name="button name" />);
        const text = getByText('Button works!');
        expect(text).toBeTruthy();
    });
});
