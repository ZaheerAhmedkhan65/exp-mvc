#!/usr/bin/env node

const { program } = require("commander");
const createProject = require("../commands/new");
const generate = require("../commands/generate");
const createRelationship = require("../lib/generators/relationship");
const createRelationshipScaffold = require("../lib/generators/relationshipScaffold");

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

// New relationship commands
program
    .command("relationship <type> <fromModel> <toModel>")
    .alias("rel")
    .description("Create relationships between models")
    .option("--field <fieldName>", "Field name for the relationship")
    .option("--required", "Make relationship required")
    .action((type, fromModel, toModel, options) => {
        createRelationship(fromModel, toModel, type, {
            fieldName: options.field,
            required: options.required
        });
    });

program
    .command("scaffold-relationship <parentModel> <childModel> <relationshipType>")
    .alias("sr")
    .description("Scaffold complete relationship with models, services, and controllers")
    .action((parentModel, childModel, relationshipType) => {
        createRelationshipScaffold(parentModel, childModel, relationshipType, process.cwd());
    });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}