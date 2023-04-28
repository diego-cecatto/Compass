import * as fs from 'fs';
import * as path from 'path';
import { Component, Dependencies, Prop } from './../models/component.model';

//! could have a pre parsed response with json or can retry unsing long life cy cle with cache
//todo ignore composition and test file

interface CachedComponent {
    component: Component;
    lastModified: number;
}

const componentsCache: Record<string, CachedComponent> = {};

export class ComponentService {
    public async getComponents(path: string) {
        var files = await fs.promises.readdir(path);
        var components: Component[] = [];
        await Promise.all(
            files.map(async (file) => {
                var currPath = path + '/' + file;
                //todo pass ahead this var
                var stat = await fs.promises.stat(currPath);
                if (stat.isDirectory()) {
                    const subComponents = await this.getComponents(currPath);
                    components.push(...subComponents);
                } else {
                    var component = await this.getComponent(currPath);
                    if (component) {
                        components.push(component);
                    }
                }
            })
        );
        console.log(components);
        return components;
    }

    // public async parseComponents(): Promise<void> {
    //     const fileService = new FileService();
    //     // read all component files in the components folder
    //     const componentFiles = await fileService.readDirectory(
    //         './src/components'
    //     );
    //     // parse the components and their dependencies
    //     this.components = await Promise.all(
    //         componentFiles.map(async (file) => {
    //             const filePath = `./src/components/${file}`;
    //             const componentName = file.split('.')[0];
    //             const componentContent = await fileService.readFile(filePath);
    //             //todo read folders and sub-folders
    //             return new Component(componentName, componentContent);
    //         })
    //     );
    // }

    public async getComponent(
        componentPath: string
    ): Promise<Component | null> {
        //todo ignore test files
        //todo ignore if not a tsx file
        const fileStat = await fs.promises.stat(componentPath);
        const lastModified = fileStat.mtimeMs;
        if (
            componentPath in componentsCache &&
            componentsCache[componentPath].lastModified === lastModified
        ) {
            return componentsCache[componentPath].component;
        }
        let component: Component = {
            name: path.basename(componentPath, path.extname(componentPath)),
            path: componentPath,
            dependencies: [],
            props: [],
        };

        var fileContent = await fs.promises.readFile(componentPath, 'utf8');
        const lines = fileContent.split('\n');
        component.dependencies = this.getDependencies(lines, componentPath);
        component.props = this.getProperties(lines);
        componentsCache[componentPath] = { component, lastModified };
        return component;
    }

    public getDependencies(
        lines: string[],
        componentPath: string
    ): Dependencies[] {
        //todo verify if is an internal import or a lib
        const dependencies: Dependencies[] = [];
        for (const line of lines) {
            const matches = line.match(
                /import\s+{[\s\S]*}\s+from\s+['"](.*)['"]/
            );
            if (matches) {
                const dependencyPath = path.resolve(
                    path.dirname(componentPath),
                    matches[1]
                );
                if (fs.existsSync(dependencyPath)) {
                    dependencies.push({
                        name: dependencyPath,
                        scoped: false,
                        lib: false,
                    });
                }
            }
        }
        return dependencies;
    }

    public getProperties(lines: string[]) {
        //todo get property and his description
        var props: Prop[] = [];
        const propTypesIndex = lines.findIndex((line) =>
            line.includes('PropTypes')
        );
        if (propTypesIndex === -1) {
            return props;
        }
        const propsStartIndex = lines.findIndex(
            (line, index) => index > propTypesIndex && line.includes('{')
        );
        const propsEndIndex = lines.findIndex(
            (line, index) => index > propsStartIndex && line.includes('}')
        );

        if (propsStartIndex !== -1 && propsEndIndex !== -1) {
            const propsContent = lines
                .slice(propsStartIndex + 1, propsEndIndex)
                .join('\n');
            const propsRegex = /(\w+)\s*:\s*(.*),?\s*$/gm;
            let matches;
            while ((matches = propsRegex.exec(propsContent)) !== null) {
                const [_, name, type] = matches;
                props.push({ name, type });
            }
        }
    }
}
