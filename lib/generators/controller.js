// lib/generators/controller.js
const fs = require("fs");
const path = require("path");

function createController(name, projectRoot) {
    const controllerDir = path.join(projectRoot, "src/controllers");

    // Create directory if it doesn't exist
    if (!fs.existsSync(controllerDir)) {
        fs.mkdirSync(controllerDir, { recursive: true });
    }

    const filename = path.join(controllerDir, `${name.toLowerCase()}.controller.js`);

    const content = `// ${name} Controller
const ${name.toLowerCase()}Service = require('../services/${name.toLowerCase()}.service');

class ${name}Controller {
    async index(req, res) {
        try {
            const data = await ${name.toLowerCase()}Service.getAll();
            res.json({
                success: true,
                data: data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params;
            const data = await ${name.toLowerCase()}Service.getById(id);
            
            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: '${name} not found'
                });
            }
            
            res.json({
                success: true,
                data: data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async store(req, res) {
        try {
            const data = await ${name.toLowerCase()}Service.create(req.body);
            res.status(201).json({
                success: true,
                data: data
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const data = await ${name.toLowerCase()}Service.update(id, req.body);
            
            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: '${name} not found'
                });
            }
            
            res.json({
                success: true,
                data: data
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async destroy(req, res) {
        try {
            const { id } = req.params;
            const deleted = await ${name.toLowerCase()}Service.delete(id);
            
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: '${name} not found'
                });
            }
            
            res.json({
                success: true,
                message: '${name} deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new ${name}Controller();
`;

    fs.writeFileSync(filename, content.trim());
    console.log(`✅ Controller created: ${filename}`);
}

module.exports = createController;