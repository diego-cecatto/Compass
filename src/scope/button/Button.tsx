import React from 'react';

interface ButtonProps {
    name: string;
}

export const Button = ({ name }: ButtonProps) => {
    return (
        <div>
            <p>Button works!</p>
        </div>
    );
};
