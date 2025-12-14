// lib/generators/route.js
const fs = require("fs");
const path = require("path");

function createRoute(name, projectRoot) {
    const routeDir = path.join(projectRoot, "src/routes");

    // Create directory if it doesn't exist
    if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
    }

    const filename = path.join(routeDir, `${name.toLowerCase()}.routes.js`);

    const content = `const express = require('express');
const router = express.Router();
const ${name}Controller = require('../controllers/${name.toLowerCase()}.controller');
const validate = require('../validations/${name.toLowerCase()}.validation');
// const authMiddleware = require('../middlewares/auth.middleware');

// Apply authentication middleware to all routes if needed
// router.use(authMiddleware);

// GET all ${name}s
router.get('/', ${name}Controller.index);

// GET new ${name} form
router.get('/new', ${name}Controller.new);

// GET single ${name}
router.get('/:id', ${name}Controller.show);

// GET edit User
router.get('/:id/edit', ${name}Controller.edit);

// POST create ${name}
router.post('/', /* validate.create, */ ${name}Controller.store);

// PUT update ${name}
router.put('/:id', /* validate.update, */ ${name}Controller.update);

// DELETE ${name}
router.delete('/:id', ${name}Controller.destroy);

module.exports = router;
`;

    fs.writeFileSync(filename, content.trim());
    console.log(`✅ Route created: ${filename}`);
}

module.exports = createRoute;