// lib/generators/service.js (NEW - add this file)
const fs = require("fs");
const path = require("path");

function createService(name, projectRoot) {
    const serviceDir = path.join(projectRoot, "src/services");

    // Create directory if it doesn't exist
    if (!fs.existsSync(serviceDir)) {
        fs.mkdirSync(serviceDir, { recursive: true });
    }

    const filename = path.join(serviceDir, `${name.toLowerCase()}.service.js`);

    const content = `const ${name} = require('../models/${name.toLowerCase()}.model');

class ${name}Service {
    async getAll(query = {}) {
        try {
            const { page = 1, limit = 10, sort = '-createdAt', ...filters } = query;
            
            const ${name.toLowerCase()}s = await ${name}.find(filters)
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

    async getById(id) {
        try {
            return await ${name}.findById(id);
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
}

module.exports = new ${name}Service();
`;

    fs.writeFileSync(filename, content.trim());
    console.log(`✅ Service created: ${filename}`);
}

module.exports = createService;