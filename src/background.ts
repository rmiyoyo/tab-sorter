import { loadSettings, orderLabels, saveSettings, sortKeyLabels } from "./settings.js";
import type { Settings, SortKey, SortOrder } from "./settings.js";
import { compareTabs } from "./sort.js";

const STARTUP_DELAY_MS = 3000;

async function sortWindow(windowId: number, settings: Settings): Promise<void> {
  const tabs = await chrome.tabs.query({ windowId });
  const pinnedCount = tabs.filter((tab) => tab.pinned).length;
  const ids = tabs
    .filter((tab) => !tab.pinned)
    .sort(compareTabs(settings.sortKey, settings.order))
    .flatMap((tab) => (tab.id === undefined ? [] : [tab.id]));

  if (ids.length > 0) {
    await chrome.tabs.move(ids, { index: pinnedCount });
  }
}

async function sortAllWindows(settings: Settings): Promise<void> {
  const windows = await chrome.windows.getAll({ windowTypes: ["normal"] });
  for (const window of windows) {
    if (window.id !== undefined) {
      await sortWindow(window.id, settings);
    }
  }
}

async function sortFrom(windowId: number | undefined): Promise<void> {
  const settings = await loadSettings();
  if (settings.allWindows || windowId === undefined) {
    await sortAllWindows(settings);
  } else {
    await sortWindow(windowId, settings);
  }
}

async function createMenus(): Promise<void> {
  const settings = await loadSettings();
  await chrome.contextMenus.removeAll();

  chrome.contextMenus.create({ id: "sortKey", title: "Sort by", contexts: ["action"] });
  for (const [key, label] of Object.entries(sortKeyLabels)) {
    chrome.contextMenus.create({
      id: `sortKey:${key}`,
      parentId: "sortKey",
      title: label,
      type: "radio",
      checked: settings.sortKey === key,
      contexts: ["action"],
    });
  }

  chrome.contextMenus.create({ id: "order", title: "Order", contexts: ["action"] });
  for (const [order, label] of Object.entries(orderLabels)) {
    chrome.contextMenus.create({
      id: `order:${order}`,
      parentId: "order",
      title: label,
      type: "radio",
      checked: settings.order === order,
      contexts: ["action"],
    });
  }
}

chrome.runtime.onInstalled.addListener(() => {
  void createMenus();
});

chrome.runtime.onStartup.addListener(async () => {
  await createMenus();
  const settings = await loadSettings();
  if (settings.sortOnStartup) {
    setTimeout(() => void sortAllWindows(settings), STARTUP_DELAY_MS);
  }
});

chrome.action.onClicked.addListener((tab) => {
  void sortFrom(tab.windowId);
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const [group, value] = String(info.menuItemId).split(":");
  if (group === "sortKey") {
    await saveSettings({ sortKey: value as SortKey });
  } else if (group === "order") {
    await saveSettings({ order: value as SortOrder });
  } else {
    return;
  }
  await sortFrom(tab?.windowId);
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.sortKey?.newValue) {
    void chrome.contextMenus.update(`sortKey:${changes.sortKey.newValue}`, { checked: true });
  }
  if (changes.order?.newValue) {
    void chrome.contextMenus.update(`order:${changes.order.newValue}`, { checked: true });
  }
});
