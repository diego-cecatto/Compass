import { Server } from '../Server/Server';
import { ComponentService } from '../../services/component.service';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import esbuild from 'esbuild';

dotenv.config();

export class Documentation {
    tsFileDirectory = path.dirname(__filename);

    async start() {
        await this.dependences();
        var indexFile = path.resolve(
            this.tsFileDirectory + '../../../../src/index.tsx'
        );
        const clientEnv = { 'process.env.NODE_ENV': `'production'` };

        esbuild
            .build({
                entryPoints: [indexFile],
                bundle: true,
                minify: true,
                sourcemap: true,
                define: clientEnv,
                outdir: './build',
                publicPath: '/public',
                loader: {
                    '.tsx': 'tsx',
                    '.ts': 'ts',
                    '.js': 'jsx',
                    '.scss': 'css',
                    '.png': 'dataurl',
                    '.jpg': 'dataurl',
                    '.svg': 'dataurl',
                },
                jsxFactory: 'React.createElement',
            })
            .catch(() => process.exit(1));
        const server = new Server();
        server.start();
    }

    async dependences() {
        var componentsService = new ComponentService();
        var components = await componentsService.getComponents(
            process.env.SCOPE!
        );
        var exportCommands = '';
        for (var componentName in components) {
            var component = components[componentName];
            exportCommands += `export { ${
                component.name
            } } from '../../../../../${component.path.replace(
                '.tsx',
                ''
            )}'; \n`;
        }
        fs.writeFileSync(
            this.tsFileDirectory +
                '../../../src/app/pages/component/live-editor/component.dependences.ts',
            exportCommands
        );
    }
}
