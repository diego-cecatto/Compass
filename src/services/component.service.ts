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
    public async getComponents(path?: string) {
        if (!path) {
            path = process.env.SCOPE!;
        }
        var files = await fs.promises.readdir(path);
        var components: Component[] = [];
        const cache = await this.readCache();
        const reactDocGen = await import('react-docgen');
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
                            component = await this.getComponent(
                                currPath,
                                reactDocGen
                            );
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
        componentPath: string,
        reactDocGen?: any
    ): Promise<Component | null> {
        if (!reactDocGen) {
            reactDocGen = await import('react-docgen');
        }
        var code = fs.readFileSync(path.resolve(componentPath));
        const parsedComponents: Documentation[] = reactDocGen.parse(code);
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
