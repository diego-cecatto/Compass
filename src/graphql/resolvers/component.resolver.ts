import { Resolvers } from '../generated/schema';
import { ComponentService } from '../../services/component.service';
import { AppConfig } from '../../utils/config';

const ComponentResolver: Resolvers = {
    Query: {
        components: async () => {
            var componentService = new ComponentService();
            const COMPONENTS = await componentService.readCache();
            const KEYS = Object.keys(COMPONENTS?.components || {});
            return KEYS.map((KEYS) => COMPONENTS?.components[KEYS]);
        },
        component: async (_, { path }) => {
            var componentService = new ComponentService();
            const COMPONENTS = await componentService.readCache();
            const COMPONENT = COMPONENTS?.components[path];
            return COMPONENT || null;
        },
        documentationDefault: async () => {
            var componentService = new ComponentService();
            return await componentService.getDocumentationDefault();
        },
        documentation: async (_, { path }) => {
            var componentService = new ComponentService();
            return await componentService.getDocumentation(path);
        },
        documentationName: async () => {
            return (await AppConfig.read()).name;
        },
    },
};
export default ComponentResolver;
