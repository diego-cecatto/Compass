#!/usr/bin/env node
import { Command } from 'commander';
import { Documentation } from './documentation/documentation';
import { AppConfig } from '@compass-docgen/core';
import { CompassServer } from '@compass-docgen/server';
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
        if (
            fs.existsSync('/build/components.cache.json') ||
            fs.existsSync('/components.cache.json')
        ) {
            console.error(
                'Please run ---> compass build <--- first, to generate the build folder'
            );
            return;
        }
        const server = new CompassServer();
        server.start();
    });

program
    .command('build')
    .description('Build the documentation')
    .action(async () => {
        await buildApp();
    });

program.command('dev', { isDefault: true }).action(async () => {
    await buildApp();
    //pass along the configuration that is a dev version
    const server = new CompassServer();
    server.start({ env: 'DEV' });
});

program.parse(process.argv);
