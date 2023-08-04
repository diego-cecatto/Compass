import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { transform } from '@babel/standalone';

type DynamicComponentType = React.FC<any>;
// const createDynamicComponent = async (code: string): Promise<React.FC> => {
//     const transformedCode = transform(code, { presets: ['react'] }).code;
//     const blob = new Blob([transformedCode!], { type: 'text/javascript' });
//     const blobURL = URL.createObjectURL(blob);

//     // Create a new script tag in the DOM to load the dynamic component code
//     const script = document.createElement('script');
//     script.type = 'module';
//     script.src = blobURL;
//     document.head.appendChild(script);

//     return new Promise<React.FC>((resolve, reject) => {
//         script.onload = () => {
//             // Assuming the dynamic component is exported as "default"
//             if ((window as any).Button) {
//                 resolve((window as any).Button);
//             } else {
//                 reject(new Error('Dynamic component not found'));
//             }
//             // Clean up the blob URL after loading
//             URL.revokeObjectURL(blobURL);
//         };

//         script.onerror = () => {
//             reject(new Error('Failed to load dynamic component'));
//             // Clean up the blob URL after loading
//             URL.revokeObjectURL(blobURL);
//         };
//     });
// };
export const CustomCodeBlock = (props: any) => {
    // const createDynamicComponent = async (code: string): Promise<React.FC> => {
    //     const transformedCode = transform(code, { presets: ['react'] }).code;

    //     try {
    //         const blob = new Blob([transformedCode!], {
    //             type: 'application/javascript',
    //         });
    //         const url = URL.createObjectURL(blob);

    //         // @ts-ignore
    //         const dynamicModule = await import(url);
    //         URL.revokeObjectURL(url);

    //         return dynamicModule.default as React.FC;
    //     } catch (error) {
    //         console.error('Error importing dynamic component:', error);
    //         return () => null; // Return a fallback component in case of an error
    //     }
    // };
    const createDynamicComponent = async (code: string): Promise<React.FC> => {
        const transformedCode = transform(code, { presets: ['react'] }).code;

        try {
            const blob = new Blob([transformedCode!], {
                type: 'application/javascript',
            });
            const url = URL.createObjectURL(blob);

            // @ts-ignore
            const dynamicModule = await import(url);
            URL.revokeObjectURL(url);

            return dynamicModule.default as React.FC;
        } catch (error) {
            console.error('Error importing dynamic component:', error);
            return () => null; // Return a fallback component in case of an error
        }
    };
    const getScope = () => {
        const code = `export const Button = () => {
          const [count, setCount] = React.useState(0);
      
          return (
            <button onClick={() => setCount(count + 1)}>
              Click me ({count})
            </button>
          );
        };`;

        // Transform the code using Babel standalone
        // const transformedCode = transform(code, {
        //     presets: ['react'],
        //     plugins: ['proposal-class-properties', 'proposal-private-methods'],
        // }).code;

        // const dynamicFunction = new Function('React', transformedCode!);
        createDynamicComponent(code).then((component) => {
            console.log(component);
        });

        // Execute the dynamic function to define the component
        // dynamicFunction(React);
        // console.log(dynamicFunction);
        return {
            React,
            // Button,
        };
    };

    const getCode = () => {
        var imports: any = {};
        var code: string = props.code.children[0].trim();
        code.split('\n').map((line) => {
            // if ('import')
        });
        return '<Button />';
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
