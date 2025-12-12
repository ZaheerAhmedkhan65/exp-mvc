// lib/generators/model.js
const fs = require("fs");
const path = require("path");

function createModel(name, fields = [], projectRoot) {
    const modelDir = path.join(projectRoot, "src/models");

    // Create directory if it doesn't exist
    if (!fs.existsSync(modelDir)) {
        fs.mkdirSync(modelDir, { recursive: true });
    }

    const filename = path.join(modelDir, `${name.toLowerCase()}.model.js`);

    // Create fields schema
    const fieldDefinitions = fields.map(field => {
        const [fieldName, fieldType] = field.includes(':') ?
            field.split(':') : [field, 'String'];

        const typeMapping = {
            'string': 'String',
            'number': 'Number',
            'boolean': 'Boolean',
            'date': 'Date',
            'array': 'Array',
            'objectid': 'Schema.Types.ObjectId'
        };

        return `    ${fieldName}: {
        type: ${typeMapping[fieldType.toLowerCase()] || 'String'},
        ${fieldType.toLowerCase() === 'string' ? 'trim: true,' : ''}
        required: [true, '${fieldName} is required']
    }`;
    }).join(',\n\n');

    const content = `const mongoose = require('mongoose');

const ${name}Schema = new mongoose.Schema({
${fieldDefinitions || '    // Add your fields here'}
}, {
    timestamps: true
});

// Indexes
${name}Schema.index({ createdAt: -1 });

// Virtuals or Methods can be added here
${name}Schema.methods.toJSON = function() {
    const ${name.toLowerCase()} = this.toObject();
    ${name.toLowerCase()}.id = ${name.toLowerCase()}._id;
    delete ${name.toLowerCase()}._id;
    delete ${name.toLowerCase()}.__v;
    return ${name.toLowerCase()};
};

module.exports = mongoose.model('${name}', ${name}Schema);
`;

    fs.writeFileSync(filename, content.trim());
    console.log(`✅ Model created: ${filename}`);
}

module.exports = createModel;