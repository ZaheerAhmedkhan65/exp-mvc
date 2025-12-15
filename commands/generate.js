// commands/generate.js
const fs = require("fs");
const path = require("path");
const createController = require("../lib/generators/controller");
const createModel = require("../lib/generators/model");
const createRoute = require("../lib/generators/route");
const createService = require("../lib/generators/service");
const createScaffold = require("../lib/generators/scaffold");
const createValidation = require("../lib/generators/validation");
const createViewScaffold = require("../lib/generators/viewScaffold");
const createControllerWithViews = require("../lib/generators/controllerWithViews");
const createRelationship = require("../lib/generators/relationship");
const createRelationshipScaffold = require("../lib/generators/relationshipScaffold");

module.exports = function (type, name, fields) {
    // Ensure we're in the right directory (project root)
    const projectRoot = process.cwd();

    switch (type.toLowerCase()) {
        case "controller":
            return createController(name, projectRoot);
        case "model":
            return createModel(name, fields, projectRoot);
        case "route":
            return createRoute(name, projectRoot);
        case "service":
            return createService(name, projectRoot);
        case "validation":
            return createValidation(name, fields, projectRoot);
        case "relationship":
            return createRelationship(name, fields, projectRoot);
        case "relationship-scaffold":
            return createRelationshipScaffold(name, fields, projectRoot);
        case "view-scaffold":
            return createViewScaffold(name, fields, projectRoot);
        case "controller-with-views":
            return createControllerWithViews(name, projectRoot);
        case "view":
            // For single view generation, create just the basic file
            const viewDir = path.join(projectRoot, "src/views");
            if (!fs.existsSync(viewDir)) {
                fs.mkdirSync(viewDir, { recursive: true });
            }

            const filename = path.join(viewDir, `${name.toLowerCase()}.ejs`);
            const content = `<h1>${name} View</h1>
<p>This is the ${name} view file.</p>`;

            fs.writeFileSync(filename, content.trim());
            console.log(`✅ View created: ${filename}`);
            return;
        case "scaffold":
            return createScaffold(name, fields, projectRoot);
        default:
            console.log("❌ Unknown generator type. Use: controller, model, route, view, or scaffold");
            process.exit(1);
    }
};