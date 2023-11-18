import { Resolvers } from '../generated/schema';
import { ComponentService } from '../../services/component.service';
import { Config } from '../../utils/config';
var componentService = new ComponentService();

const ComponentResolver: Resolvers = {
    Query: {
        components: async () => {
            return await componentService.getComponents();
        },
        component: async (_, { path }) => {
            const config = await Config.read();
            var paths = path.split('/');
            function capitalizeWordsAndRemoveHyphen(str: string) {
                const words = str.split('-');
                const capitalizedWords = words.map(
                    (word) => word.charAt(0).toUpperCase() + word.slice(1)
                );
                return capitalizedWords.join('');
            }
            let componentName = capitalizeWordsAndRemoveHyphen(
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
            return await componentService.getDocumentationDefault();
        },
        documentation: async (_, { path }) => {
            return await componentService.getDocumentation(path);
        },
    },
};
export default ComponentResolver;
