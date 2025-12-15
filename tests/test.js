const path = require('path');
const fs = require('fs');

console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);

// Try to load the commands
try {
    const newCmd = require('../commands/new');
    console.log('✅ Successfully loaded commands/new');
} catch (error) {
    console.log('❌ Error loading commands/new:', error.message);
}   

try {
    const generateCmd = require('../commands/generate');
    console.log('✅ Successfully loaded commands/generate');
} catch (error) {
    console.log('❌ Error loading commands/generate:', error.message);
}

// Check if files exist
console.log('\nFile checks:');
console.log('commands/new.js exists:', fs.existsSync(path.join(__dirname, '../commands/new.js')));
console.log('commands/generate.js exists:', fs.existsSync(path.join(__dirname, '../commands/generate.js')));