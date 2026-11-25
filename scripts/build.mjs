import { copyFileSync, mkdirSync, rmSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });

for (const browser of ["chrome", "firefox"]) {
  const out = `dist/${browser}`;
  mkdirSync(out, { recursive: true });
  copyFileSync("build/background.js", `${out}/background.js`);
  copyFileSync(`manifests/${browser}.json`, `${out}/manifest.json`);
}
