#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const projectName = process.argv[2];

if (!projectName) {
    console.log("❗ Please provide a project name: ");
    console.log("Example: npx create-express-architecture myapp");
    process.exit(1);
}

const projectPath = path.join(process.cwd(), projectName);

// Create a directory safely
function createDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log("📁 Created:", dir);
    }
}

// Create files with content
function createFile(filePath, content = "") {
    fs.writeFileSync(filePath, content);
    console.log("📝 Created:", filePath);
}

// ------------------------
//   Project Architecture
// ------------------------

console.log(`\n🚀 Creating Express project architecture in '${projectName}'...\n`);

createDir(projectPath);

const dirs = [
    "src/controllers",
    "src/models",
    "src/routes",
    "src/services",
    "src/helpers",
    "src/middlewares",
    "src/validations",
    "src/utils",
    "src/jobs",
    "src/views",
    "src/assets/css",
    "src/assets/js",
    "src/assets/images",
    "src/assets/uploads",
    "config"
];

dirs.forEach(dir => createDir(path.join(projectPath, dir)));

// ------------------------
//   Create Files
// ------------------------

createFile(
    path.join(projectPath, "server.js"),
    `require("dotenv").config();
const app = require("./config/app");
const connectDB = require("./config/database");

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
`
);

createFile(
    path.join(projectPath, "config/app.js"),
    `const express = require("express");
const morgan = require("morgan");
const routes = require("../src/routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// API Routes
app.use("/api", routes);

module.exports = app;
`
);

createFile(
    path.join(projectPath, "config/database.js"),
    `// Database Connection (Customize as needed)
module.exports = function connectDB() {
    console.log("⚡ Database connected (configure this manually)");
};
`
);

createFile(
    path.join(projectPath, "src/routes/index.js"),
    `const express = require("express");
const router = express.Router();

// Example: router.use("/users", require("./user.routes"));

router.get("/", (req, res) => {
    res.send("API is working! 🚀");
});

module.exports = router;
`
);

createFile(
    path.join(projectPath, "src/controllers/example.controller.js"),
    `// Example Controller
module.exports.example = (req, res) => {
    res.send("Example Controller Working!");
};
`
);

createFile(
    path.join(projectPath, "src/services/example.service.js"),
    `// Example Service
module.exports.hello = () => {
    return "Hello from Service!";
};
`
);

createFile(
    path.join(projectPath, "README.md"),
    `# ${projectName}

Generated with **express-mvc-architecture**.

## ✔ Project Architecture Ready

Run:

\`\`\`
npm install
npm run dev
\`\`\`

Now build your app inside:

- src/controllers
- src/routes
- src/services
- src/models
- etc.

🚀 Happy coding!
`
);

console.log("\n🎉 Done!");
console.log(`\n👉 Next steps:
   cd ${projectName}
   npm install express dotenv morgan
`);
