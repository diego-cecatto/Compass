import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import * as Dependences from './component-dependences';

export const CodePreview = ({
    component,
    code,
}: {
    component: any;
    code: any;
}) => {
    const getCode = () => {
        var docCode: string = code.children.trim();
        var compCode = '';
        docCode.split('\n').forEach((line) => {
            if (line.indexOf('import') === -1) {
                compCode += line;
            }
        });
        return compCode.trim();
    };
    const dependencies = (Dependences as any)[component.name];
    if (!dependencies) {
        return <div>Component not found</div>;
    }

    return (
        <>
            <LiveProvider
                code={getCode()}
                scope={{
                    React,
                    [component.name]: dependencies,
                }}
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
