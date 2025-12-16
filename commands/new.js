//commands/new.js

const fs = require("fs");
const path = require("path");
const expMvcPkg = require("../package.json");

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
    copyAssetImage(projectPath, 'logo.png');
    copyAssetImage(projectPath, 'favicon.ico');
    // ------------------------
    //   Create Files
    // ------------------------

    createFile(
        path.join(projectPath, "server.js"),
        `require("dotenv").config();
const app = require("./config/app");
const connectDB = require("./config/database");

// Optional security middleware (auto-installed if used)
// Uncomment to use:
// const helmet = require("helmet");
// const cors = require("cors");
// const compression = require("compression");
//
// app.use(helmet());
// app.use(cors());
// app.use(compression());

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on http://localhost:" + PORT));
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
const notFound = require("../src/middlewares/notFound");
const errorHandler = require("../src/middlewares/errorHandler");
const path = require("path");

const app = express();

app.use(methodOverride("_method"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(
    "/assets",
    express.static(path.join(__dirname, "../src/assets"))
);

app.set("views", path.join(__dirname, "../src/views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

app.set("layout", "layouts/application");

// API Routes
app.use("/", routes);

// 404 handler (NO route matched)
app.use(notFound);

// Error handler (ANY error)
app.use(errorHandler);

module.exports = app;
`
    );

    createFile(
        path.join(projectPath, "config/database.js"),
        `// config/database.js
const mongoose = require("mongoose");
require("dotenv").config();

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
        path.join(projectPath, "src/middlewares/errorHandler.js"),
        `// src/middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
    console.error("🔥 Error:", err);

    const statusCode = err.status || 500;

    res.status(statusCode).render("error", {
        statusCode,
        title:"ERROR",
        message: err.message || "Internal Server Error",
        path: req.originalUrl,
        suggestions: [
            "Check server logs for details",
            "Validate request payload",
            "Check database connection",
            "Handle errors using try/catch"
        ]
    });
};
`
    );

    createFile(
        path.join(projectPath, "src/middlewares/notFound.js"),
        `// src/middlewares/notFound.js
module.exports = (req, res, next) => {
    res.status(404).render("error", {
        statusCode: 404,
        title:"ERROR",
        message: "Route not found",
        path: req.originalUrl,
        suggestions: [
            "Check the URL spelling",
            "Make sure the route exists in src/routes",
            "Did you forget to register the route?",
            "Restart the server after changes"
        ]
    });
};
`
    );

    createFile(
        path.join(projectPath, "src/routes/index.js"),
        `//routes/index.js
const express = require("express");
const router = express.Router();
const path = require("path");

const appPkg = require(path.join(process.cwd(), "package.json"));

// Home route
router.get("/", (req, res) => {
    res.render("home", {
        title: "Home",
        appName: appPkg.name,
        appVersion: appPkg.version,
        expMvcVersion: "${expMvcPkg.version}",
        nodeVersion: process.version,
        expressVersion: require("express/package.json").version
    });
});

// Import and use other routes here

