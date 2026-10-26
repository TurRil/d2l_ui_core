# Recording Distribution Guide

This folder contains:

- Example HTML files used to validate the recording web components.
- Build/distribution artifacts for recording-related web components.

Use the steps below to export/copy/distribute these files to another folder and verify they still work correctly.

## Quick copy (CI)

Use a single command to copy everything from `recording/` into a distribution folder while preserving structure:

```bash
mkdir -p "$DEST_DIR" && rsync -a --delete ./recording/ "$DEST_DIR"/
```

Example:

```bash
DEST_DIR=./dist/recording-bundle
mkdir -p "$DEST_DIR" && rsync -a --delete ./recording/ "$DEST_DIR"/
```

Notes:
- `--delete` keeps destination in sync by removing files no longer present in source.
- Ensure `DEST_DIR` is not empty and is not `/` before running in CI.

## 1) Choose a destination folder

Pick or create a destination folder where you want to distribute the assets, for example:

- `../recording-distribution`
- `./dist/recording-bundle`

## 2) Copy build/distribution web components

Copy the built component files (and any required subfolders such as `assets`) from this `recording` folder into your destination while preserving folder structure.

Example (macOS/Linux):

```bash
mkdir -p ../recording-distribution
cp -R ./recording/* ../recording-distribution/
```

Example (Windows PowerShell):

```powershell
New-Item -ItemType Directory -Force -Path ..\recording-distribution | Out-Null
Copy-Item -Recurse -Force .\recording\* ..\recording-distribution\
```

> Important: Keep relative paths intact. If HTML files reference scripts/styles using relative paths, changing structure can break loading.

## 3) Include the example HTML files

Ensure the example HTML files from this folder are also copied to the destination folder. These files are used as smoke tests for local verification.

## 4) Verify locally that distribution works

Serve the destination folder with a local static file server (recommended; opening directly via `file://` may fail for module imports).

Example with Node:

```bash
npx serve ../recording-distribution
```

Then open the provided local URL and test each example HTML page.

### Verification checklist

- Pages load without 404 errors in the browser network tab.
- Web components render correctly.
- Console shows no module/import/runtime errors.
- Styling and assets (icons/images/fonts) load correctly.
- Core recording interactions used by the examples function as expected.

## 5) Distribute

Once verification passes, archive or publish the destination folder using your preferred process (zip artifact, CI artifact upload, static hosting, etc.).

## Troubleshooting

- **Blank page or component not rendering**: check script paths in the HTML and confirm copied folder structure matches source.
- **404 for JS/CSS/assets**: verify all referenced files and nested asset folders were copied.
- **Module/CORS errors**: run through an HTTP server instead of opening files directly.
