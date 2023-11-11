import * as fs from 'fs';
import * as path from 'path';
import { get } from 'http';

export class Publisher {
    componentsDir = path.join(__dirname, 'src', 'components');
    NPM_REGISTRY_URL = 'registry.npmjs.org';
    PACKAGE_NAME = '@your-scope/package-name'; // Replace with your package name

    getLatestVersion = async (): Promise<string> => {
        const registryUrl = await this.readNpmRegistryUrl();
        return new Promise((resolve, reject) => {
            get(`${registryUrl}/${this.PACKAGE_NAME}`, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(data);
                        resolve(parsedData['dist-tags'].latest);
                    } catch (error) {
                        reject(error);
                    }
                });
            }).on('error', (error) => {
                reject(error);
            });
        });
    };

    readNpmRegistryUrl = async (): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            fs.readFile(
                path.join(
                    process.env.HOME || process.env.USERPROFILE || '',
                    '.npmrc'
                ),
                'utf8',
                (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        const registryUrlMatch = data.match(
                            /^registry\s*=\s*(.*)$/m
                        );
                        if (registryUrlMatch && registryUrlMatch[1]) {
                            resolve(registryUrlMatch[1]);
                        } else {
                            resolve(this.NPM_REGISTRY_URL); // Default to the public npm registry
                        }
                    }
                }
            );
        });
    };

    generatePackageJson = async (componentName: string): Promise<void> => {
        const latestVersion = await this.getLatestVersion();
        const [major, minor, patch] = latestVersion.split('.').map(Number);
        const newVersion = `${major}.${minor}.${patch + 1}`;

        const packageJson = {
            name: `@your-scope/${componentName}`,
            version: newVersion,
            main: 'index.js',
            // Add other fields as needed
        };
        //todo description
        //map and add dependencies here, could create a .compass folder to deploy components?
        const packageJsonPath = path.join(
            this.componentsDir,
            componentName,
            'package.json'
        );
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    };

    //todo copy assets
    //todo compile files
    //todo generate pack
    //todo put into node_modules
}

// const componentFolders = fs.readdirSync(this.componentsDir);

// componentFolders.forEach(async (componentName: string) => {
//     const componentPath = path.join(this.componentsDir, componentName);
//     const indexPath = path.join(componentPath, 'index.ts');

//     if (fs.existsSync(indexPath)) {
//         await this.generatePackageJson(componentName);
//     }
// });
