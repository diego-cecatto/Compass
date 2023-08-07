import * as fs from 'fs';
import * as path from 'path';
import { Component, Property } from './../models/component.model';
import {
    Project,
    SourceFile,
    SyntaxKind,
    VariableDeclaration,
    TypeReferenceNode,
    ClassDeclaration,
    InterfaceDeclaration,
    TypeAliasDeclaration,
    PropertySignature,
} from 'ts-morph';
const CACHE_FILE_PATH = './components_cache.json';

//! could have a pre parsed response with json or can retry unsing long life cycle with cache
//todo ignore composition file
//todo validate all steps to be sure that information is correct
//todo create tests repository

export class ComponentService {
    // cache: Record<string, CachedComponent> = {};
    // constructor() {
    //     this.getCache();
    // }

    // public getCache() {
    //     this.cache = JSON.parse(fs.readFileSync('./'));
    // }

    public async getComponents(path: string) {
        var files = await fs.promises.readdir(path);
        var components: Component[] = [];
        const cache = await this.readCache();

        await Promise.all(
            files.map(async (file) => {
                var currPath = path + '/' + file;
                //todo pass ahead this var
                var fileStat = await fs.promises.stat(currPath);
                if (fileStat.isDirectory()) {
                    const subComponents = await this.getComponents(currPath);
                    components.push(...subComponents);
                } else {
                    //!!! todo filter only path
                    //path of componnet
                    //index.ts
                    //or index.tsx
                    //another subcomponent
                    //another-subcomponent.tsx
                    //todo ignore others functions not related to this path
                    if (
                        currPath.indexOf('.spec') === -1 &&
                        currPath.indexOf('doc') === -1
                    ) {
                        const lastModified = fileStat.mtimeMs;
                        let component = cache.components[currPath];
                        if (
                            !component ||
                            !cache?.date ||
                            cache.date < lastModified
                        ) {
                            component = await this.getComponent(currPath);
                            cache.components[currPath] = component;
                            // Update the cache file.
                            this.writeCache(cache.components);
                        }
                        if (component) {
                            components.push(component);
                        }
                    }
                }
            })
        );
        return components;
    }

    public async getComponent(
        componentPath: string
    ): Promise<Component | null> {
        const fileStat = await fs.promises.stat(componentPath);
        // const lastModified = fileStat.mtimeMs;
        // if (
        //     componentPath in componentsCache &&
        //     componentsCache[componentPath].lastModified === lastModified
        // ) {
        //     return componentsCache[componentPath].component;
        // }
        let component: Component = {
            name: path.basename(componentPath, path.extname(componentPath)),
            path: componentPath,
            dependencies: [],
            prop: {
                name: 'any',
            },
        };
        //todo extract component
        this.extractComponentDeclaration(component);
        //todo save cache
        return component;
    }

    private writeCache(cache: Record<string, Component>) {
        fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cache), 'utf-8');
    }

    private async readCache() {
        try {
            const cacheContent = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
            var fileStat = await fs.promises.stat(CACHE_FILE_PATH);
            return {
                components: JSON.parse(cacheContent) ?? {},
                date: fileStat.mtimeMs,
            };
        } catch (error) {
            // Return an empty object if the cache file doesn't exist or is not valid JSON.
            return { components: {} };
        }
    }

    public async getDocumentation(path: string) {
        if (!path) {
            return null;
        }
        return fs.readFileSync(
            './' + path.replace('tsx', '') + 'doc.md',
            'utf-8'
        );
    }

    //todo test multi-levels
    //todo teste multi export
    //todo retrieve default values
    extractComponentDeclaration(component: Component) {
        const project = new Project({
            tsConfigFilePath: path.resolve(process.cwd(), 'tsconfig.json'),
        });
        const source = project.getSourceFile(
            path.resolve(process.cwd(), component.path)
        );
        if (!source) {
            return false;
        }
        let propertyName: string = '';
        source.getExportedDeclarations().forEach((exportedDeclaration) => {
            var exported = exportedDeclaration[0];
            const kindOfComponent = exported.getKind();
            if (kindOfComponent == SyntaxKind.VariableDeclaration) {
                if (
                    (exported as VariableDeclaration).getName() !=
                    component.name
                ) {
                    return;
                }
                propertyName = this.getArrowFunctionProperty(
                    exported as VariableDeclaration
                );
            } else if (kindOfComponent == SyntaxKind.ClassDeclaration) {
                if (
                    (exported as ClassDeclaration).getName() != component.name
                ) {
                    return;
                }
                propertyName = this.getClassPropType(
                    exported as ClassDeclaration
                );
            }
        });
        component.prop.name = propertyName;
        component.prop.properties = this.getPropDeclaration(
            propertyName,
            source
        );
    }

    getPropDeclaration(propName: string, source: SourceFile) {
        let propDeclaration:
            | InterfaceDeclaration
            | undefined
            | TypeAliasDeclaration = source.getInterface(propName);
        var properties: Property[] = [];
        var props: PropertySignature[] | undefined = undefined;
        if (!propDeclaration) {
            propDeclaration = source.getTypeAlias(propName);
            if (propDeclaration) {
                // throw `declaration of property ${propName} not found`;
                props = (
                    (
                        propDeclaration as TypeAliasDeclaration
                    ).getTypeNode() as any
                )?.getProperties();
            }
        } else {
            if (propDeclaration) {
                props = (
                    propDeclaration as InterfaceDeclaration
                )?.getProperties();
            }
        }

        if (!props) {
            source.getTypeAlias(propName);
            throw `Not found type for ${propName}`;
        }
        props.forEach((prop) => {
            const sibling = prop.getPreviousSibling();
            var structureProp = prop.getStructure();
            var property: Property = {
                name: structureProp.name,
                type: structureProp.type?.toString() ?? 'any',
            };
            if (sibling?.getKind() === SyntaxKind.SingleLineCommentTrivia) {
                var comment = sibling.getText();
                comment = comment.substring(2);
                if (comment.at(-1) === '/') {
                    comment = comment.substring(0, comment.length - 2);
                }
                property.description = comment;
            }
            properties.push(property);
        });
        return properties;
    }

    getClassPropType(declaration: ClassDeclaration) {
        //todo I can get by this the property details ???
        //defaults

        return declaration
            .getHeritageClauses()[0]
            .getTypeNodes()[0]
            .getTypeArguments()[0]
            .getText();
    }

    getArrowFunctionProperty(exported: VariableDeclaration) {
        //todo verify without any property
        var fInitializer: any = exported.getInitializer();
        //todo find props property or if have only one and what is the right value
        var structure = fInitializer.getStructure();
        var propTypeName = structure.parameters[0].type;
        if (!propTypeName) {
            //todo try get const type
            propTypeName = (
                (exported!.getTypeNode() as TypeReferenceNode)!.getTypeArguments()[0] as TypeReferenceNode
            )
                .getTypeName()
                .getText();
        }
        return propTypeName;
    }
}
