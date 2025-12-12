#!/usr/bin/env node

const { program } = require("commander");
const createProject = require("../commands/new");
const generate = require("../commands/generate");

program
    .name("expmvc")
    .description("Express MVC Architecture CLI")
    .version("1.0.4");

program
    .command("new <project-name>")
    .description("Create a new Express MVC project")
    .action(createProject);

program
    .command("generate <type> <name> [fields...]")
    .alias("g")
    .description("Generate CRUD components")
    .option("-f, --fields <fields>", "Model fields (name:string,email:string)")
    .action(generate);

program.parse(process.argv);

// If no arguments, show help
if (!process.argv.slice(2).length) {
    program.outputHelp();
}