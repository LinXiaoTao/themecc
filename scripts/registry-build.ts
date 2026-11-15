import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { loadThemesOrThrow } from "../src/lib/registry/load";
import { buildGeneratedFiles } from "../src/lib/registry/marketplace";

const root = process.cwd();
const checkOnly = process.argv.includes("--check");

const files = buildGeneratedFiles(loadThemesOrThrow());
const expectedPluginDirs = new Set(
  files
    .map((file) => file.path.split("/"))
    .filter((parts) => parts[0] === "plugins" && parts[1])
    .map((parts) => parts[1] as string),
);

const pluginsRoot = path.join(root, "plugins");
const staleDirs = existsSync(pluginsRoot)
  ? readdirSync(pluginsRoot, { withFileTypes: true })
      .filter(
        (entry) => entry.isDirectory() && !expectedPluginDirs.has(entry.name),
      )
      .map((entry) => entry.name)
  : [];

const outOfDate: string[] = [];
for (const file of files) {
  const target = path.join(root, file.path);
  const current = existsSync(target) ? readFileSync(target, "utf8") : null;
  if (current !== file.contents) {
    outOfDate.push(file.path);
  }
}
for (const dir of staleDirs) {
  outOfDate.push(`plugins/${dir} (stale)`);
}

if (checkOnly) {
  if (outOfDate.length > 0) {
    console.error(
      "Generated files are out of date. Run `pnpm registry:build`.",
    );
    for (const entry of outOfDate) {
      console.error(`  ${entry}`);
    }
    process.exit(1);
  }
  console.log("Generated files are up to date.");
} else {
  for (const dir of staleDirs) {
    rmSync(path.join(pluginsRoot, dir), { recursive: true, force: true });
  }
  for (const file of files) {
    const target = path.join(root, file.path);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, file.contents);
  }
  console.log(`Wrote ${files.length} generated file(s).`);
}
