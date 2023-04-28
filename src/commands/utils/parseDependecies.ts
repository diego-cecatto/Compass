import fs from 'fs';
import path from 'path';
import {
    Component,
    Dependencies,
    Maybe,
} from './../../graphql/generated/graphql';

interface ComponentCacheEntry {
    components: Component[];
    lastModified: number;
}

const cache: { [dir: string]: ComponentCacheEntry } = {};

export function parseDependencies(componentDir: string): Component[] {
    const stat = fs.statSync(componentDir);

    // Check the cache to see if the components have already been parsed
    const cachedEntry = cache[componentDir];
    if (cachedEntry && cachedEntry.lastModified === stat.mtimeMs) {
        return cachedEntry.components;
    }

    const components: Component[] = [];

    // Read the component directory and iterate over each file
    fs.readdirSync(componentDir).forEach((file) => {
        const filePath = path.join(componentDir, file);

        // Check if the file is a TypeScript file and a React component
        if (path.extname(file) === '.tsx') {
            const componentName = path.basename(file, '.tsx');

            // Read the contents of the TypeScript file
            const contents = fs.readFileSync(filePath, 'utf8');

            // Extract the import statements from the TypeScript code
            const importStatements = contents.match(
                /import\s+{[^}]*}\s+from\s+['"]([^'"]+)['"]/g
            );

            // Extract the imported component names from the import statements
            // const dependencies = importStatements
            //     ?.map((importStatement) => {
            //         const match = importStatement.match(
            //             /import\s+{([^}]*)}\s+from\s+['"]([^'"]+)['"]/
            //         );
            //         if (match) {
            //             const componentNames = match[1]
            //                 .split(',')
            //                 .map((componentName) => componentName.trim());
            //             return componentNames;
            //         }
            //         return null;
            //     })
            //     ?.flat();

            var dependencies: Maybe<Dependencies>[] = [];
            // Create a new component object and add it to the list of components
            const component: Component = {
                name: componentName,
                path: filePath,
                dependencies: dependencies ?? [],
            };
            components.push(component);
        }
    });

    // Update the cache with the new components and last modified time
    cache[componentDir] = { components, lastModified: stat.mtimeMs };

    return components;
}
