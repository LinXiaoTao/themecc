import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  type CliMetaFile,
  cliMetaSchema,
  cliThemeFileSchema,
} from "../src/lib/registry/schema";
import { CLI_SEED, type SeedEntry } from "./seed-manifest";

/**
 * One-time import of community CLI themes.
 * Each file is fetched at a pinned commit, validated, and written with
 * attribution. Run `pnpm registry:seed`, then `pnpm lint:fix` to format.
 */

const ADDED_AT = new Date().toISOString().slice(0, 10);

function rawUrl(entry: SeedEntry): string {
  const { repo, sha, path: file } = entry.source;
  return `https://raw.githubusercontent.com/${repo}/${sha}/${file}`;
}

function attribution(entry: SeedEntry): string {
  const { repo, sha } = entry.source;
  const copied = `Copied from ${repo} at ${sha.slice(0, 7)} (${entry.license}, Copyright (c) ${entry.holder}).`;
  return entry.palette ? `${copied} Palette: ${entry.palette.name}.` : copied;
}

function buildMeta(entry: SeedEntry): CliMetaFile {
  return cliMetaSchema.parse({
    description: entry.description,
    author: entry.author,
    license: entry.license,
    attribution: attribution(entry),
    upstream: entry.palette
      ? entry.palette.url
      : `https://github.com/${entry.source.repo}`,
    tags: entry.tags,
    addedAt: ADDED_AT,
  });
}

async function importEntry(entry: SeedEntry): Promise<void> {
  const response = await fetch(rawUrl(entry));
  if (!response.ok) {
    throw new Error(`${entry.slug}: ${response.status} for ${rawUrl(entry)}`);
  }
  const theme = cliThemeFileSchema.parse(await response.json());
  const meta = buildMeta(entry);
  const dir = path.join(process.cwd(), "registry", "cli", entry.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    path.join(dir, "theme.json"),
    `${JSON.stringify(theme, null, 2)}\n`,
  );
  writeFileSync(
    path.join(dir, "meta.json"),
    `${JSON.stringify(meta, null, 2)}\n`,
  );
  console.log(
    `ok  ${entry.slug} (${Object.keys(theme.overrides).length} tokens)`,
  );
}

async function main(): Promise<void> {
  const failures: string[] = [];
  for (const entry of CLI_SEED) {
    try {
      await importEntry(entry);
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }
  if (failures.length > 0) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
