# AppleTV AgNative NG

A Lampa plugin that reshapes top navigation, content cards, and selected UI parts in Apple TV style.

## Repository Layout

- `src/` - plugin source code
- `release/appletv_agnative.js` - compiled artifact
- `appletv_agnative.js` - root-level copy of the build artifact (for compatibility)
- `.github/workflows/ci-build.yml` - CI build for `main` and pull requests
- `.github/workflows/pages.yml` - GitHub Pages deployment from `gh-page`

## Branch Strategy

### `main`

Primary development branch.

All feature work, fixes, and refactoring should be done here through pull requests.

What runs automatically:
- `Build` workflow (`npm ci` + `npm run build`)

### `gh-page`

Publishing branch for GitHub Pages.

On every push to this branch, `Deploy GitHub Pages` does the following:
1. installs dependencies
2. builds the plugin
3. prepares `pages-dist`
4. publishes via GitHub Pages

Important:
- Do not develop features directly in `gh-page`
- Treat `gh-page` as a publishing branch only

## Local Development

### Requirements

- Node.js 22+
- npm

### First Run

```bash
git clone <repo-url>
cd AppleTVAGNativeNG
npm ci
```

### Development Modes

```bash
npm run dev
```

Starts Rollup in watch mode.

```bash
npm run build
```

Creates a production build.

After `npm run build`:
- `release/appletv_agnative.js` is updated
- root `appletv_agnative.js` is synchronized automatically

### Recommended Change Cycle

1. Create a feature branch from `main`
2. Implement changes in `src/`
3. Run `npm run build`
4. Verify generated artifacts were updated
5. Commit source + build artifacts

## Pull Request Flow to Main Repository

### If You Work in the Main Repository

1. Update local `main`
```bash
git checkout main
git pull origin main
```

2. Create a feature branch
```bash
git checkout -b feature/<short-name>
```

3. Build after changes
```bash
npm run build
```

4. Commit
```bash
git add .
git commit -m "feat: short description"
```

5. Push branch
```bash
git push -u origin feature/<short-name>
```

6. Open PR: `feature/<short-name>` -> `main`

### If You Work from a Fork

1. Add `upstream` (main repository)
```bash
git remote add upstream <main-repo-url>
```

2. Sync with upstream `main`
```bash
git fetch upstream
git checkout main
git rebase upstream/main
```

3. Continue with the same feature branch flow, then open PR into `upstream/main`

## Updating GitHub Pages After Merge to `main`

After PR merge to `main`, move changes to `gh-page` and push:

```bash
git checkout gh-page
git pull origin gh-page
git merge origin/main
git push origin gh-page
```

This triggers `Deploy GitHub Pages`.

## Quality Notes

- Source of truth is `src/`
- Do not edit `release/*` manually
- Always run `npm run build` before opening a PR
