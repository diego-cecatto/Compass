import React, { useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';

import MonacoEditor from 'react-monaco-editor';

export const setupMonaco = () => {
    // // Initialize TypeScript language support
    // monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    //     target: monaco.languages.typescript.ScriptTarget.ES2015,
    //     module: monaco.languages.typescript.ModuleKind.CommonJS,
    //     allowNonTsExtensions: true,
    //     jsx: monaco.languages.typescript.JsxEmit.React,
    //     reactNamespace: 'React',
    // });
    // // Initialize JavaScript language support
    // monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    //     target: monaco.languages.typescript.ScriptTarget.ES2015,
    //     allowNonTsExtensions: true,
    //     jsx: monaco.languages.typescript.JsxEmit.React,
    //     reactNamespace: 'React',
    // });
    // // Enable TypeScript and JavaScript features
    // monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    //     noSemanticValidation: false,
    //     noSyntaxValidation: false,
    // });
    // monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    //     noSemanticValidation: false,
    //     noSyntaxValidation: false,
    // });
};

interface LiveEditorProps {
    component: any;
    onChange?: (newValue: string) => void;
}

export const LiveEditor: React.FC<LiveEditorProps> = ({
    component,
    onChange,
}) => {
    const handleEditorChange = (newValue: string) => {
        onChange && onChange(newValue);
    };
    const code = `export const Button = () => {
      const [count, setCount] = React.useState(0);
  
      return (
        <button onClick={() => setCount(count + 1)}>
          Click me ({count})
        </button>
      );
    };`;

    // useEffect(() => {
    //     setupMonaco(); // Call the setupMonaco function once before rendering the editor
    // }, []);

    return (
        <>
            <MonacoEditor
                width="100%"
                height="400px"
                language="typescript"
                theme="vs-dark" // Use 'vs-light' for a light theme
                value={code}
                options={{
                    minimap: {
                        enabled: false,
                    },
                    scrollBeyondLastLine: false,
                }}
                onChange={handleEditorChange}
            />
            <div>
                <h2>Live Preview</h2>
                <div>
                    <pre>{code}</pre>
                </div>
            </div>
        </>
    );
};
