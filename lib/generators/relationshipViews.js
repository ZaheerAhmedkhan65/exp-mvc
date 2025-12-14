// lib/generators/relationshipViews.js
const fs = require("fs");
const path = require("path");

function createRelationshipViews(parentModel, childModel, relationshipType, projectRoot) {
    const viewsDir = path.join(projectRoot, "src/views", parentModel.toLowerCase() + 's');

    if (!fs.existsSync(viewsDir)) {
        fs.mkdirSync(viewsDir, { recursive: true });
    }

    if (relationshipType === 'hasMany') {
        // Add to parent show view
        const parentShowFile = path.join(viewsDir, 'show.ejs');
        if (fs.existsSync(parentShowFile)) {
            let content = fs.readFileSync(parentShowFile, 'utf8');

            const relatedSection = `
<!-- ${childModel}s Section -->
<div class="card mt-4">
    <div class="card-header">
        <h4>${childModel}s</h4>
    </div>
    <div class="card-body">
        <a href="/${childModel.toLowerCase()}s/new?${parentModel.toLowerCase()}Id=<%= ${parentModel.toLowerCase()}.id %>" 
           class="btn btn-success mb-3">
            Add New ${childModel}
        </a>
        
        <table class="table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Created At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <% ${parentModel.toLowerCase()}.${childModel.toLowerCase()}Details && ${parentModel.toLowerCase()}.${childModel.toLowerCase()}Details.forEach(${childModel.toLowerCase()} => { %>
                <tr>
                    <td><%= ${childModel.toLowerCase()}.title %></td>
                    <td><%= new Date(${childModel.toLowerCase()}.createdAt).toLocaleString() %></td>
                    <td>
                        <a href="/${childModel.toLowerCase()}s/<%= ${childModel.toLowerCase()}.id %>" 
                           class="btn btn-info btn-sm">View</a>
                    </td>
                </tr>
                <% }); %>
            </tbody>
        </table>
    </div>
</div>`;

            // Insert before closing container
            const containerEnd = content.lastIndexOf('</div>');
            const newContent = content.slice(0, containerEnd) +
                relatedSection +
                content.slice(containerEnd);

            fs.writeFileSync(parentShowFile, newContent);
            console.log(`✅ Updated ${parentModel} show view with ${childModel}s section`);
        }
    } else if (relationshipType === 'belongsTo') {
        // Update child form views to include parent selection
        const childViewsDir = path.join(projectRoot, "src/views", childModel.toLowerCase() + 's');

        // Update new.ejs
        const childNewFile = path.join(childViewsDir, 'new.ejs');
        if (fs.existsSync(childNewFile)) {
            let content = fs.readFileSync(childNewFile, 'utf8');

            const parentSelect = `
<div class="form-group">
    <label for="${parentModel.toLowerCase()}Id">${parentModel}</label>
    <select class="form-control" id="${parentModel.toLowerCase()}Id" name="${parentModel.toLowerCase()}Id" required>
        <option value="">Select ${parentModel}</option>
        <% ${parentModel.toLowerCase()}s.forEach(${parentModel.toLowerCase()} => { %>
        <option value="<%= ${parentModel.toLowerCase()}.id %>" 
                <%= ${parentModel.toLowerCase()}Id === ${parentModel.toLowerCase()}.id ? 'selected' : '' %>>
            <%= ${parentModel.toLowerCase()}.name %>
        </option>
        <% }); %>
    </select>
</div>`;

            // Insert after form opening
            const formStart = content.indexOf('<form');
            const afterFormStart = content.indexOf('>', formStart) + 1;
            const newContent = content.slice(0, afterFormStart) +
                '\n' + parentSelect +
                content.slice(afterFormStart);

            fs.writeFileSync(childNewFile, newContent);
            console.log(`✅ Updated ${childModel} new view with ${parentModel} selection`);
        }

        // Update edit.ejs similarly
        const childEditFile = path.join(childViewsDir, 'edit.ejs');
        if (fs.existsSync(childEditFile)) {
            let content = fs.readFileSync(childEditFile, 'utf8');

            const parentSelect = `
<div class="form-group">
    <label for="${parentModel.toLowerCase()}Id">${parentModel}</label>
    <select class="form-control" id="${parentModel.toLowerCase()}Id" name="${parentModel.toLowerCase()}Id" required>
        <option value="">Select ${parentModel}</option>
        <% ${parentModel.toLowerCase()}s.forEach(${parentModel.toLowerCase()} => { %>
        <option value="<%= ${parentModel.toLowerCase()}.id %>" 
                <%= ${childModel.toLowerCase()}.${parentModel.toLowerCase()}Id === ${parentModel.toLowerCase()}.id ? 'selected' : '' %>>
            <%= ${parentModel.toLowerCase()}.name %>
        </option>
        <% }); %>
    </select>
</div>`;

            const formStart = content.indexOf('<form');
            const afterFormStart = content.indexOf('>', formStart) + 1;
            const newContent = content.slice(0, afterFormStart) +
                '\n' + parentSelect +
                content.slice(afterFormStart);

            fs.writeFileSync(childEditFile, newContent);
            console.log(`✅ Updated ${childModel} edit view with ${parentModel} selection`);
        }
    }
}

module.exports = createRelationshipViews;