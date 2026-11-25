import { loadSettings, orderLabels, saveSettings, sortKeyLabels } from "./settings.js";
import type { SortKey, SortOrder } from "./settings.js";

const sortKeySelect = document.getElementById("sortKey") as HTMLSelectElement;
const orderSelect = document.getElementById("order") as HTMLSelectElement;
const allWindowsBox = document.getElementById("allWindows") as HTMLInputElement;
const sortOnStartupBox = document.getElementById("sortOnStartup") as HTMLInputElement;
const status = document.getElementById("status") as HTMLParagraphElement;

function fillSelect(select: HTMLSelectElement, labels: Record<string, string>, selected: string): void {
  for (const [value, label] of Object.entries(labels)) {
    select.add(new Option(label, value, false, value === selected));
  }
}

async function save(): Promise<void> {
  await saveSettings({
    sortKey: sortKeySelect.value as SortKey,
    order: orderSelect.value as SortOrder,
    allWindows: allWindowsBox.checked,
    sortOnStartup: sortOnStartupBox.checked,
  });
  status.textContent = "Saved";
}

const settings = await loadSettings();
fillSelect(sortKeySelect, sortKeyLabels, settings.sortKey);
fillSelect(orderSelect, orderLabels, settings.order);
allWindowsBox.checked = settings.allWindows;
sortOnStartupBox.checked = settings.sortOnStartup;

for (const input of [sortKeySelect, orderSelect, allWindowsBox, sortOnStartupBox]) {
  input.addEventListener("change", () => void save());
}
