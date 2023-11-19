import * as fs from 'fs-extra';
import path from 'path';
import { Normalizer } from './normalizer';

export type Config = {
    port: number;
    dir: string;
    favicon?: string;
    name: string;
};

export const DEF_CONFIG: Config = {
    dir: './packages',
    port: 3000,
    name: 'Compass',
};

export class AppConfig {
    static tsFileDirectory = path.dirname(__filename);
    static cacheFile = `${AppConfig.tsFileDirectory}/../../.compassrc.cache`;
    static async bind(
        configLocation: string = '.compassrc'
    ): Promise<AppConfig> {
        try {
            if (!(await fs.exists(configLocation))) {
                configLocation = `config/${configLocation}`;
                if (!(await fs.exists(configLocation))) {
                    return DEF_CONFIG;
                }
            }
            const rcFileContent = await fs.readFile(configLocation, 'utf8');
            if (!rcFileContent) {
                return DEF_CONFIG;
            }
            const config: Config = {
                ...DEF_CONFIG,
                ...AppConfig.resolveName(JSON.parse(rcFileContent)),
            };
            await fs.writeFile(AppConfig.cacheFile, JSON.stringify(config));
            return AppConfig;
        } catch (error) {
            console.error('Error reading or parsing the RC file:', error);
            throw error;
        }
    }

    static async read(): Promise<Config> {
        try {
            const json = await fs.readFile(AppConfig.cacheFile, 'utf-8');
            return JSON.parse(json);
        } catch (error) {
            console.error('Error reading or parsing the RC file:', error);
            throw error;
        }
    }

    static readSync(): Config {
        try {
            const json = fs.readFileSync(AppConfig.cacheFile, 'utf-8');
            return JSON.parse(json);
        } catch (error) {
            console.error('Error reading or parsing the RC file:', error);
            throw error;
        }
    }

    private static resolveName(config: Config) {
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
