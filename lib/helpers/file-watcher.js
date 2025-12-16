// lib/helpers/file-watcher.js
const chokidar = require('chokidar');
const path = require('path');
const DependencyChecker = require('./dependency-checker');

class FileWatcher {
    constructor(projectRoot = process.cwd()) {
        this.projectRoot = projectRoot;
        this.watcher = null;
        this.dependencyChecker = new DependencyChecker(projectRoot);
        this.isWatching = false;
        this.ignorePatterns = [
            /node_modules/,
            /\.git/,
            /package-lock\.json$/,
            /yarn\.lock$/,
            /\.log$/,
            /\.swp$/,
            /\.swo$/
        ];
    }

    async start() {
        if (this.isWatching) {
            console.log('⚠️  File watcher is already running');
            return;
        }

        console.log('👀 Starting file watcher for automatic dependency checking...');

        try {
            // Dynamically require chokidar after installation
            const chokidar = require('chokidar');

            // Watch for JS file changes in the project
            this.watcher = chokidar.watch([
                path.join(this.projectRoot, '**/*.js'),
                path.join(this.projectRoot, '**/*.ejs')
            ], {
                ignored: (filePath) => {
                    // Check all ignore patterns
                    return this.ignorePatterns.some(pattern => pattern.test(filePath));
                },
                persistent: true,
                ignoreInitial: true,
                awaitWriteFinish: {
                    stabilityThreshold: 500,
                    pollInterval: 100
                }
            });

            // Debounce to prevent multiple rapid triggers
            let timeout;
            const debounceTime = 1000; // 1 second
            let lastProcessed = {};

            const handleChange = async (filePath, event) => {
                const now = Date.now();
                const last = lastProcessed[filePath] || 0;

                // Skip if this file was processed recently
                if (now - last < 2000) { // 2 second cooldown per file
                    return;
                }

                clearTimeout(timeout);
                timeout = setTimeout(async () => {
                    console.log(`\n📝 ${event}: ${path.relative(this.projectRoot, filePath)}`);
                    await this.checkFileDependencies(filePath);
                    lastProcessed[filePath] = Date.now();
                }, debounceTime);
            };

            this.watcher
                .on('change', (filePath) => handleChange(filePath, 'File changed'))
                .on('add', (filePath) => handleChange(filePath, 'New file'));

            this.isWatching = true;
            console.log('✅ File watcher started successfully!');
            console.log('📋 Watching for changes in .js and .ejs files (ignoring node_modules)');
            console.log('💡 Press Ctrl+C to stop watching');

        } catch (error) {
            console.error('❌ Failed to start file watcher:', error.message);
        }
    }

    async checkFileDependencies(filePath) {
        try {
            // Double-check ignore patterns
            if (this.ignorePatterns.some(pattern => pattern.test(filePath))) {
                return;
            }

            if (path.extname(filePath) === '.js') {
                console.log(`🔍 Checking dependencies for ${path.basename(filePath)}...`);
                await this.dependencyChecker.checkAndInstallForFile(filePath);
            }
        } catch (error) {
            console.error(`❌ Error checking dependencies for ${filePath}:`, error.message);
        }
    }

    stop() {
        if (this.watcher) {
            this.watcher.close();
            console.log('🛑 File watcher stopped');
        }
        this.isWatching = false;
    }
}

module.exports = FileWatcher;