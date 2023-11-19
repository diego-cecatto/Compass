import React, { useMemo, useRef, useState } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import * as Dependences from './component-dependences';
import { Button, Grid } from '@mui/material';
import './code-preview.scss';
export const CodePreview = ({
    component,
    code,
}: {
    component: any;
    code: any;
}) => {
    const [fullCode, setFullCode] = useState(false);
    const normalize = () => {
        var docCode: string = code.children.trim();
        var compCode = '';
        docCode.split('\n').forEach((line) => {
            if (line.indexOf('import') === -1) {
                compCode += line;
            }
        });
        return compCode.trim();
    };
    const [currCode, setCurrCode] = useState(normalize());
    const dependencies = (Dependences as any)[component.name];
    if (!dependencies) {
        return <div>Couldn`t process your component</div>;
    }

    const handleContentChange = (code: string) => {
        setCurrCode(code);
    };

    return (
        <>
            <LiveProvider
                code={currCode}
                scope={{
                    React,
                    [component.name]: dependencies,
                }}
                // noInline
                enableTypeScript
                language="tsx"
            >
                <Grid container id="code-area">
                    <Grid
                        item
                        xs={12}
                        className="top"
                        sx={{ paddingLeft: '16px' }}
                    >
                        {!fullCode ? (
                            <Button
                                variant="text"
                                className="button-area"
                                onClick={() => setFullCode(true)}
                            >
                                Full code
                            </Button>
                        ) : (
                            <Button
                                variant="text"
                                className="button-area"
                                onClick={() => setFullCode(false)}
                            >
                                Live Editor
                            </Button>
                        )}
                    </Grid>

                    {!fullCode ? (
                        <>
                            <Grid item sm={6} xs={12} className="editor-area">
                                <Button variant="text" className="button-inner">
                                    Copy
                                </Button>
                                <LiveEditor
                                    language="tsx"
                                    onChange={handleContentChange}
                                />
                            </Grid>
                            <Grid item sm={6} xs={12} className="preview-area">
                                <LivePreview language="tsx" />
                            </Grid>
                        </>
                    ) : (
                        <Grid item xs={12} className="full-code">
                            <Button variant="text" className="button-inner">
                                Copy
                            </Button>
                            <code>
                                {code.children
                                    .trim()
                                    .replace(normalize(), currCode)}
                            </code>
                        </Grid>
                    )}
                    <Grid item xs={12} className="error-area">
                        <LiveError />
                    </Grid>
                </Grid>
            </LiveProvider>
        </>
    );
};
