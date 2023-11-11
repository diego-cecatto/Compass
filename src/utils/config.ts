import * as fs from 'fs-extra';

export type AppConfig = {
    port: number;
    dir: string;
};

export const DEF_CONFIG: AppConfig = {
    dir: './packages',
    port: 3000,
};

export class Config {
    static async read(): Promise<AppConfig> {
        try {
            if (!fs.existsSync('.compassrc')) {
                return DEF_CONFIG;
            }
            const rcFileContent = await fs.readFile('.compassrc', 'utf8');
            if (!rcFileContent) {
                return DEF_CONFIG;
            }
            const config: AppConfig = JSON.parse(rcFileContent);
            return config;
        } catch (error) {
            console.error('Error reading or parsing the RC file:', error);
            throw error;
        }
    }

    static readSync(): AppConfig {
        try {
            if (fs.existsSync('.compassrc')) {
                return DEF_CONFIG;
            }
            const rcFileContent = fs.readFileSync('.compassrc', 'utf8');
            if (!rcFileContent) {
                return DEF_CONFIG;
            }
            const config: AppConfig = JSON.parse(rcFileContent);
            return config;
        } catch (error) {
            console.error('Error reading or parsing the RC file:', error);
            throw error;
        }
    }
}
