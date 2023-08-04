import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import * as components from './DynamicComponents';

const CodePreview = ({ code }: any) => {
    const getScope = () => {
        return { React, ...components };
    };

    return (
        <LiveProvider
            code={code}
            enableTypeScript
            language="tsx"
            //   noInline
            scope={getScope()}
        >
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <LiveEditor language="typescript" />
                    <LiveError />
                </div>
                <div style={{ flex: 1 }}>
                    <LivePreview />
                </div>
            </div>
        </LiveProvider>
    );
};

export default CodePreview;
