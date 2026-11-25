import { copyFileSync, cpSync, mkdirSync, rmSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });

for (const browser of ["chrome", "firefox"]) {
  const out = `dist/${browser}`;
  mkdirSync(out, { recursive: true });
  cpSync("build", out, { recursive: true });
  copyFileSync("src/options.html", `${out}/options.html`);
  copyFileSync(`manifests/${browser}.json`, `${out}/manifest.json`);
  cpSync("icons", `${out}/icons`, { recursive: true });
}
