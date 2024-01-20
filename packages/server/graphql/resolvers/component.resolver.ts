import { Resolvers } from '../generated/schema';
import { ComponentService } from '@compass-docgen/core';
import { AppConfig } from '@compass-docgen/core';
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
            const KEYS = Object.keys(COMPONENTS?.components || {});
            let component = null;
            KEYS.every((KEYS) => {
                const COMPONENT = COMPONENTS?.components[KEYS];
                if (COMPONENT.basePath === `/${filePath}`) {
                    component = COMPONENT;
                    return false;
                }
                return true;
            });
            return component;
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
            if (!fs.existsSync(path.resolve('./build', filePath))) {
                return fs.readFileSync(filePath, 'utf8');
            }
            return fs.readFileSync(path.resolve('./build', filePath), 'utf8');
        },
        documentationName: async () => {
            return (await AppConfig.read()).name;
        },
    },
};
export default ComponentResolver;
