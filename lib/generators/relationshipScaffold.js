const fs = require("fs");
const path = require("path");

function createRelationshipScaffold(parentModel, childModel, relationshipType, projectRoot) {
    console.log(`\n🚀 Creating ${relationshipType} relationship: ${parentModel} -> ${childModel}\n`);

    // Create models if they don't exist
    const parentModelFile = path.join(projectRoot, "src/models", `${parentModel.toLowerCase()}.model.js`);
    const childModelFile = path.join(projectRoot, "src/models", `${childModel.toLowerCase()}.model.js`);

    if (!fs.existsSync(parentModelFile)) {
        console.log(`Creating ${parentModel} model...`);
        const parentContent = `const mongoose = require('mongoose');

const ${parentModel}Schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        lowercase: true
    }
}, {
    timestamps: true
});

${parentModel}Schema.index({ email: 1 });

module.exports = mongoose.model('${parentModel}', ${parentModel}Schema);`;

        fs.writeFileSync(parentModelFile, parentContent);
        console.log(`✅ Created ${parentModel} model`);
    }

    if (!fs.existsSync(childModelFile)) {
        console.log(`Creating ${childModel} model...`);

        let childContent;
        if (relationshipType === 'belongsTo') {
            // Child belongs to parent
            childContent = `const mongoose = require('mongoose');

const ${childModel}Schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    ${parentModel.toLowerCase()}Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: '${parentModel}',
        required: true
    }
}, {
    timestamps: true
});

${childModel}Schema.index({ ${parentModel.toLowerCase()}Id: 1 });
${childModel}Schema.index({ createdAt: -1 });

// Virtual for parent details
${childModel}Schema.virtual('${parentModel.toLowerCase()}Details', {
    ref: '${parentModel}',
    localField: '${parentModel.toLowerCase()}Id',
    foreignField: '_id',
    justOne: true
});

${childModel}Schema.set('toJSON', { virtuals: true });
${childModel}Schema.set('toObject', { virtuals: true });

module.exports = mongoose.model('${childModel}', ${childModel}Schema);`;
        } else if (relationshipType === 'hasMany') {
            // Parent has many children
            childContent = `const mongoose = require('mongoose');

const ${childModel}Schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    }
}, {
    timestamps: true
});

${childModel}Schema.index({ createdAt: -1 });

module.exports = mongoose.model('${childModel}', ${childModel}Schema);`;

            // Update parent model to include reference
            let parentContent = fs.readFileSync(parentModelFile, 'utf8');
            const hasManyField = `    ${childModel.toLowerCase()}s: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: '${childModel}',
        default: []
    }]`;

            // Insert into parent schema
            const schemaEnd = parentContent.indexOf('}, {');
            const beforeSchemaEnd = parentContent.lastIndexOf('\n', schemaEnd);
            parentContent = parentContent.slice(0, beforeSchemaEnd) +
                ',\n\n' + hasManyField +
                parentContent.slice(beforeSchemaEnd);

            // Add virtual to parent
            const virtualContent = `${parentModel}Schema.virtual('${childModel.toLowerCase()}Details', {
    ref: '${childModel}',
    localField: '${childModel.toLowerCase()}s',
    foreignField: '_id'
});`;

            if (parentContent.includes('// Virtuals')) {
                const virtualIndex = parentContent.indexOf('// Virtuals');
                const insertIndex = parentContent.indexOf('\n', virtualIndex) + 1;
                parentContent = parentContent.slice(0, insertIndex) +
                    '\n' + virtualContent +
                    parentContent.slice(insertIndex);
            } else {
                // Add virtuals section
                const beforeExports = parentContent.lastIndexOf('\nmodule.exports');
                parentContent = parentContent.slice(0, beforeExports) +
                    '\n\n// Virtuals\n' + virtualContent +
                    parentContent.slice(beforeExports);
            }

            parentContent = parentContent.replace('module.exports',
                `${parentModel}Schema.set('toJSON', { virtuals: true });
${parentModel}Schema.set('toObject', { virtuals: true });

module.exports`);

            fs.writeFileSync(parentModelFile, parentContent);
        }

        fs.writeFileSync(childModelFile, childContent);
        console.log(`✅ Created ${childModel} model`);
    }

    // Create services
    const serviceDir = path.join(projectRoot, "src/services");
    if (!fs.existsSync(serviceDir)) {
        fs.mkdirSync(serviceDir, { recursive: true });
    }

    // Create parent service if it doesn't exist
    const parentServiceFile = path.join(serviceDir, `${parentModel.toLowerCase()}.service.js`);
    if (!fs.existsSync(parentServiceFile)) {
        const parentServiceContent = `const ${parentModel} = require('../models/${parentModel.toLowerCase()}.model');

class ${parentModel}Service {
    async getAll(query = {}) {
        try {
            const { page = 1, limit = 10, sort = '-createdAt', populate = '', ...filters } = query;
            
            let queryBuilder = ${parentModel}.find(filters);
            
            if (populate) {
                const populateFields = populate.split(',');
                populateFields.forEach(field => {
                    queryBuilder = queryBuilder.populate(field);
                });
            }
            
            const ${parentModel.toLowerCase()}s = await queryBuilder
                .sort(sort)
                .limit(limit * 1)
                .skip((page - 1) * limit);
            
            const total = await ${parentModel}.countDocuments(filters);
            
            return {
                ${parentModel.toLowerCase()}s,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(\`Error fetching ${parentModel.toLowerCase()}s: \${error.message}\`);
        }
    }

    async getById(id, populate = '') {
        try {
            let query = ${parentModel}.findById(id);
            
            if (populate) {
                const populateFields = populate.split(',');
                populateFields.forEach(field => {
                    query = query.populate(field);
                });
            }
            
            return await query;
        } catch (error) {
            throw new Error(\`Error fetching ${parentModel.toLowerCase()}: \${error.message}\`);
        }
    }

    async create(data) {
        try {
            const ${parentModel.toLowerCase()} = new ${parentModel}(data);
            return await ${parentModel.toLowerCase()}.save();
        } catch (error) {
            throw new Error(\`Error creating ${parentModel.toLowerCase()}: \${error.message}\`);
        }
    }

    async update(id, data) {
        try {
            return await ${parentModel}.findByIdAndUpdate(
                id,
                { \$set: data },
                { new: true, runValidators: true }
            );
        } catch (error) {
            throw new Error(\`Error updating ${parentModel.toLowerCase()}: \${error.message}\`);
        }
    }

    async delete(id) {
        try {
            return await ${parentModel}.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(\`Error deleting ${parentModel.toLowerCase()}: \${error.message}\`);
        }
    }
    
    ${relationshipType === 'hasMany' ? `
    // ${childModel} relationship methods
    async add${childModel}(${parentModel.toLowerCase()}Id, ${childModel.toLowerCase()}Id) {
        try {
            return await ${parentModel}.findByIdAndUpdate(
                ${parentModel.toLowerCase()}Id,
                { \$push: { ${childModel.toLowerCase()}s: ${childModel.toLowerCase()}Id } },
                { new: true }
            );
        } catch (error) {
            throw new Error(\`Error adding ${childModel.toLowerCase()}: \${error.message}\`);
        }
    }

    async remove${childModel}(${parentModel.toLowerCase()}Id, ${childModel.toLowerCase()}Id) {
        try {
            return await ${parentModel}.findByIdAndUpdate(
                ${parentModel.toLowerCase()}Id,
                { \$pull: { ${childModel.toLowerCase()}s: ${childModel.toLowerCase()}Id } },
                { new: true }
            );
        } catch (error) {
            throw new Error(\`Error removing ${childModel.toLowerCase()}: \${error.message}\`);
        }
    }
    ` : ''}
}

module.exports = new ${parentModel}Service();`;

        fs.writeFileSync(parentServiceFile, parentServiceContent);
        console.log(`✅ Created ${parentModel} service`);
    }

    console.log(`\n🎉 Relationship scaffold created successfully!`);
    console.log(`\n👉 Relationship: ${parentModel} ${relationshipType} ${childModel}`);
    console.log(`\n📁 Created/Updated files:`);
    console.log(`   - src/models/${parentModel.toLowerCase()}.model.js`);
    console.log(`   - src/models/${childModel.toLowerCase()}.model.js`);
    console.log(`   - src/services/${parentModel.toLowerCase()}.service.js`);
}

module.exports = createRelationshipScaffold;