## exp-mvc

[![npm version](https://img.shields.io/badge/npm-v1.0.7-lightgrey.svg)](https://www.npmjs.com/)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![stars](https://img.shields.io/github/stars/ZaheerAhmedkhan65/exp-mvc.svg?style=social)](https://github.com/ZaheerAhmedkhan65/exp-mvc.git)'

A professional Node.js Express project scaffold generator that instantly creates a clean, scalable, and production-ready folder structure based on the MVC architecture. Includes powerful CLI commands to generate controllers, models, routes, and complete CRUD scaffolds.

Designed for developers who want to skip boilerplate setup and start building features immediately.

# Install

```bash
npm install exp-mvc
```

After installing exp-mvc globally, run the following command:

```bash
expmvc new myapp
```

This will create:

```bash
./myapp
```
with the full project architecture.

Inside your generated project folder, install dependencies:

```bash
cd myapp
npm install
```

configure the database connection in 'config/database.js'.
add environment variables in '.env'

**Run the server:**

```bash
npm run dev
```
or
```bash
npm start
```

# 🔥 CLI Commands Reference

Once inside your generated project, use the *`expmvc`* command to generate components:

**Generate Complete CRUD Scaffold**

Create a full CRUD module with controller, model, service, route, and validation files:

```bash
expmvc generate scaffold User name:string email:string password:string age:number
```

**Generate Individual Components**

## Generate a controller
```bash
expmvc generate controller Product
```

## Generate a model with fields
```bash
expmvc generate model Category name:string description:string
```

## Generate a route
```bash
expmvc generate route Order
```

## Generate a service
```bash
expmvc generate service Auth
```

## Generate a validation file
```bash
expmvc generate validation User
```

## Generate a view (EJS template)
```bash
expmvc generate view home/index
```

**Command Aliases**

## 'g' is alias for 'generate'
'expmvc g scaffold User name:string email:string'
## Short forms
```bash
expmvc g c User        # controller
```
```bash
expmvc g m User        # model
```
```bash
expmvc g r User        # route
```
```bash
expmvc g s User        # service
```
```bash
expmvc g v User        # validation
```

# Relations Between Models

## 1. Generate Individual Models with References:

```bash
# Generate User model
expmvc generate model User name:string email:string password:string

# Generate Post model with User reference
expmvc generate model Post title:string content:string user:ref:User

# Generate Comment model with User and Post references
expmvc generate model Comment content:string user:ref:User post:ref:Post
```

## 2. Create Relationships Between Existing Models:

```bash
# Add belongsTo relationship from Post to User
expmvc rel belongsTo Post User --field author

# Add hasMany relationship from User to Post
expmvc rel hasMany User Post --field posts

# Add belongsToMany relationship (for tags, categories, etc.)
expmvc rel belongsToMany Post Tag --field tags[]
```

## 3. Complete Relationship Scaffold:

```bash
# Scaffold User-Post relationship (One-to-Many)
expmvc sr User Post hasMany

# Scaffold Post-Comment relationship (One-to-Many)
expmvc sr Post Comment hasMany

# Scaffold User-Comment relationship (One-to-Many)
expmvc sr User Comment hasMany
```

## 4. Generate Complete CRUD with Relationships:

```bash
# Generate User scaffold
expmvc generate scaffold User name:string email:string password:string

# Generate Post scaffold with User reference
expmvc generate scaffold Post title:string content:string user:ref:User

# Then add the reverse relationship
expmvc rel hasMany User Post --field posts
```

**Field Types Supported**

```bash
# Available field types:
name:string           # String field
age:number            # Number field
isActive:boolean      # Boolean field
createdAt:date        # Date field
tags:array            # Array field
userId:objectid       # ObjectId reference
```


# ✨ Why Use This Generator?

- *Saves Hours:* Skip repetitive setup and focus on business logic

- *Consistent Architecture:* Enforces clean, maintainable structure

- *Production Ready:* Includes validation, services, and middleware patterns

- *Scalable:* Perfect for growing applications

- *Developer Friendly:* Intuitive CLI with helpful commands

**Perfect For:**

- Students learning Express.js

- Backend developers starting new projects

- Startups needing rapid prototyping

- API bootstrapping and hackathons

- Enterprise applications requiring structure

# 🔧 Advanced Usage

**Custom Templates**

You can customize the generated templates by modifying the generator files in your global installation.

**Integration with Existing Projects**

If you have an existing Express project with the same structure, you can still use the generator commands:

```bash
cd existing-express-project
expmvc generate scaffold Post title:string content:string
```

**Environment Variables**

Created `.env` file in your project root:
```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/yourdb
JWT_SECRET=your-secret-key
NODE_ENV=development
```

# ❤️ Contributing

We welcome contributions! Here's how you can help:

1.*Report Bugs:* Open an issue with detailed description

2.*Request Features:* Suggest new features or improvements

3.*Submit PRs:* Fork the repo and submit pull requests

4.*Improve Documentation:* Help make the docs better



*Thanks for using exp-mvc! Don't forget to give a ⭐ on GitHub if you like it!*

Built with ❤️ for the Node.js community.


