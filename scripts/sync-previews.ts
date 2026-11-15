import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { loadThemesOrThrow } from "../src/lib/registry/load";

const root = process.cwd();
const target = path.join(root, "public", "previews");

rmSync(target, { recursive: true, force: true });

let count = 0;
for (const theme of loadThemesOrThrow()) {
  if (theme.type !== "desktop") {
    continue;
  }
  const from = path.join(root, "registry", "desktop", theme.slug);
  const to = path.join(target, theme.slug);
  mkdirSync(to, { recursive: true });
  copyFileSync(
    path.join(from, theme.preview.poster),
    path.join(to, theme.preview.poster),
  );
  count += 1;
  if (theme.preview.video) {
    copyFileSync(
      path.join(from, theme.preview.video),
      path.join(to, theme.preview.video),
    );
    count += 1;
  }
}
console.log(`Synced ${count} preview file(s).`);
