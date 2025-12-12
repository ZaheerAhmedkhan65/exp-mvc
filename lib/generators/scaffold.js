// lib/generators/scaffold.js
const createModel = require("./model");
const createController = require("./controller");
const createRoute = require("./route");
const createService = require("./service");
const createValidation = require("./validation");

function createScaffold(name, fields, projectRoot) {
    console.log(`\n🚀 Creating scaffold for: ${name}\n`);

    createModel(name, fields, projectRoot);
    createService(name, projectRoot);
    createController(name, projectRoot);
    createRoute(name, projectRoot);
    createValidation(name, fields, projectRoot);

    console.log(`\n✅ Scaffold created for ${name}!`);
    console.log(`\n👉 Next steps:`);
    console.log(`   1. Update your main routes file (src/routes/index.js):`);
    console.log(`      router.use('/${name.toLowerCase()}s', require('./${name.toLowerCase()}.routes'));`);
    console.log(`   2. Configure your database connection`);
    console.log(`   3. Update validation rules in src/validations/${name.toLowerCase()}.validation.js`);
}

module.exports = createScaffold;