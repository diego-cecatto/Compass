import * as fs from 'fs';
import * as path from 'path';
import { Component } from '../models/component.model';
const CACHE_FILE_PATH = './components.cache';
import * as dotenv from 'dotenv';
//@ts-ignore
import { Documentation } from 'react-docgen';
import { AppConfig, Config, DEF_CONFIG } from '../utils/config';
import { FindHooksDefinitionResolver } from './docgen/hook-resolver';
import { Normalizer } from '../utils/normalizer';
dotenv.config();

export class ComponentService {
    reactDocGen: any;
    config: Config = DEF_CONFIG;
    loading: any;
    constructor() {
        this.loading = new Promise(async (resolve) => {
            await Promise.all([
                import('react-docgen').then((reactDocGen) => {
                    this.reactDocGen = reactDocGen;
                }),
                AppConfig.read().then((json) => {
                    this.config = json;
                }),
            ]);
            resolve(true);
        });
    }

    public async getComponents(componentPath?: string, componentName?: string) {
        await this.loading;
        if (!componentPath) {
            componentPath = this.config.dir;
        }
        if (!fs.existsSync(componentPath)) {
            return [];
        }
        var components: Component[] = [];
        let packageJSONFile = path.resolve(componentPath, 'package.json');
        let componentVersion = '';
        if (fs.existsSync(packageJSONFile)) {
            const packageJson = fs.readFileSync(packageJSONFile, 'utf8');

            if (packageJson) {
                const packageParsed = JSON.parse(packageJson);
                componentName = packageParsed.name;
                componentName = Normalizer.capitalizePackageName(
                    componentName!
                );
                componentVersion = packageParsed.version;
            } else {
                packageJSONFile = '';
            }
        } else {
            packageJSONFile = '';
        }

        var files = await fs.promises.readdir(componentPath);
        let mdFileLocation = '';

        files.every((file) => {
            if (
                file.toLowerCase().indexOf('.doc.md') !== -1 ||
                file.toLowerCase().indexOf('.docs.md') !== -1
            ) {
                mdFileLocation = file;
                return false;
            }
            return true;
        });
        if (!componentName) {
            componentName = Normalizer.capitalizeWordsAndRemoveHyphen(
                path
                    .basename(mdFileLocation, '.md')
                    .replace('.doc', '')
                    .replace('.docs', '')
                    .replace('.mdx', '')
            );
            if (componentName.indexOf('Use') === 0) {
                componentName = componentName.replace('Use', 'use');
            }
        }
        const cache = await this.readCache();
        await Promise.all(
            files.map(async (file) => {
                if (file === 'node_modules') {
                    return null;
                }
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
                                    componentPath + '/' + mdFileLocation;
                                subComponent.basePath = componentPath!.replace(
                                    this.config.dir,
                                    ''
                                );
                            }
                            if (
                                !subComponent.basePath &&
                                packageJSONFile &&
                                subComponent.name === componentName
                            ) {
                                subComponent.basePath = componentPath!.replace(
                                    this.config.dir,
                                    ''
                                );
                            }
                            subComponent.version = componentVersion;
                            components.push(subComponent);
                        });
                    }
                } else if (componentName) {
                    //todo ignore others functions not related to this path
                    if (
                        currPath.indexOf('.spec') === -1 &&
                        currPath.indexOf('doc') === -1 &&
                        currPath.indexOf('.composition.ts') === -1 &&
                        currPath.indexOf('.composition.tsx') === -1 &&
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
                                        componentPath + '/' + mdFileLocation;
                                    component.basePath = componentPath?.replace(
                                        this.config.dir,
                                        ''
                                    );
                                } else if (packageJSONFile) {
                                    component.basePath = componentPath?.replace(
                                        this.config.dir,
                                        ''
                                    );
                                }
                                component.version = componentVersion;
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
        if (!componentName) {
            return null;
        }
        await this.loading;
        var code = fs.readFileSync(path.resolve(componentPath), 'utf8');
        let parsedComponents: Documentation[];
        try {
            let resolver = null;
            if (componentName.indexOf('use') === 0) {
                resolver = new this.reactDocGen.builtinResolvers.ChainResolver(
                    [
                        new FindHooksDefinitionResolver(),
                        new this.reactDocGen.builtinResolvers.FindExportedDefinitionsResolver(
                            {
                                limit: 1,
                            }
                        ),
                        new this.reactDocGen.builtinResolvers.FindAnnotatedDefinitionsResolver(),
                    ],
                    {
                        chainingLogic:
                            this.reactDocGen.builtinResolvers.ChainResolver
                                .Logic.ALL,
                    }
                );
            }
            parsedComponents = this.reactDocGen.parse(code, {
                fileName: path.resolve(componentPath),
                handlers: [
                    ...this.reactDocGen.defaultHandlers,
                    (documentation: any, path: any) => {
                        this.codeTypeHandler(documentation, path);
                    },
                ],
                resolver,
            });
        } catch (ex) {
            console.error(ex);
            return null;
        }
        const parsedComponent = parsedComponents.find(
            (component) =>
                component.displayName?.toLocaleLowerCase() ===
                componentName.toLocaleLowerCase()
        );
        if (!parsedComponent) {
            return null;
        }
        let component: Component = {
            name: parsedComponent.displayName!,
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

    public async getDocumentationDefault() {
        const dir = path.dirname(__filename);
        return await this.getDocumentation(dir + '/../../README.md');
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
        fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cache), 'utf8');
    }

    private async readCache() {
        try {
            const cacheContent = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
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

    public async getDocumentation(path?: string | null) {
        if (!path) {
            return null;
        }
        if (!path || path.indexOf('.md') === -1) {
            return null;
        }
        return fs.readFileSync(path, 'utf8');
    }
}
