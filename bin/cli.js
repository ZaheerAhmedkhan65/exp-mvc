#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { program } = require("commander");
const watch = require('../commands/watch');
const checkDeps = require('../commands/check-deps');

// Improved project creation with auto-install
async function enhancedCreateProject(projectName) {
    const createProject = require("../commands/new");

    // First create the project
    createProject(projectName);

    // Then change to project directory and install dependencies
    const projectPath = path.join(process.cwd(), projectName);

    if (fs.existsSync(projectPath)) {
        console.log("\n🔧 Setting up project dependencies...");
        const originalCwd = process.cwd();

        try {
            // Change to project directory
            process.chdir(projectPath);

            // Read package.json to see what needs to be installed
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const dependencies = packageJson.dependencies || {};
            const devDependencies = packageJson.devDependencies || {};

            // Combine all dependencies
            const allDeps = { ...dependencies, ...devDependencies };

            if (Object.keys(allDeps).length > 0) {
                console.log(`📦 Installing ${Object.keys(allDeps).length} dependencies...`);

                try {
                    // Install regular dependencies
                    if (Object.keys(dependencies).length > 0) {
                        const depsList = Object.keys(dependencies);
                        console.log(`Installing: ${depsList.join(' ')}`);
                        execSync(`npm install ${depsList.join(' ')}`, {
                            stdio: 'inherit',
                            cwd: process.cwd()
                        });
                    }

                    // Install dev dependencies
                    if (Object.keys(devDependencies).length > 0) {
                        const devDepsList = Object.keys(devDependencies);
                        console.log(`Installing dev dependencies: ${devDepsList.join(' ')}`);
                        execSync(`npm install --save-dev ${devDepsList.join(' ')}`, {
                            stdio: 'inherit',
                            cwd: process.cwd()
                        });
                    }

                    console.log('\n🎉 Project created successfully with all dependencies installed!');
                    console.log(`👉 Next steps:
   cd ${projectName}
   npm start
`);
                } catch (error) {
                    console.log('⚠️  Could not install all dependencies automatically.');
                    console.log('Please run manually:');
                    console.log(`cd ${projectName}`);
                    console.log('npm install');
                }
            }

            // Change back to original directory
            process.chdir(originalCwd);

        } catch (error) {
            process.chdir(originalCwd);
            console.log('⚠️  Error during project setup:', error.message);
        }
    }
}

// Load other commands
const generate = require("../commands/generate");
const createRelationship = require("../lib/generators/relationship");
const createRelationshipScaffold = require("../lib/generators/relationshipScaffold");

// Main CLI setup
program
    .name("expmvc")
    .description("Express MVC Architecture CLI with Auto-Dependency Installation")
    .version("1.2.0");

program
    .command("new <project-name>")
    .description("Create a new Express MVC project (with auto-dependency installation)")
    .action(enhancedCreateProject);

program
    .command("generate <type> <name> [fields...]")
    .alias("g")
    .description("Generate CRUD components")
    .option("-f, --fields <fields>", "Model fields (name:string,email:string)")
    .action((type, name, fields, options) => {
        generate(type, name, fields, options);
    });

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

program
    .command("check-deps")
    .alias("cd")
    .description("Check and install missing dependencies")
    .action(checkDeps);

program
    .command("fix-deps")
    .description("Fix missing dependencies and start the server")
    .action(async () => {
        await checkDeps();
        console.log("\n🚀 Starting server...");
        try {
            execSync("npm start", {
                stdio: 'inherit',
                cwd: process.cwd()
            });
        } catch (error) {
            console.log("❌ Failed to start server.");
        }
    });

program
    .command('watch') // Add this command
    .description('Watch for file changes and auto-check dependencies')
    .action(watch);

// Parse arguments
program.parse(process.argv);

// Show help if no arguments
if (!process.argv.slice(2).length) {
    program.outputHelp();
}