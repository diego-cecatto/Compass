import React, { useState } from 'react';
import LiveEditor from './LiveEditor';
import DynamicComponentRegistry from './DynamicComponentRegistry';

const CodePreview: React.FC = () => {
    const [code, setCode] = useState<string>(
        `import React from 'react';\n\nexport const MyDynamicComponent = () => {\n  return <h1>Hello, Dynamic Component!</h1>;\n};`
    );

    return (
        <div>
            <h1>Live Editor</h1>
            <LiveEditor value={code} />
        </div>
    );
};

export default CodePreview;
