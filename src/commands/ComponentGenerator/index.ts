import fs from 'fs';
import path from 'path';
import camelcase from 'camelcase';
import * as changeCase from 'change-case';

interface ComponentGeneratorOptions {
    name: string;
    overwrite?: boolean;
}

export class ComponentGenerator {
    static generateComponent(options: ComponentGeneratorOptions): void {
        const { name, overwrite = false } = options;
        const componentName = changeCase.pascalCase(
            camelcase(name.replace('-', '_'))
        );
        const componentDir = path.join(
            process.cwd(),
            'src',
            'components',
            componentName
        );

        if (fs.existsSync(componentDir) && !overwrite) {
            console.error(`Component ${componentName} already exists`);
            return;
        }

        console.log(`Creating component ${componentName}...`);

        fs.rmdirSync(componentDir, { recursive: true });
        fs.mkdirSync(componentDir);

        //todo get template folder
        //todo default template folder by env

        const templateFiles = ['component.tsx', 'spec.ts', 'docs.mdx'];
        templateFiles.forEach((fileName) => {
            const template = fs.readFileSync(
                path.join(__dirname, 'templates', fileName),
                'utf8'
            );

            const outputFile = fileName.replace('component', componentName);
            const outputFilePath = path.join(componentDir, outputFile);

            const outputContent = template.replace(
                /__COMPONENT_NAME__/g,
                componentName
            );

            fs.writeFileSync(outputFilePath, outputContent);
            console.log(`Created file ${outputFilePath}`);
        });

        console.log(`Component ${componentName} created successfully`);
    }
}
