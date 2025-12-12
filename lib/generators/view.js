//lib/generators/view.js
function createView(name) {
    const filename = `app/views/${name}.ejs`;

    fs.writeFileSync(filename, `<h1>${name} view</h1>`);
    console.log(`✔ View created: ${filename}`);
}

module.exports = createView;