import * as fs from 'fs';
import * as reactDocgenTypescript from 'react-docgen-typescript';
import * as path from 'path';
import { Component, Dependencies, Prop } from '../models/component.model';
import { Project, PropertyDeclarationStructure, SyntaxKind } from 'ts-morph';

interface ComponentProperty {
    name: string;
    default: any;
}
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
                    //!!! todo filter only path
                    //good of father
                    //index.ts
                    //or index.tsx
                    //another subcomponent
                    //another-subcomponent.tsx
                    if (currPath.indexOf('.spec') === -1) {
                        var component = await this.getComponent(currPath);
                        if (component) {
                            components.push(component);
                        }
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
        this.parseFunctionalComponents(component);
        // componentsCache[componentPath] = { component, lastModified };
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

    extractComponentProperties(fileLocation: string): ComponentProperty[] {
        const project = new Project();
        const file = project.addSourceFileAtPath(fileLocation);

        const componentDeclaration = file.getFirstDescendant(
            (node: any) =>
                node.isVariableStatement() ||
                node.isFunctionDeclaration() ||
                node.isFunctionExpression()
        );

        const componentProperties: ComponentProperty[] = [];

        if (componentDeclaration) {
            componentDeclaration.forEachDescendant((node: any) => {
                if (node.isObjectLiteralExpression()) {
                    const properties = node.getProperties();

                    properties.forEach((property: any) => {
                        const name = property.getName();
                        const initializer = property.getInitializer();

                        let defaultValue: any = undefined;

                        if (initializer) {
                            if (initializer.isArrowFunction()) {
                                const defaultParam =
                                    initializer.getParameters()[0];
                                defaultValue = defaultParam
                                    ? defaultParam.getInitializer()
                                    : undefined;
                            } else {
                                defaultValue = initializer.getLiteralValue();
                            }
                        }

                        componentProperties.push({
                            name,
                            default: defaultValue,
                        });
                    });
                }
            });
        }

        return componentProperties;
    }

    extractComponentProperties2(filePath: string): ComponentProperty[] {
        const project = new Project();
        const sourceFile = project.addSourceFileAtPath(filePath);
        const properties: ComponentProperty[] = [];

        const defaultValues = sourceFile
            .getVariableStatements()
            .flatMap((statement) => statement.getDeclarations())
            .filter(
                (declaration) =>
                    declaration.getKind() === SyntaxKind.VariableDeclaration
            )
            .map((declaration) => {
                const initializer = declaration.getInitializer();
                return initializer ? initializer.getText() : undefined;
            });

        const variableDeclarations = sourceFile
            .getVariableDeclarations()
            .filter(
                (declaration) => declaration.getType().getText() === 'React.FC'
            );

        variableDeclarations.forEach((declaration) => {
            const bindingName = declaration.getName();
            const bindingInitializer = declaration.getInitializer();

            if (bindingInitializer) {
                const objectPattern = bindingInitializer.getFirstChildByKind(
                    SyntaxKind.ObjectBindingPattern
                );

                if (objectPattern) {
                    objectPattern
                        .getChildrenOfKind(SyntaxKind.BindingElement)
                        .forEach((bindingElement) => {
                            const propertyName = bindingElement
                                .getNameNode()
                                .getText();
                            const defaultValue = defaultValues.find(
                                (value: any) =>
                                    value.includes(
                                        `${bindingName}.${propertyName}`
                                    )
                            );

                            properties.push({
                                name: propertyName,
                                default: defaultValue,
                            });
                        });
                }
            }
        });

        return properties;
    }

    getPropertiesFromComponentFile(
        filePath: string
    ): reactDocgenTypescript.ComponentDoc | undefined {
        try {
            const parser = reactDocgenTypescript.withCustomConfig(
                './tsconfig.json',
                {
                    propFilter: (prop) => !prop.parent,
                }
            );
            const componentInfo = parser.parse(filePath);
            return componentInfo[0];
        } catch (error) {
            console.error(`Error parsing component file: ${filePath}`, error);
            return undefined;
        }
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

    //todo query component function at first
    public parseFunctionalComponentsAtVar(component: Component) {}

    public parseFunctionalComponents(component: Component) {
        const project = new Project({
            tsConfigFilePath: path.resolve(process.cwd(), 'tsconfig.json'),
        });
        const source = project.getSourceFile(component.path);

        const components = source?.getFunctions().filter((declaration) => {
            const name = declaration.getName();
            if (!name) {
                return false;
            }
            const isComponent = name[0] === name[0].toUpperCase();
            return isComponent && declaration.hasExportKeyword();
        });

        const docs = components?.map((declaration) => {
            const [props] = declaration.getParameters();
            const type = props.getType();
            const typeProps = type.getProperties().map((prop) => {
                const [propDeclaration] = prop.getDeclarations();
                const [commentRange] =
                    propDeclaration.getLeadingCommentRanges();
                return {
                    name: prop.getName(),
                    type: prop.getTypeAtLocation(declaration).getText(),
                    comment: commentRange.getText(),
                };
            });
            return {
                name: declaration.getName(),
                typeProps,
            };
        });
        return docs;
    }
}
