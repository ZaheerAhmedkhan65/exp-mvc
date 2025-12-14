const fs = require("fs");
const path = require("path");

function createViewScaffold(name, fields = [], projectRoot) {
    const viewDir = path.join(projectRoot, "src/views", name.toLowerCase() + 's');

    // Create directory if it doesn't exist
    if (!fs.existsSync(viewDir)) {
        fs.mkdirSync(viewDir, { recursive: true });
    }

    console.log(`📁 Creating views for ${name} in: ${viewDir}`);

    // Generate form fields HTML based on schema
    function generateFormFields(mode = 'new') {
        return fields.map(field => {
            const [fieldName, fieldType] = field.includes(':') ?
                field.split(':') : [field, 'string'];

            const varName = name.toLowerCase();

            let inputType = 'text';
            switch (fieldType.toLowerCase()) {
                case 'number':
                    inputType = 'number';
                    break;
                case 'boolean':
                    // For boolean fields (checkboxes)
                    if (mode === 'edit') {
                        return `
                    <div class="form-group">
                        <label for="${fieldName}">${fieldName}</label>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="${fieldName}" 
                                   name="${fieldName}" <%= ${varName}.${fieldName} ? "checked" : "" %>>
                            <label class="form-check-label" for="${fieldName}">${fieldName}</label>
                        </div>
                    </div>`;
                    } else {
                        return `
                    <div class="form-group">
                        <label for="${fieldName}">${fieldName}</label>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="${fieldName}" 
                                   name="${fieldName}">
                            <label class="form-check-label" for="${fieldName}">${fieldName}</label>
                        </div>
                    </div>`;
                    }
                case 'date':
                    inputType = 'date';
                    break;
                case 'email':
                    inputType = 'email';
                    break;
                case 'password':
                    inputType = 'password';
                    break;
            }

            // For non-boolean fields
            if (mode === 'edit') {
                return `
            <div class="form-group">
                <label for="${fieldName}">${fieldName}</label>
                <input type="${inputType}" class="form-control" id="${fieldName}" 
                       name="${fieldName}" value="<%= ${varName}.${fieldName} || "" %>">
            </div>`;
            } else {
                return `
            <div class="form-group">
                <label for="${fieldName}">${fieldName}</label>
                <input type="${inputType}" class="form-control" id="${fieldName}" 
                       name="${fieldName}">
            </div>`;
            }
        }).join('\n');
    }

    // Create index.ejs (list view)
    const indexContent = `
    <!-- ${name}s/index.ejs -->
    <div class="container">
        <h1 class="mb-4">${name}s List</h1>
        
        <div class="mb-4">
            <a href="/${name.toLowerCase()}s/new" class="btn btn-success">Create New ${name}</a>
        </div>

        <table id="${name.toLowerCase()}sTable" class="table table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    ${fields.map(field => {
        const [fieldName] = field.includes(':') ? field.split(':') : [field];
        return `<th>${fieldName}</th>`;
    }).join('\n                    ')}
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <% ${name.toLowerCase()}s.forEach(${name.toLowerCase()} => { %>
                    <tr>
                        <td><%= ${name.toLowerCase()}.id %></td>
                        ${fields.map(field => {
        const [fieldName] = field.includes(':') ? field.split(':') : [field];
        return `<td><%= ${name.toLowerCase()}.${fieldName} %></td>`;
    }).join('\n                        ')}
                        <td class="action-buttons">
                            <a href="/${name.toLowerCase()}s/<%= ${name.toLowerCase()}.id %>" class="btn btn-info btn-sm">View</a>
                            <a href="/${name.toLowerCase()}s/<%= ${name.toLowerCase()}.id %>/edit" class="btn btn-warning btn-sm">Edit</a>
                            <form action="/${name.toLowerCase()}s/<%= ${name.toLowerCase()}.id %>/?_method=DELETE" method="POST" style="display: inline;">
                                <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure?')">Delete</button>
                            </form>
                        </td>
                    </tr>
                <% }); %>
            </tbody>
        </table>
    </div>

    <script>
        $(document).ready(function() {
            $('#${name.toLowerCase()}sTable').DataTable({
                pageLength: 10,
                order: [[0, 'desc']]
            });
        });
    </script>
`;

    // Create show.ejs (single view)
    const showContent = `
    <!-- ${name}/show.ejs -->
    <div class="container">
        <div class="detail-card">
            <div class="card">
                <div class="card-header">
                    <h2>${name} Details</h2>
                </div>
                <div class="card-body">
                    <dl class="row">
                        <dt class="col-sm-3">ID:</dt>
                        <dd class="col-sm-9"><%= ${name.toLowerCase()}.id %></dd>

                        ${fields.map(field => {
        const [fieldName] = field.includes(':') ? field.split(':') : [field];
        return `<dt class="col-sm-3">${fieldName}:</dt>
                        <dd class="col-sm-9"><%= ${name.toLowerCase()}.${fieldName} %></dd>`;
    }).join('\n\n                        ')}
                        
                        <dt class="col-sm-3">Created At:</dt>
                        <dd class="col-sm-9"><%= new Date(${name.toLowerCase()}.createdAt).toLocaleString() %></dd>
                        
                        <dt class="col-sm-3">Updated At:</dt>
                        <dd class="col-sm-9"><%= new Date(${name.toLowerCase()}.updatedAt).toLocaleString() %></dd>
                    </dl>
                </div>
                <div class="card-footer">
                    <a href="/${name.toLowerCase()}s" class="btn btn-secondary">Back to List</a>
                    <a href="/${name.toLowerCase()}s/<%= ${name.toLowerCase()}.id %>/edit" class="btn btn-warning">Edit</a>
                </div>
            </div>
        </div>
    </div>
`;

    // Create new.ejs (create form)
    const newContent = `
    <!-- ${name}/new.ejs --> 
    <div class="container">
        <div class="form-container">
            <h1 class="mb-4">Create New ${name}</h1>
            
            <form method="POST" action="/${name.toLowerCase()}s">
                ${generateFormFields('new')}
                
                <div class="mt-4">
                    <button type="submit" class="btn btn-success">Create ${name}</button>
                    <a href="/${name.toLowerCase()}s" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
        </div>
    </div>
`;

    // Create edit.ejs (edit form)
    const editContent = `
    <!-- ${name}/edit.ejs -->
    <div class="container">
        <div class="form-container">
            <h1 class="mb-4">Edit ${name}</h1>
            
            <form method="POST" action="/${name.toLowerCase()}s/<%= ${name.toLowerCase()}.id %>/?_method=PUT">                
                ${generateFormFields('edit')}
                
                <div class="mt-4">
                    <button type="submit" class="btn btn-warning">Update ${name}</button>
                    <a href="/${name.toLowerCase()}s" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
        </div>
    </div>
`;

    // Write all view files
    const views = [
        { name: 'index.ejs', content: indexContent },
        { name: 'show.ejs', content: showContent },
        { name: 'new.ejs', content: newContent },
        { name: 'edit.ejs', content: editContent }
    ];

    views.forEach(view => {
        const filePath = path.join(viewDir, view.name);
        fs.writeFileSync(filePath, view.content.trim());
        console.log(`✅ Created: ${view.name}`);
    });

    console.log(`\n✅ All views created for ${name}s!`);
}

module.exports = createViewScaffold;