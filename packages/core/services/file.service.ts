import fs from 'fs';
import path from 'path';

export class FileService {
    static readFile(filePath: string): string {
        return fs.readFileSync(filePath, 'utf-8');
    }

    static writeFile(filePath: string, content: string): void {
        const dir = path.dirname(filePath);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filePath, content);
    }
}

export class ComponentsFile {
    static readComponents(componentsPath: string): Record<string, string> {
        const components: Record<string, string> = {};

        fs.readdirSync(componentsPath).forEach((file) => {
            if (path.extname(file) === '.tsx') {
                const componentName = path.basename(file, '.tsx');
                const componentPath = path.join(componentsPath, file);
                const content = FileService.readFile(componentPath);
                components[componentName] = content;
            }
        });

        return components;
    }
}
