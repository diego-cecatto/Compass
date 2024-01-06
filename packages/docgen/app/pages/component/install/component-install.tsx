import React from 'react';
import { Button } from '@mui/material';
import CopyContentIcon from '@mui/icons-material/ContentCopy';

declare type ComponentInstallProps = {
    name: string;
};

export const ComponentInstall = ({ name }: ComponentInstallProps) => {
    const code = `npm i --save-dev ${name}`;
    const handleCopyClick = () => {
        navigator.clipboard.writeText(code);
    };

    return (
        <>
            <span className="command">{code}</span>
            <Button onClick={() => handleCopyClick} variant="text">
                <CopyContentIcon sx={{ width: '17px' }} />
            </Button>
        </>
    );
};
