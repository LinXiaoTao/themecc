import { describe, expect, it } from "vitest";
import {
  cliMetaSchema,
  cliThemeFileSchema,
  desktopThemeSchema,
  slugSchema,
} from "./schema";

const validDesktop = {
  name: "Rainy Window",
  description: { en: "A rainy window scene in halftone dots." },
  author: { github: "example" },
  license: "MIT",
  source: { repo: "example/rainy", sha: "a".repeat(40) },
  plugin: "rainy-window",
  minClaudeCode: "2.1.325",
  colorScheme: ["light", "dark"],
  motion: true,
  tags: ["rain"],
  permissions: { network: false, files: false, commands: false },
  preview: { poster: "poster.webp" },
  reviewed: { by: "LinXiaoTao", at: "2026-11-15" },
  addedAt: "2026-11-15",
};

describe("slugSchema", () => {
  it("accepts kebab-case", () => {
    expect(slugSchema.safeParse("honu-lagoon").success).toBe(true);
  });

  it("rejects uppercase, underscores, and edge hyphens", () => {
    expect(slugSchema.safeParse("Honu").success).toBe(false);
    expect(slugSchema.safeParse("honu_lagoon").success).toBe(false);
    expect(slugSchema.safeParse("-honu").success).toBe(false);
  });
});

describe("desktopThemeSchema", () => {
  it("accepts a valid entry", () => {
    expect(desktopThemeSchema.safeParse(validDesktop).success).toBe(true);
  });

  it("accepts an entry without a review record", () => {
    const { reviewed: _reviewed, ...unreviewed } = validDesktop;
    expect(desktopThemeSchema.safeParse(unreviewed).success).toBe(true);
  });

  it("requires a full 40 character sha", () => {
    const result = desktopThemeSchema.safeParse({
      ...validDesktop,
      source: { repo: "example/rainy", sha: "abc123" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects licenses that are not accepted", () => {
    expect(
      desktopThemeSchema.safeParse({ ...validDesktop, license: "GPL-3.0" })
        .success,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      desktopThemeSchema.safeParse({ ...validDesktop, extra: true }).success,
    ).toBe(false);
  });
});

describe("cliThemeFileSchema", () => {
  it("accepts the official theme format", () => {
    const result = cliThemeFileSchema.safeParse({
      name: "Dracula",
      base: "dark",
      overrides: { claude: "#bd93f9", error: "ansi:red", text: "rgb(1,2,3)" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid color values and bases", () => {
    expect(
      cliThemeFileSchema.safeParse({
        name: "Bad",
        base: "dark",
        overrides: { claude: "purple" },
      }).success,
    ).toBe(false);
    expect(
      cliThemeFileSchema.safeParse({
        name: "Bad",
        base: "midnight",
        overrides: {},
      }).success,
    ).toBe(false);
  });
});

describe("cliMetaSchema", () => {
  it("requires a license and an English description", () => {
    expect(
      cliMetaSchema.safeParse({
        description: { en: "Soft purple accents on a dark base." },
        author: { name: "Example" },
        license: "MIT",
        tags: [],
        addedAt: "2026-11-15",
      }).success,
    ).toBe(true);
    expect(
      cliMetaSchema.safeParse({
        description: { en: "Soft purple accents on a dark base." },
        author: { name: "Example" },
        tags: [],
        addedAt: "2026-11-15",
      }).success,
    ).toBe(false);
  });
});
