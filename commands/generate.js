// commands/generate.js
const fs = require("fs");
const path = require("path");
const createController = require("../lib/generators/controller");
const createModel = require("../lib/generators/model");
const createRoute = require("../lib/generators/route");
const createView = require("../lib/generators/view");
const createScaffold = require("../lib/generators/scaffold");

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
        case "view":
            return createView(name, projectRoot);
        case "scaffold":
            return createScaffold(name, fields, projectRoot);
        default:
            console.log("❌ Unknown generator type. Use: controller, model, route, view, or scaffold");
            process.exit(1);
    }
};