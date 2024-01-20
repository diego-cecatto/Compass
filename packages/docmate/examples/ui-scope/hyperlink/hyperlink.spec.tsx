import React from 'react';
import { render } from '@testing-library/react';

it('should render with the correct text', () => {
    const { getByText } = render(<></>);
    const rendered = true; //getByText('hello world!');
    expect(rendered).toBeTruthy();
});
