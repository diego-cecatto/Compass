// import CircularProgress from '@mui/material/CircularProgress';
// import ReactMarkdown from 'react-markdown';
// import { useQuery } from '@apollo/client';
// import { DocumentationAction } from '../../actions/documentation.action';
// import { useEffect } from 'react';
// import { ComponentProperties } from './component.properties';
// import './component.scss';
// import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
// import rehypeReact from 'rehype-react';
// import React from 'react';
// import { renderToStaticMarkup } from 'react-dom/server';
// import { unified } from 'unified';
// import rehypeParse from 'rehype-parse';
import React, { useEffect } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { renderToStaticMarkup } from 'react-dom/server';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import { useQuery } from '@apollo/client';
import { DocumentationAction } from '../../actions/documentation.action';
import { CircularProgress } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { ComponentProperties } from './component.properties';
import { Button } from '../../../scope/button/Button';

declare type ComponentDetailsProps = {
    component: any;
};

// const CodeBlock = ({ children, live }: any) => {
//     if (live) {
//         return (
//             <LiveProvider code={children}>
//                 <LiveEditor />
//                 <LiveError />
//                 <LivePreview />
//             </LiveProvider>
//         );
//     }

//     // Fallback to regular code block rendering
//     return <code>{children}</code>;
// };

// const CustomCodeBlock = ({ children }: any) => {
//     // Extract the language and code from children
//     const [language, code] = (
//         children.match(/live(.*)\n([\s\S]*?)\n?$/) || []
//     ).slice(1);

//     if (language === 'tsx') {
//         return (
//             <LiveProvider code={code.trim()} scope={{ React }}>
//                 <LiveEditor />
//                 <LiveError />
//                 <LivePreview />
//             </LiveProvider>
//         );
//     }

//     // Fallback to default rendering for non-live code blocks
//     return <pre>{children}</pre>;
// };

const markdownContent = `
# Live Code Example

You can use live code examples in your Markdown content:

\`\`\`jsx live
const Button = () => {
  const [count, setCount] = React.useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Click me ({count})
    </button>
  );
};
\`\`\`

The component above is a simple button that updates a count on each click.
`;
// const MarkdownComponent = () => {
//     const renderers = {
//         code: CustomCodeBlock,
//     };

//     const renderMarkdown = (content: any) => {
//         // Use unified to parse the HTML from ReactMarkdown
//         const result = unified()
//             .use(rehypeParse)
//             .use(rehypeReact, {
//                 createElement: React.createElement,
//                 components: renderers,
//             })
//             .processSync(content);

//         // Render the result as static markup to prevent React from rehydrating
//         return renderToStaticMarkup(result.result);
//     };
//     return (
//         <div>
//             <div
//                 dangerouslySetInnerHTML={{
//                     __html: renderMarkdown(markdownContent),
//                 }}
//             />
//         </div>
//     );
// };

// export default MarkdownComponent;

export const ComponentDetails = ({ component }: ComponentDetailsProps) => {
    const { loading, error, data, refetch } = useQuery(
        DocumentationAction.getDocumentation(),
        {
            variables: { path: component?.path },
        }
    );

    useEffect(() => {
        refetch({ path: component?.path });
    }, [component?.path]);

    const renderers = {
        code: (props: any) => {
            console.log(props.children[0].trim());
            // if (language === 'jsx' && value.includes('live')) {
            //     console.log(`ddfsjhsdfkjhkdsfhdsfkjhkj`);
            return (
                <LiveProvider
                    code={props.children[0].trim()}
                    scope={{ React, Button }}
                >
                    <LiveEditor />
                    <LiveError />
                    <LivePreview />
                </LiveProvider>
            );
        },
        // console.log(language, value, 'asdsadadsadasdsaadssad');
        // // Fallback to default rendering for non-live code blocks
        // return <pre>{value}</pre>;
        // return <div></div>;
        // },
    };

    return (
        <>
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    <div>
                        <ReactMarkdown
                            // rehypePlugins={[rehypeReact]}
                            components={renderers}
                        >
                            {data?.documentation}
                        </ReactMarkdown>
                    </div>
                    <div>
                        <ComponentProperties component={component} />
                    </div>
                </>
            )}
        </>
    );
};
