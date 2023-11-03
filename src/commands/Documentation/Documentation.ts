import { Server } from '../server/Server';
import { ComponentService } from '../../services/Component.service';
import * as fs from 'fs';
import * as path from 'path';
import esbuild from 'esbuild';
import { AppConfig, Config, DEF_CONFIG } from '../../utils/Config';

export class Documentation {
    tsFileDirectory = path.dirname(__filename);
    outDir = '/build';
    config: AppConfig = DEF_CONFIG;
    loading: Promise<boolean>;
    constructor() {
        this.loading = new Promise(async (resolve) => {
            this.config = await Config.read();
            resolve(true);
        });
    }

    baseReactFiles() {
        const sourceDir = this.tsFileDirectory + '../../../../public';
        const targetDir = './' + this.outDir;
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
            .replace(
                '</head>',
                `<link rel="stylesheet" href="%PUBLIC_URL%/index.css">
            </head>`
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
        await this.loading;
        var componentsService = new ComponentService();
        var components = await componentsService.getComponents(this.config.dir);
        var exportCommands = '';
        const DEP_DIR =
            './../../app/pages/component/live-editor/ComponentDependences.ts';
        for (var componentName in components) {
            var component = components[componentName];
            const WORK_DIR = path.relative(
                path.resolve(__dirname, path.dirname(DEP_DIR)),
                path.dirname(component.fullPath)
            );
            exportCommands += `export { ${
                component.name
            } } from '${WORK_DIR.replace(/\\/g, '/')}/${
                path.parse(path.basename(component.fullPath)).name
            }'; \n`;
        }
        fs.writeFileSync(this.tsFileDirectory + DEP_DIR, exportCommands);
    }
}
