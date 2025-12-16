//commands/check-deps.js

const fs = require("fs");
const path = require("path");

async function checkDeps() {
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

module.exports = checkDeps;