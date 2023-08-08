import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import * as Dependences from './component.dependences';

export const CodePreview = ({
    component,
    code,
}: {
    component: any;
    code: any;
}) => {
    const getScope = () => {
        return {
            React,
            [component.name]: (Dependences as any)[component.name],
        };
    };

    const getCode = () => {
        var docCode: string = code.children[0].trim();
        var compCode = '';
        docCode.split('\n').forEach((line) => {
            if (line.indexOf('import') === -1) {
                compCode += line;
            }
        });
        return compCode.trim();
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
