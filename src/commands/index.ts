#!/usr/bin/env node
import { Command } from 'commander';
import { Documentation } from './documentation/documentation';
import { AppConfig } from '../utils/config';

const program = new Command();
program
    .version('1.0.0')
    .description('With this application you could generate documentation')
    .command('server', { isDefault: true })
    .action(async () => {
        await AppConfig.bind();
        var docLib = new Documentation();
        docLib.start();
    });

program.command('build').action(async (cmd) => {
    await AppConfig.bind();
    var docLib = new Documentation();
    docLib.build();
});

program.parse(process.argv);
