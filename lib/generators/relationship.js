const fs = require("fs");
const path = require("path");

function createRelationship(fromModel, toModel, relationshipType, options = {}) {
    const projectRoot = process.cwd();
    const modelFile = path.join(projectRoot, "src/models", `${fromModel.toLowerCase()}.model.js`);

    if (!fs.existsSync(modelFile)) {
        console.log(`❌ Model ${fromModel} not found. Create it first.`);
        return;
    }

    let content = fs.readFileSync(modelFile, 'utf8');

    const fieldName = options.fieldName || toModel.toLowerCase();
    const refModel = options.refModel || toModel;
    const isArray = relationshipType === 'hasMany' || relationshipType === 'belongsToMany';
    const isRequired = options.required || false;

    // Create relationship field definition
    let relationshipDef;
    if (isArray) {
        relationshipDef = `    ${fieldName}: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: '${refModel}',
        default: []
    }]`;
    } else {
        relationshipDef = `    ${fieldName}: {
        type: mongoose.Schema.Types.ObjectId,
        ref: '${refModel}',
        ${isRequired ? 'required: true,' : ''}
        default: null
    }`;
    }

    // Add to schema
    const schemaEnd = content.indexOf('}, {');
    const beforeSchemaEnd = content.lastIndexOf('\n', schemaEnd);

    const newContent = content.slice(0, beforeSchemaEnd) +
        ',\n\n' + relationshipDef +
        content.slice(beforeSchemaEnd);

    // Add virtual
    const virtualMatch = newContent.match(/\/\/ Virtuals/);
    if (virtualMatch) {
        const virtualIndex = virtualMatch.index;
        let virtualContent;

        if (isArray) {
            virtualContent = `${fromModel}Schema.virtual('${fieldName}Details', {
    ref: '${refModel}',
    localField: '${fieldName}',
    foreignField: '_id'
});`;
        } else {
            virtualContent = `${fromModel}Schema.virtual('${fieldName}Details', {
    ref: '${refModel}',
    localField: '${fieldName}',
    foreignField: '_id',
    justOne: true
});`;
        }

        const insertIndex = newContent.indexOf('\n', virtualIndex) + 1;
        const finalContent = newContent.slice(0, insertIndex) +
            '\n' + virtualContent +
            newContent.slice(insertIndex);

        fs.writeFileSync(modelFile, finalContent);
    } else {
        fs.writeFileSync(modelFile, newContent);
    }

    console.log(`✅ Added ${relationshipType} relationship from ${fromModel} to ${refModel}`);
}

module.exports = createRelationship;