import * as fs from 'fs';
import * as path from 'path';
import { Component } from '../models/component.model';
import * as dotenv from 'dotenv';
//@ts-ignore
import { Config, Documentation } from 'react-docgen';
import { DEF_CONFIG, AppConfig, AppConfiguration } from '../utils/app-config';
import { FindHooksDefinitionResolver } from './docgen/hook-resolver';
import { Normalizer } from '../utils/normalizer.browser';
import { ComponentCacheData, ComponentCache } from '../utils/components-cache';

dotenv.config();

export class ComponentService {
    reactDocGen: any;
    loading: any;
    cache: ComponentCacheData = {
        components: {},
        aplication: { name: '', port: 0 },
    };
    config: AppConfiguration = DEF_CONFIG;

    constructor() {
        this.loading = new Promise(async (resolve) => {
            const [reactDocgen, config, cache] = await Promise.all([
                import('react-docgen'),
                AppConfig.read(),
                ComponentCache.read(),
            ]);
            this.reactDocGen = reactDocgen;
            this.config = config;
            this.cache = cache;
            resolve(true);
        });
    }

    private getComponentsFromPackageJSON(currPath: string) {
        let packageJSONFile = path.resolve(currPath, 'package.json');
        if (!fs.existsSync(packageJSONFile)) {
            return;
        }
        const packageJson = fs.readFileSync(packageJSONFile, 'utf8');
        if (!packageJson) {
            return null;
        }
        const packageParsed = JSON.parse(packageJson);
        const componentName = Normalizer.capitalizePackageName(
            packageParsed.name
        );
        const componentVersion = packageParsed.version;
        return { componentName, componentVersion, packageJSONFile };
    }

    private getMDFileLocation(files: string[]) {
        let mdFile = '';
        files.every((file) => {
            if (
                file.toLowerCase().indexOf('.doc.md') !== -1 ||
                file.toLowerCase().indexOf('.docs.md') !== -1
            ) {
                mdFile = file;
                return false;
            }
            return true;
        });
        return mdFile;
    }

    private getNameByMdFileLocation(mdFileLocation: string) {
        let componentName = Normalizer.capitalizeWordsAndRemoveHyphen(
            path
                .basename(mdFileLocation, '.md')
                .replace('.doc', '')
                .replace('.docs', '')
                .replace('.mdx', '')
        );
        if (componentName.indexOf('Use') === 0) {
            componentName = componentName.replace('Use', 'use');
        }
        return componentName;
    }

    public async getComponents(componentPath?: string, componentName?: string) {
        await this.loading;
        if (!componentPath) {
            componentPath = this.config.componentsPath;
        }
        if (!fs.existsSync(componentPath)) {
            return [];
        }
        var components: Component[] = [];
        let componentVersion = '';
        let packageJSONFile = '';
        const PACKAGE_INFO = this.getComponentsFromPackageJSON(componentPath);
        if (PACKAGE_INFO) {
            componentName = PACKAGE_INFO.componentName;
            componentVersion = PACKAGE_INFO.componentVersion;
            packageJSONFile = PACKAGE_INFO.packageJSONFile;
        }
        var files = await fs.promises.readdir(componentPath);
        let mdFileLocation = this.getMDFileLocation(files);

        if (!componentName && mdFileLocation) {
            componentName = this.getNameByMdFileLocation(mdFileLocation);
        }

        await Promise.all(
            files.map(async (file) => {
                if (file === 'node_modules') {
                    return null;
                }
                var currPath = componentPath + '/' + file;
                var fileStat = await fs.promises.stat(currPath);
                if (fileStat.isDirectory()) {
                    const subComponents = await this.getComponents(
                        currPath,
                        componentName
                    );
                    if (subComponents) {
                        subComponents.forEach((subComponent) => {
                            if (
                                mdFileLocation &&
                                !subComponent.docPath &&
                                subComponent.name.toLocaleLowerCase() ===
                                    componentName?.toLocaleLowerCase()
                            ) {
                                subComponent.docPath =
                                    componentPath + '/' + mdFileLocation;
                                subComponent.basePath = componentPath!.replace(
                                    this.config!.componentsPath,
                                    ''
                                );
                            }
                            if (
                                !subComponent.basePath &&
                                packageJSONFile &&
                                subComponent.name.toLocaleLowerCase() ===
                                    componentName?.toLocaleLowerCase()
                            ) {
                                subComponent.basePath = componentPath!.replace(
                                    this.config!.componentsPath,
                                    ''
                                );
                            }
                            this.cache.components[subComponent.path] =
                                subComponent;
                            this.writeCache(this.cache.components);
                            subComponent.version = componentVersion;
                            components.push(subComponent);
                        });
                    }
                } else if (componentName) {
                    //todo ignore others functions not related to this path
                    if (
                        currPath.indexOf('.spec') === -1 &&
                        currPath.indexOf('.md') === -1 &&
                        currPath.indexOf('.composition.ts') === -1 &&
                        currPath.indexOf('.composition.tsx') === -1 &&
                        (currPath.indexOf('.ts') !== -1 ||
                            currPath.indexOf('tsx') !== -1)
                    ) {
                        const lastModified = fileStat.mtimeMs;
                        let component: Component | null =
                            this.cache.components[currPath];

                        if (
                            !component ||
                            !this.cache?.date ||
                            this.cache.date < lastModified
                        ) {
                            component = await this.getComponent(
                                currPath,
                                componentName
                            );
                            if (component) {
                                if (mdFileLocation) {
                                    component.docPath =
                                        componentPath + '/' + mdFileLocation;
                                    component.basePath = componentPath!.replace(
                                        this.config!.componentsPath,
                                        ''
                                    );
                                } else if (packageJSONFile) {
                                    component.basePath = componentPath!.replace(
                                        this.config!.componentsPath,
                                        ''
                                    );
                                }
                                component.version = componentVersion;
                                this.cache.components[currPath] = component;
                                this.writeCache(this.cache.components);
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
                babelOptions: {
                    filename: path.resolve(componentPath),
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react',
                        '@babel/preset-typescript',
                    ],
                },
            });
        } catch (ex: any) {
            if (ex.code !== 'ERR_REACTDOCGEN_MISSING_DEFINITION') {
                console.log('Error parsing component', componentPath, ex);
            }
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
        return await fs.promises.readFile(dir + '/../README.md', 'utf-8');
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
}
