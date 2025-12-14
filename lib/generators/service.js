// lib/generators/service.js (NEW - add this file)
const fs = require("fs");
const path = require("path");

function createService(name, projectRoot) {
    const serviceDir = path.join(projectRoot, "src/services");

    if (!fs.existsSync(serviceDir)) {
        fs.mkdirSync(serviceDir, { recursive: true });
    }

    const filename = path.join(serviceDir, `${name.toLowerCase()}.service.js`);

    // Check if model has relationships
    const modelFile = path.join(projectRoot, "src/models", `${name.toLowerCase()}.model.js`);
    let hasRelationships = false;

    if (fs.existsSync(modelFile)) {
        const modelContent = fs.readFileSync(modelFile, 'utf8');
        hasRelationships = modelContent.includes('Schema.Types.ObjectId');
    }

    const content = `const ${name} = require('../models/${name.toLowerCase()}.model');

class ${name}Service {
    async getAll(query = {}) {
        try {
            const { page = 1, limit = 10, sort = '-createdAt', populate = '', ...filters } = query;
            
            let queryBuilder = ${name}.find(filters);
            
            // Populate relationships if requested
            if (populate) {
                const populateFields = populate.split(',');
                populateFields.forEach(field => {
                    queryBuilder = queryBuilder.populate(field);
                });
            }
            
            const ${name.toLowerCase()}s = await queryBuilder
                .sort(sort)
                .limit(limit * 1)
                .skip((page - 1) * limit);
            
            const total = await ${name}.countDocuments(filters);
            
            return {
                ${name.toLowerCase()}s,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(\`Error fetching ${name.toLowerCase()}s: \${error.message}\`);
        }
    }

    async getById(id, populate = '') {
        try {
            let query = ${name}.findById(id);
            
            // Populate relationships if requested
            if (populate) {
                const populateFields = populate.split(',');
                populateFields.forEach(field => {
                    query = query.populate(field);
                });
            }
            
            return await query;
        } catch (error) {
            throw new Error(\`Error fetching ${name.toLowerCase()}: \${error.message}\`);
        }
    }

    async create(data) {
        try {
            const ${name.toLowerCase()} = new ${name}(data);
            return await ${name.toLowerCase()}.save();
        } catch (error) {
            throw new Error(\`Error creating ${name.toLowerCase()}: \${error.message}\`);
        }
    }

    async update(id, data) {
        try {
            return await ${name}.findByIdAndUpdate(
                id,
                { \$set: data },
                { new: true, runValidators: true }
            );
        } catch (error) {
            throw new Error(\`Error updating ${name.toLowerCase()}: \${error.message}\`);
        }
    }

    async delete(id) {
        try {
            return await ${name}.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(\`Error deleting ${name.toLowerCase()}: \${error.message}\`);
        }
    }

    ${hasRelationships ? `
    // Relationship methods
    async addRelationship(${name.toLowerCase()}Id, relatedId, relationshipField) {
        try {
            return await ${name}.findByIdAndUpdate(
                ${name.toLowerCase()}Id,
                { \$push: { [relationshipField]: relatedId } },
                { new: true }
            );
        } catch (error) {
            throw new Error(\`Error adding relationship: \${error.message}\`);
        }
    }

    async removeRelationship(${name.toLowerCase()}Id, relatedId, relationshipField) {
        try {
            return await ${name}.findByIdAndUpdate(
                ${name.toLowerCase()}Id,
                { \$pull: { [relationshipField]: relatedId } },
                { new: true }
            );
        } catch (error) {
            throw new Error(\`Error removing relationship: \${error.message}\`);
        }
    }
    ` : ''}
}

module.exports = new ${name}Service();
`;

    fs.writeFileSync(filename, content.trim());
    console.log(`✅ Service created: ${filename}`);
}

module.exports = createService;