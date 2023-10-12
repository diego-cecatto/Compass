import { Server } from '../Server/Server';
import { ComponentService } from '../../services/component.service';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import esbuild from 'esbuild';

dotenv.config();

export class Documentation {
    tsFileDirectory = path.dirname(__filename);
    outDir = '/build';

    baseReactFiles() {
        const sourceDir = this.tsFileDirectory + '../../../../public';
        const targetDir =
            this.tsFileDirectory + '../../../../../../' + this.outDir;
        const files = fs.readdirSync(sourceDir);
        files.forEach((file) => {
            const sourceFilePath = path.join(sourceDir, file);
            const targetFilePath = path.join(targetDir, file);
            fs.copyFileSync(sourceFilePath, targetFilePath);
        });
        var indexFile = targetDir + '/index.html';
        let indexFileHTML = fs.readFileSync(indexFile, 'utf8');
        indexFileHTML = indexFileHTML
            .replace(
                '</body>',
                `   <script src="%PUBLIC_URL%/index.js"></script>
                </body>`
            )
            .replace(new RegExp('%PUBLIC_URL%', 'g'), '');
        fs.writeFileSync(indexFile, indexFileHTML);
    }

    async build() {
        await this.dependences();
        var indexFile = path.resolve(
            this.tsFileDirectory + '../../../../src/index.tsx'
        );
        const clientEnv = { 'process.env.NODE_ENV': `'production'` };

        await esbuild
            .build({
                entryPoints: [indexFile],
                bundle: true,
                minify: true,
                sourcemap: true,
                define: clientEnv,
                outdir: this.outDir,
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
            .catch(() => process.exit(1))
            .then(() => {
                this.baseReactFiles();
            });
    }

    async start() {
        await this.build();
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
            } } from '../../../../../../../${component.path.replace(
                '.tsx',
                ''
            )}'; \n`;
        }
        fs.writeFileSync(
            this.tsFileDirectory +
                '../../../../src/app/pages/component/live-editor/component.dependences.ts',
            exportCommands
        );
    }
}
