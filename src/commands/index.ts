#!/usr/bin/env node
import { Command } from 'commander';
import { Documentation } from './documentation/documentation';
import { AppConfig } from '../utils/config';
import { CompassServer } from './server/server';
import fs from 'fs';

const buildApp = async () => {
    await AppConfig.bind();
    var docLib = new Documentation();
    await docLib.build();
};

const program = new Command();
program.version('1.0.0').description('CLI to generate documentation');

program
    .command('start', { isDefault: true })
    .action(async (cmd: { clean?: boolean }) => {
        if (fs.existsSync('./build')) {
            console.error(
                'Please run compass build first, to generate the build folder'
            );
            return;
        }
        const server = new CompassServer();
        server.start();
    });

program
    .command('build')
    .description('Build the documentation')
    .action(buildApp);

program
    .command('dev', { isDefault: true })
    .action(async (cmd: { clean?: boolean }) => {
        console.log('Starting building application');
        await buildApp();
        console.log('Starting server');
        const server = new CompassServer();
        server.start();
    });

program.parse(process.argv);
