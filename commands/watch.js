// commands/watch.js
const FileWatcher = require('../lib/helpers/file-watcher');

module.exports = async function watch() {
    const projectRoot = process.cwd();
    const watcher = new FileWatcher(projectRoot);

    try {
        await watcher.start();

        // Handle graceful shutdown
        process.on('SIGINT', () => {
            watcher.stop();
            process.exit(0);
        });

        // Keep the process alive
        await new Promise(() => { });
    } catch (error) {
        console.error('❌ Failed to start watch mode:', error.message);
        process.exit(1);
    }
};