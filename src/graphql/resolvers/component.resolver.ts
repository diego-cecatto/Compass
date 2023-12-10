import { Resolvers } from '../generated/schema';
import { ComponentService } from '../../services/component.service';
import { AppConfig } from '../../utils/config';
import fs from 'fs';
import path from 'path';

const ComponentResolver: Resolvers = {
    Query: {
        components: async () => {
            var componentService = new ComponentService();
            const COMPONENTS = await componentService.readCache();
            const KEYS = Object.keys(COMPONENTS?.components || {});
            return KEYS.map((KEYS) => COMPONENTS?.components[KEYS]);
        },
        component: async (_, { filePath }) => {
            var componentService = new ComponentService();
            const COMPONENTS = await componentService.readCache();
            const COMPONENT = COMPONENTS?.components[filePath];
            return COMPONENT || null;
        },
        documentationDefault: async () => {
            var componentService = new ComponentService();
            return await componentService.getDocumentationDefault();
        },
        documentation: async (_, { filePath }) => {
            if (!filePath) {
                return null;
            }
            if (!filePath || filePath.indexOf('.md') === -1) {
                return null;
            }
            return fs.readFileSync(path.resolve('./build', filePath), 'utf8');
        },
        documentationName: async () => {
            return (await AppConfig.read()).name;
        },
    },
};
export default ComponentResolver;
