import { Resolvers } from '../generated/schema';
import { ComponentService } from '../../services/component.service';
import { AppConfig } from '../../utils/config';
import { Normalizer } from '../../utils/normalizer';

const ComponentResolver: Resolvers = {
    Query: {
        components: async () => {
            var componentService = new ComponentService();
            return await componentService.getComponents();
        },
        component: async (_, { path }) => {
            var componentService = new ComponentService();
            const config = await AppConfig.read();
            var paths = path.split('/');
            let componentName = Normalizer.capitalizeWordsAndRemoveHyphen(
                paths[paths.length - 1]
            );
            if (componentName.indexOf('Use') === 0) {
                componentName = componentName.replace('Use', 'use');
            }
            const components = await componentService.getComponents(
                `${config.dir}/${path}`
            );
            return components.find((c) => c.name === componentName) || null;
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
