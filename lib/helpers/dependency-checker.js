//lib/helpers/dependency-checker.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DependencyChecker {
    constructor(projectRoot = process.cwd()) {
        this.projectRoot = projectRoot;
        this.packageJsonPath = path.join(projectRoot, 'package.json');
        this.installedDependencies = null;
    }

    loadDependencies() {
        if (!fs.existsSync(this.packageJsonPath)) {
            return {};
        }

        try {
            const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
            this.installedDependencies = {
                ...(packageJson.dependencies || {}),
                ...(packageJson.devDependencies || {})
            };
            return this.installedDependencies;
        } catch (error) {
            console.error('Error reading package.json:', error.message);
            return {};
        }
    }

    isInstalled(packageName) {
        if (!this.installedDependencies) {
            this.loadDependencies();
        }
        return packageName in this.installedDependencies;
    }

    // lib/helpers/dependency-checker.js - Update extractRequiredPackages method
    extractRequiredPackages(filePath) {
        if (!fs.existsSync(filePath)) {
            return [];
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const packages = [];

        // Remove comments first to avoid matching commented-out requires
        const withoutComments = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

        // Match require statements (excluding commented ones)
        const requireMatches = withoutComments.match(/require\(['"]([^'"]+)['"]\)/g) || [];
        requireMatches.forEach(match => {
            const pkg = match.match(/require\(['"]([^'"]+)['"]\)/)[1];
            // Only include packages that are not local paths
            if (!pkg.startsWith('.') && !pkg.startsWith('/') && !pkg.startsWith('@')) {
                packages.push(pkg);
            }
        });

        // Match import statements (excluding commented ones)
        const importMatches = withoutComments.match(/from\s+['"]([^'"]+)['"]/g) || [];
        importMatches.forEach(match => {
            const pkg = match.match(/from\s+['"]([^'"]+)['"]/)[1];
            if (!pkg.startsWith('.') && !pkg.startsWith('/') && !pkg.startsWith('@')) {
                packages.push(pkg);
            }
        });

        return [...new Set(packages)]; // Remove duplicates
    }

    async installPackage(packageName, isDev = false) {
        try {
            console.log(`📦 Installing ${packageName}...`);
            const command = `npm install ${isDev ? '--save-dev' : '--save'} ${packageName}`;
            execSync(command, {
                stdio: 'inherit',
                cwd: this.projectRoot
            });
            console.log(`✅ ${packageName} installed successfully!`);
            return true;
        } catch (error) {
            console.error(`❌ Failed to install ${packageName}:`, error.message);
            return false;
        }
    }

    async installMultiplePackages(packages, isDev = false) {
        if (packages.length === 0) return true;

        try {
            console.log(`📦 Installing packages: ${packages.join(', ')}...`);
            const command = `npm install ${isDev ? '--save-dev' : '--save'} ${packages.join(' ')}`;
            execSync(command, {
                stdio: 'inherit',
                cwd: this.projectRoot
            });
            console.log(`✅ Packages installed successfully!`);
            return true;
        } catch (error) {
            console.error(`❌ Failed to install packages:`, error.message);
            console.log(`Please run manually: npm install ${isDev ? '--save-dev' : '--save'} ${packages.join(' ')}`);
            return false;
        }
    }

    async checkAndInstallForFile(filePath) {
        const requiredPackages = this.extractRequiredPackages(filePath);
        const packagesToInstall = [];

        for (const pkg of requiredPackages) {
            if (!this.isInstalled(pkg)) {
                packagesToInstall.push(pkg);
            }
        }

        if (packagesToInstall.length > 0) {
            return await this.installMultiplePackages(packagesToInstall);
        }

        return true;
    }

    async checkProjectDependencies() {
        console.log('🔍 Checking project dependencies...');

        // Check main server file
        const serverPath = path.join(this.projectRoot, 'server.js');
        await this.checkAndInstallForFile(serverPath);

        // Check config directory
        const configDir = path.join(this.projectRoot, 'config');
        if (fs.existsSync(configDir)) {
            const configFiles = fs.readdirSync(configDir)
                .filter(file => file.endsWith('.js'))
                .map(file => path.join(configDir, file));

            for (const file of configFiles) {
                await this.checkAndInstallForFile(file);
            }
        }

        // Check models directory
        const modelsDir = path.join(this.projectRoot, 'src/models');
        if (fs.existsSync(modelsDir)) {
            const modelFiles = fs.readdirSync(modelsDir)
                .filter(file => file.endsWith('.js'))
                .map(file => path.join(modelsDir, file));

            for (const file of modelFiles) {
                await this.checkAndInstallForFile(file);
            }
        }

        // Check routes directory
        const routesDir = path.join(this.projectRoot, 'src/routes');
        if (fs.existsSync(routesDir)) {
            const routeFiles = fs.readdirSync(routesDir)
                .filter(file => file.endsWith('.js'))
                .map(file => path.join(routesDir, file));

            for (const file of routeFiles) {
                await this.checkAndInstallForFile(file);
            }
        }

        console.log('✅ Dependency check completed!');
    }

    async watchForChanges() {
        try {
            const FileWatcher = require('./file-watcher');
            const watcher = new FileWatcher(this.projectRoot);
            await watcher.start();
            return watcher;
        } catch (error) {
            console.error('❌ Failed to start file watcher:', error.message);
            return null;
        }
    }
}

module.exports = DependencyChecker;