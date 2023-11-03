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
            const rcFileContent = await fs.readFile('.compassrc', 'utf-8');
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
