import { describe, expect, it } from "vitest";
import {
  cliFileInstallCommand,
  installPlan,
  marketplaceAddCommand,
  pluginNameFor,
} from "./install";
import { buildCliPluginFiles, buildMarketplace } from "./marketplace";
import type { CliTheme, DesktopTheme } from "./schema";

const desktop: DesktopTheme = {
  type: "desktop",
  slug: "rainy-window",
  name: "Rainy Window",
  description: { en: "A rainy window scene in halftone dots." },
  author: { github: "example" },
  license: "MIT",
  source: {
    repo: "example/themes",
    path: "themes/rainy-window",
    sha: "b".repeat(40),
  },
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

const cli: CliTheme = {
  type: "cli",
  slug: "dracula-port",
  name: "Dracula",
  description: { en: "Dracula palette mapped onto Claude Code." },
  author: { name: "Example", github: "example" },
  license: "MIT",
  upstream: "https://github.com/example/dracula",
  tags: ["dark"],
  addedAt: "2026-11-15",
  theme: { name: "Dracula", base: "dark", overrides: { claude: "#bd93f9" } },
};

describe("install commands", () => {
  it("builds the marketplace command from the repository", () => {
    expect(marketplaceAddCommand()).toBe(
      "/plugin marketplace add LinXiaoTao/themecc",
    );
  });

  it("names plugins by theme type", () => {
    expect(pluginNameFor(desktop)).toBe("rainy-window");
    expect(pluginNameFor(cli)).toBe("cli-dracula-port");
  });

  it("has no activation command for desktop mods and uses /theme for CLI", () => {
    expect(installPlan(desktop).activate).toBeNull();
    expect(installPlan(cli).activate).toBe("/theme");
    expect(installPlan(cli).install).toBe(
      "/plugin install cli-dracula-port@themecc",
    );
  });

  it("builds shell specific single file commands", () => {
    expect(cliFileInstallCommand("dracula-port", "posix")).toContain(
      "curl -fsSL",
    );
    expect(cliFileInstallCommand("dracula-port", "powershell")).toContain(
      "Invoke-WebRequest",
    );
  });
});

describe("buildMarketplace", () => {
  it("pins desktop themes to a sha and uses git-subdir for subdirectories", () => {
    const marketplace = buildMarketplace([desktop]);
    expect(marketplace.name).toBe("themecc");
    expect(marketplace.plugins[0]?.source).toEqual({
      source: "git-subdir",
      url: "https://github.com/example/themes.git",
      path: "themes/rainy-window",
      sha: "b".repeat(40),
    });
  });

  it("uses the url source when there is no subdirectory", () => {
    const rootTheme: DesktopTheme = {
      ...desktop,
      source: { repo: "example/rainy", sha: "c".repeat(40) },
    };
    expect(buildMarketplace([rootTheme]).plugins[0]?.source).toEqual({
      source: "url",
      url: "https://github.com/example/rainy.git",
      sha: "c".repeat(40),
    });
  });

  it("points CLI themes at generated local plugins and sorts by name", () => {
    const marketplace = buildMarketplace([desktop, cli]);
    expect(marketplace.plugins.map((plugin) => plugin.name)).toEqual([
      "cli-dracula-port",
      "rainy-window",
    ]);
    expect(marketplace.plugins[0]?.source).toBe("./plugins/cli-dracula-port");
  });
});

describe("buildCliPluginFiles", () => {
  it("writes a manifest that declares the themes directory and the theme file", () => {
    const files = buildCliPluginFiles(cli);
    const manifest = files.find((file) => file.path.endsWith("plugin.json"));
    const theme = files.find((file) => file.path.endsWith("dracula-port.json"));
    expect(manifest).toBeDefined();
    expect(JSON.parse(manifest?.contents ?? "{}")).toMatchObject({
      name: "cli-dracula-port",
      experimental: { themes: "./themes/" },
      license: "MIT",
    });
    expect(JSON.parse(theme?.contents ?? "{}")).toEqual(cli.theme);
  });
});