module.exports = router;
`
    );

    createFile(
        path.join(projectPath, "src/views/layouts/application.ejs"),
        `<!-- Application Layout -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title || 'exp-mvc' %></title>
    <link rel="shortcut icon" href="/assets/images/favicon.ico" type="image/x-icon">
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
        path.join(projectPath, "src/views/home.ejs"),
        `<!-- Home -->
<div class="container-fluid d-flex flex-column justify-content-center align-items-center min-vh-100 py-5">
    <div class="text-center mb-5 w-100">
        <!-- Logo -->
        <div class="mb-4">
            <img src="/assets/images/logo.png" alt="Logo" width="256" />
        </div>

        <!-- Title -->
        <h1 class="display-5 fw-bold text-primary mb-3">
            <%= appName %>
        </h1>

        <!-- Subtitle -->
        <p class="lead text-muted mb-4">Express MVC Architecture Builder</p>

        <!-- Version Cards -->
        <div class="row justify-content-center g-3 mb-5">
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body text-center py-4">
                        <h6 class="card-subtitle mb-2 text-muted">Exp-MVC version</h6>
                        <h4 class="card-title fw-bold text-primary">
                            <%= expMvcVersion %>
                        </h4>
                    </div>
                </div>
            </div>

            <div class="col-12 col-md-6 col-lg-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body text-center py-4">
                        <h6 class="card-subtitle mb-2 text-muted">Express version</h6>
                        <h4 class="card-title fw-bold text-primary">
                            <%= expressVersion %>
                        </h4>
                    </div>
                </div>
            </div>

            <div class="col-12 col-md-6 col-lg-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body text-center py-4">
                        <h6 class="card-subtitle mb-2 text-muted">Node.js version</h6>
                        <h4 class="card-title fw-bold text-primary">
                            <%= nodeVersion %>
                        </h4>
                    </div>
                </div>
            </div>
        </div>

        <!-- Optional: Quick Info Panel -->
        <div class="bg-light rounded-3 p-4 shadow-sm">
            <div class="row text-center">
                <div class="col-md-4 mb-3 mb-md-0">
                    <div class="text-muted small">Framework</div>
                    <div class="fw-semibold">Express MVC</div>
                </div>
                <div class="col-md-4 mb-3 mb-md-0">
                    <div class="text-muted small">Architecture</div>
                    <div class="fw-semibold">Model-View-Controller</div>
                </div>
                <div class="col-md-4">
                    <div class="text-muted small">Environment</div>
                    <div class="fw-semibold">Node.js Runtime</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer Note -->
    <div class="mt-5 text-center">
        <p class="text-muted small">
            Built with <i class="bi bi-heart-fill text-danger"></i> using Bootstrap 5
        </p>
    </div>
</div>
`
    );

    createFile(
        path.join(projectPath, "src/views/error.ejs"),
        `<!-- Error -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Error <%= statusCode %></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<div class="container">
    <div class="p-5">
        <h1 class="text-danger">❌ <%= statusCode %></h1>
        <h4 class="mb-3"><%= message %></h4>

        <p class="text-muted">
            Path: <code><%= path %></code>
        </p>

        <hr />

        <h6>💡 How to fix this</h6>
        <ul class="text-start">
            <% suggestions.forEach(s => { %>
                <li><%= s %></li>
            <% }) %>
        </ul>
    </div>
</div>

</body>
</html>
`
    );

     createFile(
        path.join(projectPath, "package.json"),
        JSON.stringify(
            {
                name: projectName,
                version: "0.1.0",
                description: "",
                main: "server.js",
                scripts: {
                    start: "node server.js",
                    dev: "nodemon server.js",
                    "check-deps": "expmvc check-deps",
                    "fix-deps": "expmvc fix-deps"
                },
                author: "",
                license: "ISC",
                devDependencies: {
                    "nodemon": "^3.0.1"
                },
                engines: {
                    node: ">=14.0.0"
                },
                dependencies: {
                    express: "^4.19.2",
                    dotenv: "^16.4.5",
                    morgan: "^1.10.0",
                    ejs: "^3.1.9",
                    "express-ejs-layouts": "^2.5.1",
                    mongoose: "^8.8.1",
                    joi: "^17.11.0",
                    "method-override": "^3.0.0"
                }
            },
            null,
            2
        )
    );

    createFile(
        path.join(projectPath, "package.json"),
        JSON.stringify(
            {
                name: projectName,
                version: "0.1.0",
                description: "",
                main: "server.js",
                scripts: {
                    start: "node server.js",
                    dev: "nodemon server.js"
                },
                author: "",
                license: "ISC",
                devDependencies: {
                    "nodemon": "^3.0.1"
                },
                engines: {
                    node: ">=14.0.0"
                },
                dependencies: {
                    express: "^4.19.2",
                    dotenv: "^16.4.5",
                    morgan: "^1.10.0",
                    ejs: "^3.1.9",
                    "express-ejs-layouts": "^2.5.1",
                    mongoose: "^8.8.1",
                    joi: "^17.11.0",
                    "method-override": "^3.0.0"
                }
            },
            null,
            2
        )
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

function copyAssetImage(projectPath, fileName) {
    const logoSource = path.join(__dirname, "../assets/" + fileName);
    const logoDestination = path.join(
        projectPath,
        "src/assets/images/" + fileName
    );

    if (fs.existsSync(logoSource)) {
        fs.copyFileSync(logoSource, logoDestination);
        console.log(`🖼️ ${fileName} is added to ${projectPath}`);
    }
}

module.exports = createProject;