import type { SortKey, SortOrder } from "./settings.js";

type Tab = Pick<chrome.tabs.Tab, "url" | "title" | "lastAccessed">;

function siteOf(url: string | undefined): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function compareText(a: string | undefined, b: string | undefined): number {
  return (a ?? "").localeCompare(b ?? "", undefined, { sensitivity: "base", numeric: true });
}

const comparers: Record<SortKey, (a: Tab, b: Tab) => number> = {
  site: (a, b) => compareText(siteOf(a.url), siteOf(b.url)) || compareText(a.url, b.url),
  title: (a, b) => compareText(a.title, b.title) || compareText(a.url, b.url),
  url: (a, b) => compareText(a.url, b.url),
  lastAccessed: (a, b) => (a.lastAccessed ?? 0) - (b.lastAccessed ?? 0),
};

export function compareTabs(key: SortKey, order: SortOrder): (a: Tab, b: Tab) => number {
  const compare = comparers[key];
  return order === "asc" ? compare : (a, b) => compare(b, a);
}
