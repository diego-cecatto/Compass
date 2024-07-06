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
program
    .version('1.0.0')
    .description(
        'Compass:: Help to build and create a version of your components documentation'
    );

program
    .command('start', { isDefault: true })
    .description(
        'Build the documentation, will generate a build folder with the documentation files and also will START your lirary in a local server'
    )
    .action(async (cmd: { clean?: boolean }) => {
        const conf = await AppConfig.bind();
        if (!fs.existsSync(`./${conf.buildFolder}/components.cache.json`)) {
            console.warn(
                'Compiling documentation for the first time, this may take a while...'
            );
            await buildApp();
        }
        const server = new CompassServer();
        server.start();
    });

program
    .command('build')
    .description(
        'Build the documentation, will generate a build folder with the documentation files'
    )
    .action(async () => {
        await buildApp();
        console.log(
            'To run documentation use ---> compass start <--- in dev environment'
        );
    });

program.command('dev', { isDefault: true }).action(async () => {
    await buildApp();
    const server = new CompassServer();
    const conf = await AppConfig.bind();
    server.start({ env: 'DEV', resourcePath: conf.buildFolder });
});

program.parse(process.argv);
