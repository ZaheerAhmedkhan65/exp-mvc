const createModel = require("./model");
const createController = require("./controller");
const createRoute = require("./route");
const createService = require("./service");
const createValidation = require("./validation");
const createViewScaffold = require("./viewScaffold");
const createControllerWithViews = require("./controllerWithViews");

// Update createScaffold function in scaffold.js
function createScaffold(name, fields, projectRoot) {
    console.log(`\n🚀 Creating scaffold for: ${name}\n`);

    createModel(name, fields, projectRoot);
    createService(name, projectRoot);
    createControllerWithViews(name, projectRoot); // Use this instead
    createRoute(name, projectRoot); // You'll need to create this too
    createValidation(name, fields, projectRoot);
    createViewScaffold(name, fields, projectRoot);

    console.log(`\n✅ Scaffold created for ${name}!`);
    console.log(`\n👉 Next steps:`);
    console.log(`   1. Install dependencies: npm install ejs method-override`);
    console.log(`   2. Add this to app.js:\n`);
    console.log(`      const path = require('path');`);
    console.log(`      const methodOverride = require('method-override');\n`);
    console.log(`      // View engine setup`);
    console.log(`      app.set('view engine', 'ejs');`);
    console.log(`      app.set('views', path.join(__dirname, 'src/views'));\n`);
    console.log(`      // Method override for PUT/DELETE`);
    console.log(`      app.use(methodOverride('_method'));\n`);
    console.log(`   3. Add your route in src/routes/index.js:`);
    console.log(`      router.use('/${name.toLowerCase()}s', require('./${name.toLowerCase()}.routes'));`);
}

module.exports = createScaffold;