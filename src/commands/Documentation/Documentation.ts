import { execSync } from 'child_process';
import { Server } from '../Server/Server';
import { ComponentService } from '../../services/component.service';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export class Documentation {
    tsFileDirectory = path.dirname(__filename);

    async start() {
        //todo print env file
        console.log('Starting server');
        console.log(process.env.SCOPE);
        // await this.dependences();
        // const buildCommand = `set BUILD_PATH=${path.resolve(
        //     this.tsFileDirectory + '/../../../'
        // )}
        // && set PUBLIC_URL=${path.resolve(
        //     this.tsFileDirectory + '/../../../public'
        // )}
        // && react-scripts build`;
        // execSync(buildCommand, { stdio: 'inherit' });
        // const server = new Server();
        // server.start();
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
                '/../../app/pages/component/live-editor/component.dependences.ts',
            exportCommands
        );
    }
}
