import React from 'react';
import { render } from '@testing-library/react';

import { Breadcrumb } from './Breadcrumb';

describe('Breadcrumb test', () => {
    it('renders the component', () => {
        const { getByText } = render(<Breadcrumb />);
        const text = getByText('Breadcrumb works!');
        expect(text).toBeTruthy();
    });
});
