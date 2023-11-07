// import { Resolvers } from '../generated/graphql';
import { ComponentService } from '../../services/component.service';
var componentService = new ComponentService();

const ComponentResolver = {
    Query: {
        components: (_: any, { scope }: { scope?: string }) =>
            componentService.getComponents(scope),
        component: async (_: any, { name }: { name: string }) =>
            componentService.getComponent(name),
        documentation: async (_: any, { path }: { path: string }) =>
            componentService.getDocumentation(path),
        // componentRelativePath: async (_: any, { path }: { path: string }) =>
        //     componentService.getRelativePath(path),
    },
};

export default ComponentResolver;
