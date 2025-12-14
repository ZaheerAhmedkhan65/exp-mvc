// Create lib/generators/controllerWithViews.js
const fs = require("fs");
const path = require("path");

function createControllerWithViews(name, projectRoot) {
    const controllerDir = path.join(projectRoot, "src/controllers");

    if (!fs.existsSync(controllerDir)) {
        fs.mkdirSync(controllerDir, { recursive: true });
    }

    const filename = path.join(controllerDir, `${name.toLowerCase()}.controller.js`);

    const content = `// ${name} Controller with Views Support
const ${name}Service = require('../services/${name.toLowerCase()}.service');

class ${name}Controller {
    // Render index page
    async index(req, res) {
        try {
            const result = await ${name}Service.getAll(req.query);
            res.render('${name.toLowerCase()}s/index', {
                title: '${name}s List',
                ${name.toLowerCase()}s: result.${name.toLowerCase()}s,
                pagination: result.pagination
            });
        } catch (error) {
            console.error(error);
            res.status(500).render('error', { 
                title: 'Error', 
                message: 'Failed to load ${name}s' 
            });
        }
    }

    // Render show page
    async show(req, res) {
        try {
            const ${name.toLowerCase()} = await ${name}Service.getById(req.params.id);
            
            if (!${name.toLowerCase()}) {
                return res.status(404).render('error', { 
                    title: 'Not Found', 
                    message: '${name} not found' 
                });
            }
            
            res.render('${name.toLowerCase()}s/show', {
                title: '${name} Details',
                ${name.toLowerCase()}: ${name.toLowerCase()}
            });
        } catch (error) {
            console.error(error);
            res.status(500).render('error', { 
                title: 'Error', 
                message: 'Failed to load ${name}' 
            });
        }
    }

    // Render new form
    new(req, res) {
        res.render('${name.toLowerCase()}s/new', {
            title: 'Create New ${name}'
        });
    }

    // Handle create
    async store(req, res) {
        try {
            await ${name}Service.create(req.body);
            res.redirect('/${name.toLowerCase()}s');
        } catch (error) {
            console.error(error);
            res.render('${name.toLowerCase()}s/new', {
                title: 'Create New ${name}',
                error: error.message,
                ${name.toLowerCase()}: req.body
            });
        }
    }

    // Render edit form
    async edit(req, res) {
        try {
            const ${name.toLowerCase()} = await ${name}Service.getById(req.params.id);
            
            if (!${name.toLowerCase()}) {
                return res.status(404).render('error', { 
                    title: 'Not Found', 
                    message: '${name} not found' 
                });
            }
            
            res.render('${name.toLowerCase()}s/edit', {
                title: 'Edit ${name}',
                ${name.toLowerCase()}: ${name.toLowerCase()}
            });
        } catch (error) {
            console.error(error);
            res.status(500).render('error', { 
                title: 'Error', 
                message: 'Failed to load ${name}' 
            });
        }
    }

    // Handle update
    async update(req, res) {
        try {
            const ${name.toLowerCase()} = await ${name}Service.update(req.params.id, req.body);
            
            if (!${name.toLowerCase()}) {
                return res.status(404).render('error', { 
                    title: 'Not Found', 
                    message: '${name} not found' 
                });
            }
            
            res.redirect('/${name.toLowerCase()}s');
        } catch (error) {
            console.error(error);
            res.render('${name.toLowerCase()}s/edit', {
                title: 'Edit ${name}',
                error: error.message,
                ${name.toLowerCase()}: { ...req.body, id: req.params.id }
            });
        }
    }

    // Handle delete
    async destroy(req, res) {
        try {
            const deleted = await ${name}Service.delete(req.params.id);
            
            if (!deleted) {
                return res.status(404).render('error', { 
                    title: 'Not Found', 
                    message: '${name} not found' 
                });
            }
            
            res.redirect('/${name.toLowerCase()}s');
        } catch (error) {
            console.error(error);
            res.redirect('/${name.toLowerCase()}s');
        }
    }
}

module.exports = new ${name}Controller();
`;

    fs.writeFileSync(filename, content.trim());
    console.log(`✅ Controller with views support created: ${filename}`);
}

module.exports = createControllerWithViews;