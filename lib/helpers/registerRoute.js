//lib/helpers/registerRoute.js
const fs = require("fs");
const path = require("path");

// register route in src/routes/index.js
function registerRouteInIndex(name, projectRoot) {
    const indexPath = path.join(projectRoot, "src/routes/index.js");

    if (!fs.existsSync(indexPath)) {
        console.log("⚠️  routes/index.js not found, skipping route registration");
        return;
    }

    let indexContent = fs.readFileSync(indexPath, "utf8");
    const routeName = name.toLowerCase();
    const routeRequire = `const ${routeName}Routes = require('./${routeName}.routes');`;


    // Better pluralization logic
    let pluralRouteName;
    const lowerName = name.toLowerCase();

    // Handle common pluralization rules
    if (lowerName.endsWith('s') || lowerName.endsWith('x') || lowerName.endsWith('z') ||
        lowerName.endsWith('ch') || lowerName.endsWith('sh')) {
        pluralRouteName = `${lowerName}es`;
    } else if (lowerName.endsWith('y')) {
        // Check if letter before y is a consonant
        const secondLast = lowerName.charAt(lowerName.length - 2);
        const vowels = ['a', 'e', 'i', 'o', 'u'];
        if (vowels.includes(secondLast)) {
            pluralRouteName = `${lowerName}s`;
        } else {
            pluralRouteName = `${lowerName.slice(0, -1)}ies`;
        }
    } else {
        pluralRouteName = `${lowerName}s`;
    }

    const routeUse = `router.use('/${pluralRouteName}', ${routeName}Routes);`;

    // Check if route is already registered
    if (indexContent.includes(`require('./${routeName}.routes')`)) {
        console.log(`ℹ️  Route for ${name} already registered in index.js`);
        return;
    }

    // Clean approach: Parse the file and rebuild it properly
    const sections = {
        imports: [],
        homeRoute: [],
        otherRoutes: [],
        exports: []
    };

    let currentSection = 'imports';
    let braceCount = 0;
    const lines = indexContent.split('\n');

    // Parse the file into sections
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Track braces to know when we're inside the home route
        braceCount += (line.match(/{/g) || []).length;
        braceCount -= (line.match(/}/g) || []).length;

        // Determine which section we're in
        if (line.includes('router.get("/"') || line.includes('router.get("/",')) {
            currentSection = 'homeRoute';
            sections.homeRoute.push(line);
        } else if (line.includes('module.exports')) {
            currentSection = 'exports';
            sections.exports.push(line);
        } else if (currentSection === 'homeRoute' && braceCount === 0 && !line.includes('router.get')) {
            // We've exited the home route
            currentSection = 'otherRoutes';
            sections.otherRoutes.push(line);
        } else {
            sections[currentSection].push(line);
        }
    }

    // Add the new import to imports section
    sections.imports.push(routeRequire);

    // Add the new route to otherRoutes section
    if (sections.otherRoutes.length === 0 || sections.otherRoutes[sections.otherRoutes.length - 1].trim() === '') {
        sections.otherRoutes.push(routeUse);
    } else {
        sections.otherRoutes.push('', routeUse);
    }

    // Rebuild the file
    const rebuiltContent = [
        ...sections.imports.filter(l => l.trim() !== ''),
        '',
        ...sections.homeRoute,
        '',
        ...sections.otherRoutes.filter(l => l.trim() !== ''),
        '',
        ...sections.exports
    ].join('\n');

    fs.writeFileSync(indexPath, rebuiltContent);
    console.log(`✅ Route registered in src/routes/index.js at path: /${routeName}s`);
}

module.exports = { registerRouteInIndex };