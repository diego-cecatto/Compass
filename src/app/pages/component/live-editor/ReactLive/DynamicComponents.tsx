// dynamicComponents.ts

import fs from 'fs';
import path from 'path';

// The folder path containing the dynamically created components
const componentsFolderPath = './../../../../../../scope';

// Get the list of files in the folder
const files = fs.readdirSync(componentsFolderPath);

// Initialize an empty object to store the components
const components: { [key: string]: React.FC } = {};

// Dynamically import and store each component
files.forEach((file) => {
    if (file.endsWith('.tsx')) {
        const componentName = path.basename(file, '.tsx');
        const componentModule = require(path.join(componentsFolderPath, file));
        components[componentName] = componentModule.default || componentModule;
    }
});

// Export all dynamically imported components
export default components;
