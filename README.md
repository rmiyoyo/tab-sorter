# Tab Sorter

Browser extension for Chrome and Firefox that sorts the tabs in the current window alphabetically by site. Click the toolbar button to sort. Pinned tabs stay where they are.

## Build

```
npm install
npm run build
```

Output goes to `dist/chrome` and `dist/firefox`.

## Load locally

- Chrome: open `chrome://extensions`, turn on Developer mode, click "Load unpacked", pick `dist/chrome`.
- Firefox: open `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", pick `dist/firefox/manifest.json`.
