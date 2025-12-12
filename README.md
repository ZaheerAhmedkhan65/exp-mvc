### express-mvc-architecture

[![npm version](https://img.shields.io/badge/npm-v1.0.1-lightgrey.svg)](https://www.npmjs.com/)
[![downloads](https://img.shields.io/npm/dm/express-mvc-architecture.svg)](https://www.npmjs.com/package/express-mvc-architecture)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![stars](https://img.shields.io/github/stars/ZaheerAhmedkhan65/express-mvc-architecture.svg?style=social)](https://github.com/ZaheerAhmedkhan65/express-mvc-architecture)'

A professional Node.js Express project scaffold generator that instantly creates a clean, scalable, and production-ready folder structure based on the MVC architecture.

Designed for developers who want to skip boilerplate setup and start building features immediately.

### 🚀 Features

- Generates a complete Express project structure

- Follows industry-standard MVC architecture

- Includes folders for:

- Controllers

- Routes

- Models

- Services

- Helpers

- Middlewares

- Jobs

- Validations

- Utils

- Views

- Assets (CSS, JS, images, uploads)

- Config directory (app + database config)

- Creates starter files with helpful comments

- Works instantly via npx—no global install required

### 📁 Generated Project Structure
```
myproject/
│
├── server.js
├── .env.example
├── README.md
│
├── config/
│   ├── app.js
│   ├── database.js
│
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── helpers/
│   ├── middlewares/
│   ├── validations/
│   ├── utils/
│   ├── jobs/
│   ├── views/
│   └── assets/
│       ├── css/
│       ├── js/
│       ├── images/
│       └── uploads/
│
└── package.json   (you will install your own dependencies)
```

**This structure is suitable for:**

- REST APIs

- Full-stack Node.js apps

- MVC-based Express projects

- Scalable enterprise applications

### 🛠 Installation & Usage

**Using NPX (recommended):**

```bash
npx create-express-architecture myapp
```
This will create:

```bash
./myapp
```
with the full project architecture.

**Using NPM (global install):**

```bash
npm install -g express-mvc-architecture
npx create-express-architecture myapp

```

### ▶ Next Steps After Generation

Inside your generated project folder, install dependencies:

```bash
cd myapp
npm install express dotenv morgan
```

Run the server:

```bash
node server.js
```

Or install nodemon for development:

```bash
npm install --save-dev nodemon
npm run dev
```


### ✨ Why Use This Generator?

- Saves hours of manual setup

- Enforces clean architecture

- Easy to scale and maintain

- Perfect for:

- Students

- Backend developers

- Startups

- API bootstrapping

- Hackathons

### ❤️ Contributing

Pull requests are welcome.

If you want a feature added:

```bash
open an issue
```

**Thanks for using this package! Don't forget to give a star if you like it.**


