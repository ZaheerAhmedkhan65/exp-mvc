#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { program } = require("commander");

// Auto-install dependencies function
async function autoInstallDependencies() {
    try {
        console.log("🔍 Checking for missing dependencies...");

        // Get the project's package.json
        const packageJsonPath = path.join(process.cwd(), 'package.json');

        if (!fs.existsSync(packageJsonPath)) {
            console.log("⚠️  No package.json found. Creating project first...");
            return;
        }

        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const installedDependencies = {
            ...(packageJson.dependencies || {}),
            ...(packageJson.devDependencies || {})
        };

        // Read all JS files in the project to find required packages
        function findAllJsFiles(dir, fileList = []) {
            const files = fs.readdirSync(dir);

            files.forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory() && !file.includes('node_modules')) {
                    findAllJsFiles(filePath, fileList);
                } else if (file.endsWith('.js') && !file.includes('node_modules')) {
                    fileList.push(filePath);
                }
            });

            return fileList;
        }

        // Get all JS files in project
        let jsFiles = [];
        if (fs.existsSync('.')) {
            jsFiles = findAllJsFiles('.');
        }

        // Common Express packages to check for (with exact npm package names)
        const commonPackages = {
            'express': 'express',
            'mongoose': 'mongoose',
            'dotenv': 'dotenv',
            'morgan': 'morgan',
            'ejs': 'ejs',
            'express-ejs-layouts': 'express-ejs-layouts',
            'joi': 'joi',
            'method-override': 'method-override',
            'helmet': 'helmet',
            'cors': 'cors',
            'compression': 'compression',
            'bcrypt': 'bcrypt',
            'jsonwebtoken': 'jsonwebtoken',
            'multer': 'multer',
            'nodemailer': 'nodemailer',
            'nodemon': 'nodemon'
        };

        const packagesToInstall = new Set();

        // Check each JS file for required imports
        for (const filePath of jsFiles) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');

                for (const [pkgName, importName] of Object.entries(commonPackages)) {
                    // Check for require statements
                    const requirePattern = new RegExp(`require\\(['"]${importName}['"]\\)`, 'i');
                    // Check for import statements
                    const importPattern = new RegExp(`from ['"]${importName}['"]`, 'i');

                    if ((requirePattern.test(content) || importPattern.test(content)) &&
                        !installedDependencies[pkgName]) {
                        packagesToInstall.add(pkgName);
                    }
                }
            } catch (error) {
                // Skip file read errors
            }
        }

        // Install missing packages if any
        if (packagesToInstall.size > 0) {
            const packagesArray = Array.from(packagesToInstall);
            console.log(`\n📦 Installing missing dependencies: ${packagesArray.join(', ')}`);

            try {
                // Install dev dependencies separately
                const devPackages = packagesArray.filter(pkg => pkg === 'nodemon');
                const regularPackages = packagesArray.filter(pkg => pkg !== 'nodemon');

                if (regularPackages.length > 0) {
                    console.log(`Installing: ${regularPackages.join(' ')}`);
                    execSync(`npm install ${regularPackages.join(' ')}`, {
                        stdio: 'inherit',
                        cwd: process.cwd()
                    });
                }

                if (devPackages.length > 0) {
                    console.log(`Installing dev dependencies: ${devPackages.join(' ')}`);
                    execSync(`npm install --save-dev ${devPackages.join(' ')}`, {
                        stdio: 'inherit',
                        cwd: process.cwd()
                    });
                }

                console.log('✅ All dependencies installed successfully!');
            } catch (error) {
                console.log('⚠️  Could not install dependencies automatically. Please run:');
                if (regularPackages.length > 0) {
                    console.log(`npm install ${regularPackages.join(' ')}`);
                }
                if (devPackages.length > 0) {
                    console.log(`npm install --save-dev ${devPackages.join(' ')}`);
                }
            }
        } else {
            console.log('✅ All dependencies are already installed!');
        }
    } catch (error) {
        console.log('⚠️  Error checking dependencies:', error.message);
    }
}

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
    .version("1.0.70");

program
    .command("new <project-name>")
    .description("Create a new Express MVC project (with auto-dependency installation)")
    .action(enhancedCreateProject);

program
    .command("generate <type> <name> [fields...]")
    .alias("g")
    .description("Generate CRUD components")
    .option("-f, --fields <fields>", "Model fields (name:string,email:string)")
    .action(async (type, name, fields, options) => {
        await autoInstallDependencies();
        generate(type, name, fields, options);
    });

program
    .command("relationship <type> <fromModel> <toModel>")
    .alias("rel")
    .description("Create relationships between models")
    .option("--field <fieldName>", "Field name for the relationship")
    .option("--required", "Make relationship required")
    .action(async (type, fromModel, toModel, options) => {
        await autoInstallDependencies();
        createRelationship(fromModel, toModel, type, {
            fieldName: options.field,
            required: options.required
        });
    });

program
    .command("scaffold-relationship <parentModel> <childModel> <relationshipType>")
    .alias("sr")
    .description("Scaffold complete relationship with models, services, and controllers")
    .action(async (parentModel, childModel, relationshipType) => {
        await autoInstallDependencies();
        createRelationshipScaffold(parentModel, childModel, relationshipType, process.cwd());
    });

program
    .command("check-deps")
    .alias("cd")
    .description("Check and install missing dependencies")
    .action(autoInstallDependencies);

program
    .command("fix-deps")
    .description("Fix missing dependencies and start the server")
    .action(async () => {
        await autoInstallDependencies();
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

// Parse arguments
program.parse(process.argv);

// Show help if no arguments
if (!process.argv.slice(2).length) {
    program.outputHelp();
}