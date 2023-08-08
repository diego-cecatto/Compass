import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import * as Dependences from './component.dependences';

export const CodePreview = (props: any) => {
    const getScope = () => {
        return {
            React,
            [props.name]: (Dependences as any)[props.name],
        };
    };

    const getCode = () => {
        var code: string = props.code.children[0].trim();
        code.split('\n').map((line) => {
            // if ('import')
        });
        return code;
    };

    return (
        <>
            <LiveProvider
                code={getCode()}
                scope={getScope()}
                // noInline
                enableTypeScript
                language="tsx"
            >
                <LiveEditor language="tsx" />
                <LiveError />
                <LivePreview language="tsx" />
            </LiveProvider>
        </>
    );
};
