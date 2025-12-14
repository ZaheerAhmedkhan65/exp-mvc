// lib/generators/model.js
const fs = require("fs");
const path = require("path");

function createModel(name, fields = [], projectRoot) {
    const modelDir = path.join(projectRoot, "src/models");

    if (!fs.existsSync(modelDir)) {
        fs.mkdirSync(modelDir, { recursive: true });
    }

    const filename = path.join(modelDir, `${name.toLowerCase()}.model.js`);

    // Parse fields and separate relationships
    const regularFields = [];
    const relationshipFields = [];

    fields.forEach(field => {
        if (field.includes(':ref:')) {
            relationshipFields.push(field);
        } else {
            regularFields.push(field);
        }
    });

    // Create regular field definitions
    const fieldDefinitions = regularFields.map(field => {
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

        const fieldDef = `    ${fieldName}: {
        type: ${typeMapping[fieldType.toLowerCase()] || 'String'},
        ${fieldType.toLowerCase() === 'string' ? 'trim: true,' : ''}
        required: [true, '${fieldName} is required']
    }`;

        return fieldDef;
    }).join(',\n\n');

    // Create relationship field definitions
    const relationshipDefinitions = relationshipFields.map(field => {
        const parts = field.split(':');
        const fieldName = parts[0];
        const refModel = parts[2];

        // Check if it's an array reference (one-to-many) or single reference
        if (field.includes('[]')) {
            return `    ${fieldName.replace('[]', '')}: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: '${refModel}',
        default: []
    }]`;
        } else {
            return `    ${fieldName}: {
        type: mongoose.Schema.Types.ObjectId,
        ref: '${refModel}',
        required: false
    }`;
        }
    }).join(',\n\n');

    // Combine all fields
    const allFieldDefinitions = [fieldDefinitions, relationshipDefinitions]
        .filter(f => f)
        .join(',\n\n');

    const content = `const mongoose = require('mongoose');

const ${name}Schema = new mongoose.Schema({
${allFieldDefinitions || '    // Add your fields here'}
}, {
    timestamps: true
});

// Indexes
${name}Schema.index({ createdAt: -1 });
${relationshipFields.map(field => {
        const parts = field.split(':');
        const fieldName = parts[0].replace('[]', '');
        const refModel = parts[2];
        if (!field.includes('[]')) {
            return `${name}Schema.index({ ${fieldName}: 1 });`;
        }
        return '';
    }).filter(f => f).join('\n')}

// Virtuals
${relationshipFields.filter(f => !f.includes('[]')).map(field => {
        const parts = field.split(':');
        const fieldName = parts[0];
        const refModel = parts[2];
        return `${name}Schema.virtual('${fieldName}Details', {
    ref: '${refModel}',
    localField: '${fieldName}',
    foreignField: '_id',
    justOne: true
});`;
    }).join('\n\n')}

${relationshipFields.filter(f => f.includes('[]')).map(field => {
        const parts = field.split(':');
        const fieldName = parts[0].replace('[]', '');
        const refModel = parts[2];
        return `${name}Schema.virtual('${fieldName}Details', {
    ref: '${refModel}',
    localField: '${fieldName}',
    foreignField: '_id'
});`;
    }).join('\n\n')}

// Enable virtuals in JSON output
${name}Schema.set('toJSON', { virtuals: true });
${name}Schema.set('toObject', { virtuals: true });

// Methods
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