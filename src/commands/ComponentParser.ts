import fs from 'fs';
import path from 'path';
import { Component, Dependencies, Maybe } from './../graphql/generated/graphql';

export default class ComponentParser {
    componentsDir: string;

    constructor(componentsDir: string) {
        this.componentsDir = componentsDir;
    }

    parse(): Component[] {
        const componentFiles = fs.readdirSync(this.componentsDir);
        const components: Component[] = [];
        for (const file of componentFiles) {
            if (!file.endsWith('.tsx')) {
                continue;
            }
            const filePath = path.join(this.componentsDir, file);
            const name = path.basename(filePath, '.tsx');
            const source = fs.readFileSync(filePath, 'utf-8');
            // const dependencies = this.parseDependencies(source);
            var dependencies: Maybe<Dependencies>[] = [];
            components.push({ name, path: filePath, dependencies });
        }
        return components;
    }

    private parseDependencies(source: string): string[] {
        // TODO: implement dependency parsing logic
        return [];
    }
}
