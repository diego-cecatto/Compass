import { visitors } from '@babel/traverse';
//@ts-ignore
import { NodePath } from 'react-docgen';

function isHook(path: NodePath, annotation: any) {
    let inspectPath: NodePath | null = path;
    do {
        const name = (inspectPath.node as any)?.id?.name;
        if (/^use[A-Z].*/.test(name)) {
            return true;
        }
        if (
            Array.isArray(inspectPath.container) &&
            !inspectPath.isVariableDeclarator() &&
            !inspectPath.parentPath?.isCallExpression()
        ) {
            return false;
        }
    } while ((inspectPath = inspectPath.parentPath));
    return false;
}
function classVisitor(path: any, state: any) {}
function statelessVisitor(path: any, state: any) {
    if (isHook(path, state.hooks)) {
        state.foundDefinitions.add(path);
    }
}
const explodedVisitors = visitors.explode({
    ArrowFunctionExpression: { enter: statelessVisitor },
    FunctionDeclaration: { enter: statelessVisitor },
    FunctionExpression: { enter: statelessVisitor },
    ObjectMethod: { enter: statelessVisitor },
    ClassDeclaration: { enter: classVisitor },
    ClassExpression: { enter: classVisitor },
});

export class FindHooksDefinitionResolver {
    hooks;
    constructor({ hooks = [] } = {}) {
        this.hooks = hooks;
    }

    resolve(file: any) {
        const state = {
            foundDefinitions: new Set(),
            hooks: this.hooks,
        };

        file.traverse(explodedVisitors, state);
        return Array.from(state.foundDefinitions);
    }
}
