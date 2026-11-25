function siteOf(url: string | undefined): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function compareTabs(a: chrome.tabs.Tab, b: chrome.tabs.Tab): number {
  return (
    siteOf(a.url).localeCompare(siteOf(b.url)) ||
    (a.url ?? "").localeCompare(b.url ?? "")
  );
}

async function sortWindow(windowId: number): Promise<void> {
  const tabs = await chrome.tabs.query({ windowId });
  const pinned = tabs.filter((tab) => tab.pinned);
  const unpinned = tabs.filter((tab) => !tab.pinned).sort(compareTabs);

  for (const [offset, tab] of unpinned.entries()) {
    if (tab.id !== undefined) {
      await chrome.tabs.move(tab.id, { index: pinned.length + offset });
    }
  }
}

chrome.action.onClicked.addListener((tab) => {
  if (tab.windowId !== undefined) {
    void sortWindow(tab.windowId);
  }
});
