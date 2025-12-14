//commands/new.js

const fs = require("fs");
const path = require("path");

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

function createProject(projectName) {
    if (!projectName) {
        console.log("❗ Please provide a project name: ");
        console.log("Example: npx create-express-architecture myapp");
        process.exit(1);
    }

    const projectPath = path.join(process.cwd(), projectName);

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
        "src/views/layouts",
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
        `// config/app.js
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");
const routes = require("../src/routes/index");
const path = require("path");

const app = express();

app.use(methodOverride("_method"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.set("views", path.join(__dirname, "../src/views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

app.set("layout", "layouts/application");

// API Routes
app.use("/", routes);

module.exports = app;
`
    );

    createFile(
        path.join(projectPath, "config/database.js"),
        `// config/database.js
const mongoose = require("mongoose");
require("dotenv).config();

module.exports = async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("⚡ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
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
        path.join(projectPath, "src/views/layouts/application.ejs"),
        `<--!-- Application Layout -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title || 'exp-mvc' %></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.datatables.net/1.11.5/css/dataTables.bootstrap5.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-4">
        <%- body %>
    </div>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.11.5/js/dataTables.bootstrap5.min.js"></script>
</body>
</html>
`
    );

    createFile(
        path.join(projectPath, "README.md"),
        `# ${projectName}

Generated with **exp-mvc**.

## ✔ Project Architecture Ready

Run:

\`\`\`
cd ${projectName}
npm install express dotenv morgan ejs express-ejs-layouts mongoose joi method-override
node server.js
\`\`\`

Now build your app inside:

- ${projectName}

🚀 Happy coding!
`
    );

    createFile(
        path.join(projectPath, ".gitignore"),
        `
# Development
.git/
.gitignore
.npmignore
.editorconfig

# Environment files
.env
.env.local
.env.test
.env.example

# Logs
*.log
npm-debug.log*

node_modules

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo
EOF
    `
    );

    createFile(
        path.join(projectPath, ".env"),
        `
PORT=3000
MONGODB_URI=mongodb://localhost:27017/yourdb
JWT_SECRET=your-secret-key
NODE_ENV=development
    `
    );

    console.log("\n🎉 Done!");
    console.log(`\n👉 Next steps:
   cd ${projectName}
   npm install express dotenv morgan ejs express-ejs-layouts mongoose joi method-override
   node server.js
`);

    process.exit(0);
}

module.exports = createProject;