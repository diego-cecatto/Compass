import * as fs from 'fs-extra';
import path from 'path';
import { Normalizer } from './normalizer.browser';
import { StringFormat } from './string-format.helper';

export type AppConfiguration = {
    port: number;
    componentsPath: string;
    buildFolder: string;
    favicon?: string;
    name: string;
};

export const DEF_CONFIG: AppConfiguration = {
    componentsPath: './packages',
    port: 3000,
    buildFolder: 'documentation',
    name: 'Compass',
};

export declare type BuildParams = { env: 'DEV' | 'PROD'; resourcePath: string };

export class AppConfig {
    static tsFileDirectory = path.dirname(__filename);
    // static cacheFile = `{0}/.compassrc.cache`;
    static async bind(
        configLocation: string = '.compassrc'
    ): Promise<AppConfiguration> {
        try {
            // if (!(await fs.exists(configLocation))) {
            //     configLocation = `config/${configLocation}`;
            //     if (!(await fs.exists(configLocation))) {
            //         this.createBuildFolder(DEF_CONFIG.build);
            //         return DEF_CONFIG;
            //     }
            // }
            const rcFileContent = await fs.readFile(configLocation, 'utf8');
            if (!rcFileContent) {
                // this.createBuildFolder(DEF_CONFIG.build);
                return DEF_CONFIG;
            }
            return {
                ...DEF_CONFIG,
                ...AppConfig.resolveName(JSON.parse(rcFileContent)),
            };

            // this.createBuildFolder(config.build);
            // await fs.writeFile(
            //     StringFormat.format(AppConfig.cacheFile, config.build),
            //     JSON.stringify(config)
            // );
            // return AppConfig;
        } catch (error) {
            console.error('Error reading or parsing the RC file:', error);
            throw error;
        }
    }

    // private static createBuildFolder(folder: string) {
    //     if (!fs.existsSync(`./${folder}`)) {
    //         fs.mkdirSync(`./${folder}`);
    //     }
    // }

    // static getCacheFile() {
    //     let cacheFileLocation = `.compassrc.cache`;
    //     if (!fs.existsSync(cacheFileLocation)) {
    //         cacheFileLocation = StringFormat.format(
    //             AppConfig.cacheFile,
    //             config.build
    //         );
    //     }
    //     return cacheFileLocation;
    // }

    static async read(): Promise<AppConfiguration> {
        try {
            // const json = await fs.readFile(AppConfig.getCacheFile(), 'utf-8');
            // return JSON.parse(json);
            return await AppConfig.bind();
        } catch (error) {
            console.error('Error reading or parsing the RC file:', error);
            throw error;
        }
    }

    // static readSync(): Config {
    //     try {
    //         const json = fs.readFileSync(AppConfig.getCacheFile(), 'utf-8');
    //         return JSON.parse(json);
    //     } catch (error) {
    //         console.error('Error reading or parsing the RC file:', error);
    //         throw error;
    //     }
    // }

    public static resolveName(config: AppConfiguration) {
        if (!config.name) {
            if (fs.existsSync('./package.json')) {
                var packageJson = fs.readFileSync('./package.json', 'utf-8');
                if (packageJson) {
                    config.name = Normalizer.capitalizePackageName(
                        JSON.parse(packageJson).name,
                        ' '
                    );
                }
            }
        }
        return config;
    }
}
