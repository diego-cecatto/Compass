#!/usr/bin/env node
import { Command } from 'commander';
import { Documentation } from './documentation/documentation';

const program = new Command();
program
    .version('1.0.0')
    .description('With this application you could generate documentation')
    .command('server', { isDefault: true })
    .action(() => {
        var docLib = new Documentation();
        docLib.start();
    });

program
    .command('build')
    .option('--out <outputDir>', 'Specify the output directory')
    .action((cmd) => {
        const { out } = cmd;
        console.log(`Building with output directory: ${out}`);
        // Your build logic here
    });

program.parse(process.argv);
