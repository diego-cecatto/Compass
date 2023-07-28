import * as fs from 'fs';
import * as reactDocgenTypescript from 'react-docgen-typescript';
import * as path from 'path';
import { Component, Dependencies, Prop } from './../models/component.model';
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
} from 'ts-morph';
import * as ts from 'typescript';

type Property = {
    name: string;
    type: string;
    default?: any;
    description?: string;
};
interface ComponentProperty {
    name: string;
    default: any;
}
//! could have a pre parsed response with json or can retry unsing long life cy cle with cache
//todo ignore composition and test file
//https://ts-morph.com/setup/ast-viewer
//todo validate all steps to be sure that information is correct

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
            props: [],
        };
        // this.extractComponentProperties(component.path);
        this.extractComponentDeclaration(component);
        return component;
    }

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
            //todo could asses if the same name of the component
            var exported = exportedDeclaration[0];
            const kindOfComponent = exported.getKind();
            if (kindOfComponent == SyntaxKind.VariableDeclaration) {
                propertyName = this.getArrowFunctionProperty(
                    exported as VariableDeclaration
                );
            } else if (kindOfComponent == SyntaxKind.ClassDeclaration) {
                propertyName = this.getClassPropType(
                    exported as ClassDeclaration
                );
            }
            //todo find property by name
        });
        this.getPropDeclaration(propertyName, source);

        //todo could use ts-morph by using folder
        //todo starts by export in this folder
        // source.getExportedDeclarations().values().next().value;

        //todo with this function I could get import and export sentences
        //source.getStatements()[2].getStructure()
        // source.forEachChild((child) => {
        //     if (child.getKind() == SyntaxKind.VariableStatement) {
        //         var initializer = (child as VariableStatement)
        //             .getDeclarations()[0]
        //             .getInitializer();
        //         var structure = (initializer as any).getStructure();
        //         console.log(structure.parameters);
        //         // (initializer as ArrowFunction)?.getStructure();
        //         // child.getDeclarations()[0].getInitializer().getStructure().parameters
        //     }
        // });
        // source.getStatements().forEach((statement) => {
        //     var structure = (
        //         statement as VariableStatement | ImportDeclaration
        //     ).getStructure();
        //     if (structure.kind == StructureKind.VariableStatement) {
        //         if (structure.declarations.length) {
        //             var declaration = structure.declarations.at(-1);
        //             if (declaration?.name === component.name) {
        //                 //todo try to find property
        //                 //todo verify if is the default export item
        //                 return declaration;
        //             }
        //         }
        //     }
        // });
    }

    extractPropertiesFromInitializer(
        initializer: any,
        properties: Property[],
        currentPropertyName: string = ''
    ) {
        if (initializer.getKind() === SyntaxKind.ArrowFunction) {
            initializer.getParameters().forEach((property: any) => {
                let propertyName = currentPropertyName
                    ? `${currentPropertyName}.${property.getName()}`
                    : property.getName();

                if (
                    property.getKind() ===
                    SyntaxKind.ShorthandPropertyAssignment
                ) {
                    const shorthandSymbol = property.getSymbol();
                    if (shorthandSymbol) {
                        propertyName = currentPropertyName
                            ? `${currentPropertyName}.${shorthandSymbol.getName()}`
                            : shorthandSymbol.getName();
                    }
                }

                const typeNode = property.getTypeNode();
                const propertyType = typeNode ? typeNode.getText() : 'any';

                const defaultValueNode = property.getFirstChildByKind(
                    SyntaxKind.FirstAssignment
                );
                const defaultValue = defaultValueNode
                    ? defaultValueNode.getLastChild()?.getText()
                    : undefined;

                // const jsDoc = property.getJsDocs();
                // const description =
                //     jsDoc.length > 0 ? jsDoc[0].getDescription().trim() : '';
                const description = '';
                properties.push({
                    name: propertyName,
                    type: propertyType,
                    default: defaultValue,
                    description: description,
                });

                if (property.getInitializer()) {
                    this.extractPropertiesFromInitializer(
                        property.getInitializer(),
                        properties,
                        propertyName
                    );
                }
            });
        }
    }

    getPropDeclaration(propName: string, source: SourceFile) {
        const propDeclaration: InterfaceDeclaration | undefined =
            source.getInterface(propName);
        //todo get all properties
        //todo get default values
        //todo get comentary to description
        var properties: any[] = [];
        const props = propDeclaration?.getProperties();
        if (!props) {
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
        ///todo find props prperty or if have only one and what is the right value
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
