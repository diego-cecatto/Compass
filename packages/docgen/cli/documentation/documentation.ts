import { ComponentService } from '@compass-docgen/core';
import * as fs from 'fs';
import * as path from 'path';
import esbuild from 'esbuild';
import { AppConfig, Config, DEF_CONFIG } from '@compass-docgen/core';

export class Documentation {
    tsFileDirectory = path.dirname(__filename);
    outDir = './build';
    config: Config = DEF_CONFIG;
    loading: Promise<boolean>;
    constructor() {
        this.loading = new Promise(async (resolve) => {
            this.config = await AppConfig.read();
            resolve(true);
        });
    }

    async baseReactFiles() {
        const sourceDir = path.resolve(this.tsFileDirectory, '../../../public');
        let targetDir = './' + this.outDir;
        if (sourceDir.indexOf('node_modules') > -1) {
            targetDir = sourceDir.split('node_modules')[0] + '/' + this.outDir;
        }
        const files = fs.readdirSync(sourceDir);
        var buildPromises: any[] = [];
        files.forEach((file) => {
            const sourceFilePath = path.join(sourceDir, file);
            const targetFilePath = path.join(targetDir, file);
            buildPromises.push(
                fs.promises.copyFile(sourceFilePath, targetFilePath)
            );
        });
        buildPromises.push(
            fs.promises.writeFile(
                targetDir + '/README.md',
                `# Compass
Compass is an open-source project designed to automate the generation of documentation for React components. It offers a convenient way to create a Single [Single Repository](https://www.accenture.com/us-en/blogs/software-engineering-blog/how-to-choose-between-mono-repo-and-poly-repo) for your components, streamlining your development workflow. While currently supporting TypeScript, Docmate's roadmap includes plans to incorporate JavaScript support in the future.

This is a prod server

## Quikstart
Install all dependencies

    npm install 

Start application

    npm run dev
`
            )
        );
        await Promise.all(buildPromises);
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
            .replace('%TITLE%', this.config.name || 'Docamte')
            .replace(new RegExp('%PUBLIC_URL%', 'g'), '');
        fs.writeFileSync(indexFile, indexFileHTML);
        if (this.config.favicon) {
            fs.copyFileSync(
                path.join(sourceDir, this.config.favicon),
                path.join(targetDir, 'favicon.ico')
            );
        }
    }

    async build() {
        var indexFile = path.resolve(
            this.tsFileDirectory + '../../../../src/index.tsx'
        );
        // const clientEnv = { 'process.env.NODE_ENV': `'production'` };
        await esbuild
            .build({
                entryPoints: [indexFile],
                bundle: true,
                // minify: true,
                sourcemap: true,
                // define: clientEnv,
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
            .catch((error) => {
                console.log(error);
                process.exit(1);
            });
        await Promise.all([
            this.dependences(),
            this.baseReactFiles(),
            this.createPackageJson(),
        ]).then(() => {
            console.log('Documentation generated');
        });
    }

    async createPackageJson() {
        const PACKAGE = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
        let version = PACKAGE.devDependencies['compass-docgen'];
        if (PACKAGE.name == 'compass-docgen') {
            version = PACKAGE.version;
        }
        const packageJson = {
            name: this.config.name,
            version: '1.0.0',
            description: 'Server to run the documentation',
            scripts: {
                start: 'compass-server start',
                production: 'compass-server start',
            },
            dependencies: {
                'compass-docgen': version,
            },
        };
        fs.promises.writeFile(
            path.resolve(this.outDir, 'package.json'),
            JSON.stringify(packageJson)
        );
    }

    async copyDocFile(currFile: string) {
        const DESTINATION = path.resolve(this.outDir, currFile);
        await fs.promises.mkdir(path.dirname(DESTINATION), {
            recursive: true,
        });
        await fs.promises.copyFile(currFile, DESTINATION);
    }

    async dependences() {
        await this.loading;
        var componentsService = new ComponentService();
        var components = await componentsService.getComponents(this.config.dir);
        var exportCommands = '';
        const DEP_DIR =
            './../../../src/app/pages/component/live-editor/component-dependences.ts';
        var promissesOfCopyFiles: any[] = [];
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
            promissesOfCopyFiles.push(this.copyDocFile(component.docPath));
        }
        promissesOfCopyFiles.push(
            fs.promises.writeFile(
                path.resolve(this.tsFileDirectory, DEP_DIR),
                exportCommands
            )
        );
        await Promise.all(promissesOfCopyFiles);
        return components;
    }
}
