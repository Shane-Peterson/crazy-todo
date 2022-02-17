#!/usr/bin/env node
const {Command} = require('commander');
const program = new Command()
const api = require('./index.js')
const pkg = require('./package.json')

program
  .version(pkg.version)
program
  .command('add <taskName...>')
  .description('add a task')
  .action((args) => {
    api.add(args).then(() => {
      console.log("success.");
    }, () => {
      console.log("failed to add task.");
    })
  });
program
  .command('clear')
  .description('clear all tasks')
  .action(() => {
    api.clear().then(() => {
      console.log("success.");
    }, () => {
      console.log("failed to clear task.");
    })
  });

program.parse(process.argv);

if (process.argv.length === 2) {
  void api.showAll()
}



