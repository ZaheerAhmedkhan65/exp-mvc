# exp-mvc Collaborator Guide
-------------------------------------------------------------------------
## Contributors

### PRs and Code contributions
- Tests must pass.
- Follow the JavaScript Standard Style and 'npm run lint'.
- If you fix a bug, add a test.

### Branches
Use the 'master' branch for bug fixes or minor work that is intended for the current release stream.

Use the correspondingly named branch, e.g. '6.x', for anything intended for a future release of exp-mvc.

### Steps for contributing
- Create an issue for the bug you want to fix or the feature that you want to add.
- Create your own fork on GitHub, then checkout your fork.
- Write your code in your local copy. It's good practice to create a branch for each new issue you work on, although not compulsory.
- To run the test suite, first install the dependencies by running 'npm install', then run 'npm test'.
- Ensure your code is linted by running 'npm run lint' -- fix any issue you see listed.
- If the tests pass, you can commit your changes to your fork and then create a pull request from there. Make sure to reference your issue from the pull request comments by including the issue number e.g.'#123'.

## New Release Process

### Release Checklist

Use this checklist for every new release.

## Pre-Release Preparation

### Version Management
- [ ] Update version in `package.json`
- [ ] Update version in `bin/cli.js`
- [ ] Update version in any other files with version numbers

### Code Quality
- [ ] Run all tests: `npm test` (if tests exist)
- [ ] Test all commands locally
- [ ] Check for any console.log statements that should be removed
- [ ] Verify error handling works correctly

### Documentation
- [ ] Update `CHANGELOG.md` with new changes
- [ ] Update `README.md` if needed
- [ ] Check all examples in documentation work
- [ ] Update any CLI help text if commands changed

### Testing Commands
- [ ] Test: `npx create-express-architecture test-project`
- [ ] Test: `expmvc new test-project` (if installed globally)
- [ ] Test all generator commands:
  - [ ] `expmvc g scaffold User "name:string email:string"`
  - [ ] `expmvc g model Product "title:string price:number"`
  - [ ] `expmvc g controller Auth`
  - [ ] `expmvc g route User`
  - [ ] `expmvc g view dashboard`
- [ ] Test: `expmvc watch` (dependency watcher)
- [ ] Test: `expmvc check-deps` and `expmvc fix-deps`

### Cross-Platform Testing
- [ ] Test on Linux/Unix
- [ ] Test on macOS
- [ ] Test on Windows (if possible)
- [ ] Test with different Node versions (14.x, 16.x, 18.x, 20.x)

## Release Process

### Git Operations
- [ ] Ensure you're on main/master branch: `git checkout main`
- [ ] Pull latest changes: `git pull origin main`
- [ ] Stage all changes: `git add .`
- [ ] Commit release: `git commit -m "chore: release vX.X.X"`
- [ ] Create tag: `git tag -a vX.X.X -m "Release vX.X.X"`
- [ ] Push changes: `git push origin main`
- [ ] Push tag: `git push origin vX.X.X`

### GitHub Release
- [ ] Go to: https://github.com/ZaheerAhmedkhan65/exp-mvc/releases/new
- [ ] Select tag: `vX.X.X`
- [ ] Add release title: `exp-mvc vX.X.X`
- [ ] Add detailed release notes (copy from CHANGELOG)
- [ ] Attach any additional files if needed
- [ ] Click "Publish release"

### npm Publishing (Optional)
- [ ] Login to npm: `npm login`
- [ ] Test publish: `npm publish --dry-run`
- [ ] Publish: `npm publish`
- [ ] Verify package on npmjs.com: https://www.npmjs.com/package/exp-mvc

## Post-Release

### Verification
- [ ] Verify installation works: `npm install -g exp-mvc`
- [ ] Verify npx works: `npx create-express-architecture verify-project`
- [ ] Test a fresh project creation
- [ ] Check GitHub release page is correct

### Communication
- [ ] Update any social media or community posts
- [ ] Respond to any issues/questions
- [ ] Update roadmap if needed

### Monitoring
- [ ] Monitor npm downloads
- [ ] Watch for GitHub issues
- [ ] Check for any installation problems reported

## Templates for Release Notes

### Major Release (X.0.0)