export type SortKey = "site" | "title" | "url" | "lastAccessed";
export type SortOrder = "asc" | "desc";

export interface Settings {
  sortKey: SortKey;
  order: SortOrder;
  allWindows: boolean;
  sortOnStartup: boolean;
}

export const defaultSettings: Settings = {
  sortKey: "site",
  order: "asc",
  allWindows: false,
  sortOnStartup: false,
};

export const sortKeyLabels: Record<SortKey, string> = {
  site: "Site",
  title: "Title",
  url: "Web address",
  lastAccessed: "Last used",
};

export const orderLabels: Record<SortOrder, string> = {
  asc: "Ascending (A to Z, oldest first)",
  desc: "Descending (Z to A, newest first)",
};

export async function loadSettings(): Promise<Settings> {
  return chrome.storage.sync.get<Settings>({ ...defaultSettings });
}

export async function saveSettings(changes: Partial<Settings>): Promise<void> {
  await chrome.storage.sync.set(changes);
}
