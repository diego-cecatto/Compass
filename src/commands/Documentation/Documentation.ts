import { execSync } from 'child_process';
import { Server } from '../Server/Server';
import { ComponentService } from '../../services/component.service';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

export class Documentation {
    async start() {
        await this.dependences();
        const command = 'npm run build';
        execSync(command);
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
            } } from '../../../../../${component.path.replace(
                '.tsx',
                ''
            )}'; \n`;
        }
        fs.writeFileSync(
            './src/app/pages/component/live-editor/component.dependences.ts',
            exportCommands
        );
    }
}
