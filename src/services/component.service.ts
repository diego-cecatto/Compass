import * as fs from 'fs';
import * as reactDocgenTypescript from 'react-docgen-typescript';
import * as path from 'path';
import { Component, Dependencies, Property } from './../models/component.model';
import {
    Project,
    SourceFile,
    Node,
    SyntaxKind,
    VariableStatement,
    Statement,
    StructureKind,
    ImportDeclaration,
    VariableDeclaration,
    ArrowFunction,
    TypeReferenceNode,
    ClassDeclaration,
    InterfaceDeclaration,
    TypeAliasDeclaration,
    PropertySignature,
} from 'ts-morph';

//! could have a pre parsed response with json or can retry unsing long life cy cle with cache
//todo ignore composition and test file
//https://ts-morph.com/setup/ast-viewer
//todo validate all steps to be sure that information is correct
//todo create tests repository

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
                    //path of componnet
                    //index.ts
                    //or index.tsx
                    //another subcomponent
                    //another-subcomponent.tsx
                    //todo ignore others functions not related to this path
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

    public async getComponent(
        componentPath: string
    ): Promise<Component | null> {
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
            prop: {
                name: 'any',
            },
        };
        // this.extractComponentProperties(component.path);
        this.extractComponentDeclaration(component);
        return component;
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

        //todo could use ts-morph by using folder
        //todo starts by export in this folder
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
                property.description = sibling.getText();
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
        ///todo find props property or if have only one and what is the right value
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
