import { z } from "zod";
import type { LocalizedText } from "./text";

export type { LocalizedText };

export const LICENSES = [
  "MIT",
  "Apache-2.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "ISC",
  "CC0-1.0",
] as const;

export const CLI_BASES = [
  "dark",
  "light",
  "dark-daltonized",
  "light-daltonized",
  "dark-ansi",
  "light-ansi",
] as const;

export const COLOR_SCHEMES = ["light", "dark"] as const;

export const slugSchema = z
  .string()
  .min(2)
  .max(48)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase kebab-case");

const githubUserSchema = z
  .string()
  .regex(/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/, "invalid GitHub username");

const githubRepoSchema = z
  .string()
  .regex(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/, "repo must be owner/name");

const shaSchema = z
  .string()
  .regex(/^[0-9a-f]{40}$/, "sha must be a full 40-character lowercase hash");

const versionSchema = z
  .string()
  .regex(/^\d+\.\d+\.\d+$/, "version must look like 2.1.319");

const isoDateSchema = z.iso.date();

const fileNameSchema = z
  .string()
  .regex(
    /^[a-z0-9][a-z0-9._-]*\.(webp|png|jpg|mp4|webm)$/,
    "invalid file name",
  );

const tagSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(24);

const localizedTextSchema = (max: number) =>
  z.object({
    en: z.string().min(10).max(max),
    zh: z.string().min(2).max(max).optional(),
  });

export const licenseSchema = z.enum(LICENSES);

export const desktopThemeSchema = z
  .object({
    name: z.string().min(1).max(60),
    description: localizedTextSchema(280),
    usage: localizedTextSchema(280).optional(),
    author: z.object({ github: githubUserSchema }).strict(),
    license: licenseSchema,
    source: z
      .object({
        repo: githubRepoSchema,
        path: z.string().min(1).max(200).optional(),
        sha: shaSchema,
      })
      .strict(),
    plugin: slugSchema,
    minClaudeCode: versionSchema,
    colorScheme: z.array(z.enum(COLOR_SCHEMES)).min(1).max(2),
    motion: z.boolean(),
    tags: z.array(tagSchema).max(6),
    permissions: z
      .object({
        network: z.boolean(),
        files: z.boolean(),
        commands: z.boolean(),
      })
      .strict(),
    preview: z
      .object({
        poster: fileNameSchema,
        video: fileNameSchema.optional(),
      })
      .strict(),
    reviewed: z
      .object({ by: githubUserSchema, at: isoDateSchema })
      .strict()
      .optional(),
    addedAt: isoDateSchema,
  })
  .strict();

export type DesktopThemeFile = z.infer<typeof desktopThemeSchema>;

const colorValueSchema = z
  .string()
  .regex(
    /^(#[0-9a-fA-F]{3}|#[0-9a-fA-F]{6}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|ansi256\(\d{1,3}\)|ansi:[A-Za-z]+)$/,
    "invalid color value",
  );

export const cliThemeFileSchema = z
  .object({
    name: z.string().min(1).max(60),
    base: z.enum(CLI_BASES),
    overrides: z.record(z.string().regex(/^[A-Za-z_]+$/), colorValueSchema),
  })
  .strict();

export type CliThemeFile = z.infer<typeof cliThemeFileSchema>;

export const cliMetaSchema = z
  .object({
    description: localizedTextSchema(280),
    author: z
      .object({
        name: z.string().min(1).max(80),
        github: githubUserSchema.optional(),
      })
      .strict(),
    license: licenseSchema,
    attribution: z.string().min(1).max(400).optional(),
    upstream: z.url().optional(),
    tags: z.array(tagSchema).max(6),
    addedAt: isoDateSchema,
  })
  .strict();

export type CliMetaFile = z.infer<typeof cliMetaSchema>;

export type ThemeType = "desktop" | "cli";

export type DesktopTheme = DesktopThemeFile & {
  type: "desktop";
  slug: string;
};

export type CliTheme = {
  type: "cli";
  slug: string;
  name: string;
  description: LocalizedText;
  author: CliMetaFile["author"];
  license: CliMetaFile["license"];
  attribution?: string | undefined;
  upstream?: string | undefined;
  tags: string[];
  addedAt: string;
  theme: CliThemeFile;
};

export type Theme = DesktopTheme | CliTheme;
