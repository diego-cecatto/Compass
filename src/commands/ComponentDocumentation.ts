import fs from 'fs';
import path from 'path';
import { Component } from './../graphql/generated/graphql';

interface Property {
    name: string;
    description: string;
}

interface ComponentDocumentation {
    name: string;
    description: string;
    properties: Property[];
}

export class ComponentDocumentationGenerator {
    private static readonly PROPERTY_COMMENT_REGEX =
        /@prop\s+{(\w+)}\s+(\w+)\s+([\s\S]+?)(?=\s*\*\s*@prop|\s*\*\s*@|$)/g;

    static generateDocumentation(
        componentDir: string
    ): ComponentDocumentation[] {
        const components = this.parseComponents(componentDir);
        // return components.map((component) => {
        //     const componentContents = fs.readFileSync(component.path, 'utf8');
        //     const componentCommentMatch = componentContents.match(
        //         /\/\*\*\s+([\s\S]+?)\s+\*\//
        //     );
        //     const componentComment =
        //         componentCommentMatch && componentCommentMatch[1];

        //     const propertyComments: Property[] = [];
        //     let match: RegExpExecArray | null;
        //     while (
        //         (match = this.PROPERTY_COMMENT_REGEX.exec(componentContents))
        //     ) {
        //         const type = match[1];
        //         const name = match[2];
        //         const description = match[3].trim();
        //         propertyComments.push({ name, description });
        //     }

        //     return {
        //         name: component.name,
        //         description: componentComment || '',
        //         properties: propertyComments,
        //     };
        // });
        return [];
    }

    private static parseComponents(componentDir: string): Component[] {
        return [];
        // Implementation of parseDependencies function from earlier
    }
}
