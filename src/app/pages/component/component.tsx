import React, { useEffect, useState } from 'react';
import { readFile } from 'fs';
import ReactMarkdown from 'react-markdown';

const markdownContent = `
## This is a Markdown Heading

This is a paragraph of text in **bold** and _italic_.

1. List item 1
2. List item 2

\`\`\`jsx
// This is a code block
const exampleFunction = () => {
  return 'Hello, Markdown!';
};
\`\`\`
`;

export const ComponentDetails = () => {
    const [content, setContent] = useState<string | null>(null);
    useEffect(() => {
        // readFile('./scope/button/Button.doc.md', (fileContent) => {
        //     // setContent(fileContent);
        //     console.log(fileContent);
        // });
    }, []);
    return (
        <>
            {!content ? null : (
                <div>
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            )}
        </>
    );
};
