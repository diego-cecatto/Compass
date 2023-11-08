import { Resolvers } from '../generated/schema';
import { ComponentService } from '../../services/component.service';
var componentService = new ComponentService();

const ComponentResolver: Resolvers = {
    Query: {
        components: async () => {
            return await componentService.getComponents();
        },
        component: async (_, { path }) => {
            return await componentService.getComponent(path);
        },
        documentation: async (_, { path }) => {
            return await componentService.getDocumentation(path);
        },
    },
};
export default ComponentResolver;
