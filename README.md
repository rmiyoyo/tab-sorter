# Tab Sorter

Browser extension for Chrome and Firefox that sorts your tabs. Click the toolbar button or press Alt+Shift+S to sort. Pinned tabs stay where they are.

## Sorting options

- Sort by site, title, web address or last used
- Ascending (A to Z, oldest first) or descending (Z to A, newest first)
- Sort the current window or all windows
- Sort all windows when the browser starts

Right-click the toolbar button to pick a sort type and order. Picking one sorts straight away and becomes the default for the next click. All options are also on the extension's options page: in Chrome, right-click the button and choose "Options"; in Firefox, open `about:addons`, choose Tab Sorter, then the Options tab.

To change the shortcut, open `chrome://extensions/shortcuts` in Chrome, or `about:addons` in Firefox and pick "Manage Extension Shortcuts" from the gear menu.

## Build

```
npm install
npm run build
```

Output goes to `dist/chrome` and `dist/firefox`.

## Package for the stores

```
npm run package
```

This writes `packages/tab-sorter-chrome.zip` for the Chrome Web Store and `packages/tab-sorter-firefox.zip` for Firefox Add-ons. Run `npm run lint` after a build to check the Firefox version against Mozilla's rules. Firefox 142 or newer is required.

## Load locally

- Chrome: open `chrome://extensions`, turn on Developer mode, click "Load unpacked", pick `dist/chrome`.
- Firefox: open `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", pick `dist/firefox/manifest.json`.
