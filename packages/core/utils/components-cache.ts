import path from 'path';
import { AppConfig } from './app-config';
import { Component } from '../models/component.model';
import * as fs from 'fs-extra';

export declare type ComponentCacheData = Record<string, Component>;

///!! save basepath istead to get every time
export class ComponentCache {
    private static cache: ComponentCacheData;
    private static date: number;

    private static CACHE_FILE_PATH_DEF = 'components.cache.json';
    private static async getCacheFilePath() {
        let cacheFile = this.CACHE_FILE_PATH_DEF;
        if (!fs.existsSync(this.CACHE_FILE_PATH_DEF)) {
            const config = await AppConfig.read();
            cacheFile = path.join(config.buildFolder, 'components.cache.json');
        }
        return cacheFile;
    }

    static async write(cache: Record<string, Component>) {
        //!!validate to renew cache for some component
        await fs.writeFile(
            await this.getCacheFilePath(),
            JSON.stringify(cache),
            'utf8'
        );
    }

    static async read(): Promise<ComponentCacheData> {
        try {
            const CACHE_FILE_PATH = await this.getCacheFilePath();
            var fileStat = await fs.promises.stat(CACHE_FILE_PATH);
            if (this.cache && fileStat.mtimeMs === this.date) {
                return this.cache;
            }
            const cacheContent = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
            this.cache = JSON.parse(cacheContent)?.components || {};
            this.date = fileStat.mtimeMs;
            return this.cache;
        } catch (error) {
            //!! remove try and validate places
            throw error;
        }
    }
}
