//lib/generators/view.js
const fs = require("fs");
const path = require("path");

function createView(name, projectRoot) {
    const viewDir = path.join(projectRoot, "src/views");

    // Create directory if it doesn't exist
    if (!fs.existsSync(viewDir)) {
        fs.mkdirSync(viewDir, { recursive: true });
    }

    const filename = path.join(viewDir, `${name.toLowerCase()}.ejs`);
    const content = `<h1><%= ${name} ? 'Edit' : 'New' %> ${name}</h1>

<form method="POST" action="<%= ${name} ? '/${name.toLowerCase()}s/<%= ${name}.id %>?_method=PUT' : '/${name.toLowerCase()}s' %>">
    <!-- Add form fields here -->
    <div class="form-group">
        <label for="name">Name</label>
        <input type="text" class="form-control" id="name" name="name" 
               value="<%= ${name} ? ${name}.name : '' %>">
    </div>
    
    <button type="submit" class="btn btn-primary">
        <%= ${name} ? 'Update' : 'Create' %> ${name}
    </button>
</form>`;

    fs.writeFileSync(filename, content.trim());
    console.log(`✅ View created: ${filename}`);
}

module.exports = createView;