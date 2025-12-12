// lib/generators/validation.js (NEW - add this file)
const fs = require("fs");
const path = require("path");

function createValidation(name, fields = [], projectRoot) {
    const validationDir = path.join(projectRoot, "src/validations");

    // Create directory if it doesn't exist
    if (!fs.existsSync(validationDir)) {
        fs.mkdirSync(validationDir, { recursive: true });
    }

    const filename = path.join(validationDir, `${name.toLowerCase()}.validation.js`);

    // Create validation rules from fields
    const createRules = fields.map(field => {
        const [fieldName] = field.includes(':') ? field.split(':') : [field];
        return `        ${fieldName}: Joi.string().required(),`;
    }).join('\n') || '        // Add validation rules here';

    const content = `const Joi = require('joi');

const ${name}Validation = {
    create: (req, res, next) => {
        const schema = Joi.object({
${createRules}
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        next();
    },

    update: (req, res, next) => {
        const schema = Joi.object({
${createRules.replace(/\.required\(\)/g, '.optional()')}
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        next();
    },

    idParam: (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().length(24).hex().required()
        });

        const { error } = schema.validate(req.params);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID format'
            });
        }
        next();
    }
};

module.exports = ${name}Validation;
`;

    fs.writeFileSync(filename, content.trim());
    console.log(`✅ Validation created: ${filename}`);
}

module.exports = createValidation;