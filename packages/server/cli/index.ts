#!/usr/bin/env node
import { Command } from 'commander';
import { CompassServer } from '../server';
import fs from 'fs';

const program = new Command();
program.version('1.0.0').description('CLI to run server');

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

program.parse(process.argv);
