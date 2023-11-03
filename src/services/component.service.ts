import * as fs from 'fs';
import * as path from 'path';
import { Component } from './../models/Component.model';
const CACHE_FILE_PATH = './components.cache';
import * as dotenv from 'dotenv';
//@ts-ignore
import { Documentation } from 'react-docgen';
dotenv.config();

//todo ignore composition file
//todo create tests repository

export class ComponentService {
    reactDocGen: any;
    loading: any;
    constructor() {
        this.loading = new Promise((resolve) => {
            import('react-docgen').then((reactDocGen) => {
                this.reactDocGen = reactDocGen;
                resolve(true);
            });
        });
    }

    public async getComponents(path?: string) {
        await this.loading;
        if (!path) {
            path = process.env.SCOPE!;
        }
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
        await this.loading;
        var code = fs.readFileSync(path.resolve(componentPath), 'utf8');
        const parsedComponents: Documentation[] = this.reactDocGen.parse(code, {
            fileName: path.resolve(componentPath),
            handlers: [
                ...this.reactDocGen.defaultHandlers,
                (documentation: any, path: any) => {
                    this.codeTypeHandler(documentation, path);
                },
            ],
        });

        const COMPONENT_NAME = path.basename(
            componentPath,
            path.extname(componentPath)
        );
        const parsedComponent = parsedComponents.find(
            (component) => component.displayName === COMPONENT_NAME
        );
        let component: Component = {
            name: COMPONENT_NAME,
            path: componentPath,
            fullPath: path.resolve(componentPath),
            dependencies: [],
            description: parsedComponent?.description,
            props: parsedComponent?.props,
        };

        return component;
    }

    private propSingleComment(path: any, documentation: any, propName: any) {
        if (path.node.leadingComments) {
            const propDescriptor = documentation.getPropDescriptor(propName);
            if (propDescriptor.description) return;
            propDescriptor.description =
                path.node.leadingComments[0].value || '';
        }
    }

    private codeTypeHandler(documentation: any, componentDefinition: any) {
        const typePaths =
            this.reactDocGen.utils.getTypeFromReactComponent(
                componentDefinition
            );
        if (typePaths.length === 0) {
            return;
        }
        for (const typePath of typePaths) {
            this.reactDocGen.utils.applyToTypeProperties(
                documentation,
                typePath,
                (propertyPath: any, typeParams: any) => {
                    this.setPropDescriptor(
                        documentation,
                        propertyPath,
                        typeParams
                    );
                },
                null
            );
        }
    }

    private setPropDescriptor(documentation: any, path: any, typeParams: any) {
        if (path.isObjectTypeSpreadProperty()) {
            const argument: any =
                this.reactDocGen.utils.flowUtilityTypes.unwrapUtilityType(
                    path.get('argument')
                );
            if (argument.isObjectTypeAnnotation()) {
                // // applyToTypeProperties(
                // //   documentation,
                // //   argument,
                // //   (propertyPath, innerTypeParams) => {
                // //     setPropDescriptor(documentation, propertyPath, innerTypeParams);
                // //   },
                // //   typeParams
                // // );
                return;
            }
            const id = argument.get('id');
            if (!id.hasNode() || !id.isIdentifier()) {
                return;
            }
            // const resolvedPath = resolveToValue(id);
            // if (resolvedPath.isTypeAlias()) {
            //   const right = resolvedPath.get("right");
            //   // applyToTypeProperties(
            //   //   documentation,
            //   //   right,
            //   //   (propertyPath, innerTypeParams) => {
            //   //     setPropDescriptor(documentation, propertyPath, innerTypeParams);
            //   //   },
            //   //   typeParams
            //   // );
            // } else if (!argument.has("typeParameters")) {
            //   documentation.addComposes(id.node.name);
            // }
        } else if (
            path.isObjectTypeProperty() ||
            path.isTSPropertySignature()
        ) {
            const propName = this.reactDocGen.utils.getPropertyName(path);
            if (!propName) return;
            this.propSingleComment(path, documentation, propName);
        }
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
}
