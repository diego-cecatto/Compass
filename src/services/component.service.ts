import * as fs from 'fs';
import * as path from 'path';
import { Component } from '../models/Component.model';
const CACHE_FILE_PATH = './components.cache';
import * as dotenv from 'dotenv';
//@ts-ignore
import { Documentation } from 'react-docgen';
import { AppConfig, Config, DEF_CONFIG } from '../utils/Config';
dotenv.config();

//todo ignore composition file
//todo create tests repository

export class ComponentService {
    reactDocGen: any;
    config: AppConfig = DEF_CONFIG;
    loading: any;
    constructor() {
        this.loading = new Promise((resolve) => {
            import('react-docgen').then((reactDocGen) => {
                this.reactDocGen = reactDocGen;
                Config.read().then((config) => {
                    this.config = config;
                    resolve(true);
                });
            });
        });
    }

    public async getComponents(componentPath?: string, componentName?: string) {
        await this.loading;
        if (!componentPath) {
            componentPath = this.config.dir;
        }
        //todo if folder name is hooks not do parse
        //todo build a parser for hooks
        var components: Component[] = [];
        if (
            path.basename(componentPath).indexOf('use-') === 0 ||
            path.basename(componentPath) === 'hooks'
        ) {
            return components;
        }
        const packageJSONName = path.resolve(componentPath, 'package.json');
        if (fs.existsSync(packageJSONName)) {
            const packageJson = fs.readFileSync(packageJSONName, 'utf-8');

            if (packageJson) {
                //todo extract name from package.json data
                const packageParsed = JSON.parse(packageJson);
                componentName = packageParsed.name;
            }
        }

        var files = await fs.promises.readdir(componentPath);
        let mdFileLocation = '';

        files.every((file) => {
            if (file.toLowerCase().indexOf('.doc.md') !== -1) {
                mdFileLocation = file;
                return false;
            }
        });
        if (!componentName) {
            componentName = path.basename(mdFileLocation, '.doc.md');
        }
        const cache = await this.readCache();
        await Promise.all(
            files.map(async (file) => {
                var currPath = componentPath + '/' + file;
                //todo pass ahead this var
                var fileStat = await fs.promises.stat(currPath);
                if (fileStat.isDirectory()) {
                    const subComponents = await this.getComponents(
                        currPath,
                        componentName
                    );
                    if (subComponents) {
                        //get all subcomponents that
                        subComponents.forEach((subComponent) => {
                            if (
                                mdFileLocation &&
                                !subComponent.docPath &&
                                subComponent.name === componentName
                            ) {
                                subComponent.docPath =
                                    componentPath + '\\' + mdFileLocation;
                                subComponent.basePath =
                                    path.dirname(mdFileLocation);
                                //todo improve that
                                // cache.components[subComponent.basePath] =
                                //     subComponent;
                                // this.writeCache(cache.components);
                            }
                            components.push(subComponent);
                        });
                    }
                } else if (componentName) {
                    //todo ignore others functions not related to this path
                    if (
                        currPath.indexOf('.spec') === -1 &&
                        currPath.indexOf('doc') === -1 &&
                        (currPath.indexOf('.ts') !== -1 ||
                            currPath.indexOf('tsx') !== -1)
                    ) {
                        const lastModified = fileStat.mtimeMs;
                        let component = cache.components[currPath];
                        if (
                            !component ||
                            !cache?.date ||
                            cache.date < lastModified
                        ) {
                            component = await this.getComponent(
                                currPath,
                                componentName
                            );
                            if (component) {
                                if (mdFileLocation) {
                                    component.docPath =
                                        componentPath + '\\' + mdFileLocation;
                                    component.basePath =
                                        path.dirname(mdFileLocation);
                                }
                                cache.components[currPath] = component;
                                this.writeCache(cache.components);
                            }
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
        componentPath: string,
        componentName: string = ''
    ): Promise<Component | null> {
        if (componentName.indexOf('use-') === 0 || !componentName) {
            //todo parse hooks
            return null;
        }
        await this.loading;
        var code = fs.readFileSync(path.resolve(componentPath), 'utf8');
        let parsedComponents: Documentation[];
        try {
            parsedComponents = this.reactDocGen.parse(code, {
                fileName: path.resolve(componentPath),
                handlers: [
                    ...this.reactDocGen.defaultHandlers,
                    (documentation: any, path: any) => {
                        this.codeTypeHandler(documentation, path);
                    },
                ],
            });
        } catch (ex) {
            return null;
        }
        const parsedComponent = parsedComponents.find(
            (component) => component.displayName === componentName
        );
        let component: Component = {
            name: componentName,
            basePath: '', //ASSIGNED_AFTER
            docPath: '', //ASSIGNED_AFTER
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
        if (!path || path.indexOf('.doc.md') === -1) {
            return null;
        }
        return fs.readFileSync(path, 'utf-8');
    }
}
