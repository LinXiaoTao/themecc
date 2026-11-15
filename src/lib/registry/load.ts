import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import {
  type CliTheme,
  cliMetaSchema,
  cliThemeFileSchema,
  type DesktopTheme,
  desktopThemeSchema,
  slugSchema,
  type Theme,
} from "./schema";

export type RegistryError = {
  file: string;
  message: string;
};

export type RegistryLoadResult = {
  themes: Theme[];
  errors: RegistryError[];
};

export const MAX_POSTER_BYTES = 300 * 1024;
export const MAX_VIDEO_BYTES = 8 * 1024 * 1024;

export function defaultRegistryRoot(): string {
  return path.join(process.cwd(), "registry");
}

function listDirectories(dir: string): string[] {
  if (!existsSync(/*turbopackIgnore: true*/ dir)) {
    return [];
  }
  return readdirSync(/*turbopackIgnore: true*/ dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function readJson(file: string): unknown {
  return JSON.parse(readFileSync(/*turbopackIgnore: true*/ file, "utf8"));
}

function relative(root: string, file: string): string {
  return path.relative(path.dirname(root), file);
}

function checkFile(
  root: string,
  file: string,
  maxBytes: number,
  errors: RegistryError[],
): void {
  if (!existsSync(/*turbopackIgnore: true*/ file)) {
    errors.push({ file: relative(root, file), message: "file is missing" });
    return;
  }
  const size = statSync(/*turbopackIgnore: true*/ file).size;
  if (size > maxBytes) {
    errors.push({
      file: relative(root, file),
      message: `file is ${size} bytes, limit is ${maxBytes}`,
    });
  }
}

function loadDesktop(
  root: string,
  slug: string,
  errors: RegistryError[],
): DesktopTheme | null {
  const dir = path.join(root, "desktop", slug);
  const file = path.join(dir, "theme.json");
  if (!existsSync(/*turbopackIgnore: true*/ file)) {
    errors.push({
      file: relative(root, file),
      message: "theme.json is missing",
    });
    return null;
  }
  const parsed = desktopThemeSchema.safeParse(readJson(file));
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      errors.push({
        file: relative(root, file),
        message: `${issue.path.join(".")}: ${issue.message}`,
      });
    }
    return null;
  }
  const data = parsed.data;
  let valid = true;
  if (data.plugin !== slug) {
    errors.push({
      file: relative(root, file),
      message: `plugin "${data.plugin}" must equal the folder name "${slug}"`,
    });
    valid = false;
  }
  const before = errors.length;
  checkFile(
    root,
    path.join(dir, data.preview.poster),
    MAX_POSTER_BYTES,
    errors,
  );
  if (data.preview.video) {
    checkFile(
      root,
      path.join(dir, data.preview.video),
      MAX_VIDEO_BYTES,
      errors,
    );
  }
  if (errors.length > before) {
    valid = false;
  }
  if (!valid) {
    return null;
  }
  return { ...data, type: "desktop", slug };
}

function loadCli(
  root: string,
  slug: string,
  errors: RegistryError[],
): CliTheme | null {
  const dir = path.join(root, "cli", slug);
  const themeFile = path.join(dir, "theme.json");
  const metaFile = path.join(dir, "meta.json");
  let valid = true;
  for (const file of [themeFile, metaFile]) {
    if (!existsSync(/*turbopackIgnore: true*/ file)) {
      errors.push({ file: relative(root, file), message: "file is missing" });
      valid = false;
    }
  }
  if (!valid) {
    return null;
  }
  const theme = cliThemeFileSchema.safeParse(readJson(themeFile));
  const meta = cliMetaSchema.safeParse(readJson(metaFile));
  if (!theme.success) {
    for (const issue of theme.error.issues) {
      errors.push({
        file: relative(root, themeFile),
        message: `${issue.path.join(".")}: ${issue.message}`,
      });
    }
  }
  if (!meta.success) {
    for (const issue of meta.error.issues) {
      errors.push({
        file: relative(root, metaFile),
        message: `${issue.path.join(".")}: ${issue.message}`,
      });
    }
  }
  if (!theme.success || !meta.success) {
    return null;
  }
  return {
    type: "cli",
    slug,
    name: theme.data.name,
    description: meta.data.description,
    author: meta.data.author,
    license: meta.data.license,
    attribution: meta.data.attribution,
    upstream: meta.data.upstream,
    tags: meta.data.tags,
    addedAt: meta.data.addedAt,
    theme: theme.data,
  };
}

export function loadRegistry(
  root: string = defaultRegistryRoot(),
): RegistryLoadResult {
  const errors: RegistryError[] = [];
  const themes: Theme[] = [];
  const seen = new Map<string, string>();

  const entries: { type: "desktop" | "cli"; slug: string }[] = [
    ...listDirectories(path.join(root, "desktop")).map((slug) => ({
      type: "desktop" as const,
      slug,
    })),
    ...listDirectories(path.join(root, "cli")).map((slug) => ({
      type: "cli" as const,
      slug,
    })),
  ];

  for (const entry of entries) {
    const slugCheck = slugSchema.safeParse(entry.slug);
    if (!slugCheck.success) {
      errors.push({
        file: `registry/${entry.type}/${entry.slug}`,
        message: "folder name is not a valid slug",
      });
      continue;
    }
    const previous = seen.get(entry.slug);
    if (previous) {
      errors.push({
        file: `registry/${entry.type}/${entry.slug}`,
        message: `slug is already used by ${previous}`,
      });
      continue;
    }
    seen.set(entry.slug, `registry/${entry.type}/${entry.slug}`);
    const theme =
      entry.type === "desktop"
        ? loadDesktop(root, entry.slug, errors)
        : loadCli(root, entry.slug, errors);
    if (theme) {
      themes.push(theme);
    }
  }

  return { themes, errors };
}

export function loadThemesOrThrow(
  root: string = defaultRegistryRoot(),
): Theme[] {
  const { themes, errors } = loadRegistry(root);
  if (errors.length > 0) {
    const lines = errors.map((error) => `${error.file}: ${error.message}`);
    throw new Error(`Registry is invalid:\n${lines.join("\n")}`);
  }
  return themes;
}
