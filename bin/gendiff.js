#!/usr/bin/env node
import { program } from 'commander';

program
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-h, --help', 'output usage information')

  program.parse();
  
  if (program.help) {
    program.outputHelp();
  }