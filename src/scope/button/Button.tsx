import React from 'react';

interface ButtonProps {
    //this property is a name
    name: string;
}

export const Button = ({ name }: ButtonProps) => {
    return (
        <div>
            <p>Button works!</p>
        </div>
    );
};
