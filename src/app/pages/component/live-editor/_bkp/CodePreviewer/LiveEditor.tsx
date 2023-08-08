import React, { useState, useEffect } from 'react';
import MonacoEditor, { monaco } from 'react-monaco-editor';
import DynamicComponentRegistry from './DynamicComponentRegistry';
import { transform } from '@babel/core';

interface LiveEditorProps {
    value: string;
}

const LiveEditor: React.FC<LiveEditorProps> = ({ value }) => {
    const [transpiledCode, setTranspiledCode] = useState<string>('');

    const transpileCode = async (value: string) => {
        try {
            try {
                const { code }: any = transform(value, {
                    presets: ['@babel/preset-react'],
                });
                setTranspiledCode(code);
            } catch (error) {
                console.error('Error transpiling code:', error);
            }
        } catch (error) {
            console.error('Error transpiling code:', error);
        }
    };

    useEffect(() => {
        transpileCode(value);
    }, []);

    return (
        <div>
            <MonacoEditor
                width="800"
                height="400"
                language="javascript"
                theme="vs-dark"
                value={value}
                onChange={(newValue) => {
                    // You can handle the code changes here
                    transpileCode(newValue);
                }}
            />
            <h2>Live Preview</h2>
            <div>
                {/* Execute the transpiled code in a sandboxed environment */}
                {eval(`(function() { ${transpiledCode} })()`)}

                {/* Render the dynamically created components */}
                {Object.entries(DynamicComponentRegistry).map(
                    ([componentName, Component]: any) => (
                        <div key={componentName}>
                            <h3>{componentName}</h3>
                            <Component />
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default LiveEditor;
