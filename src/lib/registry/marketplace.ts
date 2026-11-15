import { siteConfig } from "@/config/site";
import { pluginNameFor } from "./install";
import type { CliTheme, DesktopTheme, Theme } from "./schema";

type MarketplaceSource =
  | string
  | { source: "url"; url: string; sha: string }
  | { source: "git-subdir"; url: string; path: string; sha: string };

export type MarketplacePlugin = {
  name: string;
  source: MarketplaceSource;
  description: string;
  license: string;
  tags: string[];
};

export type Marketplace = {
  name: string;
  description: string;
  owner: { name: string; url: string };
  plugins: MarketplacePlugin[];
};

export type GeneratedFile = {
  /** Path relative to the repository root. */
  path: string;
  contents: string;
};

/**
 * Full HTTPS URLs work for everyone. The owner/repo shorthand makes Claude Code
 * clone over SSH, which fails for users without a GitHub SSH key.
 */
function desktopSource(theme: DesktopTheme): MarketplaceSource {
  const url = `https://github.com/${theme.source.repo}.git`;
  if (theme.source.path) {
    return {
      source: "git-subdir",
      url,
      path: theme.source.path,
      sha: theme.source.sha,
    };
  }
  return { source: "url", url, sha: theme.source.sha };
}

function entryFor(theme: Theme): MarketplacePlugin {
  switch (theme.type) {
    case "desktop":
      return {
        name: pluginNameFor(theme),
        source: desktopSource(theme),
        description: theme.description.en,
        license: theme.license,
        tags: ["desktop", ...theme.tags],
      };
    case "cli":
      return {
        name: pluginNameFor(theme),
        source: `./plugins/${pluginNameFor(theme)}`,
        description: theme.description.en,
        license: theme.license,
        tags: ["cli", ...theme.tags],
      };
    default: {
      const unreachable: never = theme;
      return unreachable;
    }
  }
}

export function buildMarketplace(themes: Theme[]): Marketplace {
  const plugins = themes
    .map(entryFor)
    .sort((a, b) => a.name.localeCompare(b.name));
  return {
    name: siteConfig.marketplaceName,
    description:
      "Claude Code desktop and CLI themes collected by ThemeCC. Unofficial, not affiliated with Anthropic.",
    owner: { name: siteConfig.name, url: siteConfig.url },
    plugins,
  };
}

function json(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function buildCliPluginFiles(theme: CliTheme): GeneratedFile[] {
  const dir = `plugins/${pluginNameFor(theme)}`;
  const manifest: Record<string, unknown> = {
    name: pluginNameFor(theme),
    description: theme.description.en,
    author: theme.author.github
      ? {
          name: theme.author.name,
          url: `https://github.com/${theme.author.github}`,
        }
      : { name: theme.author.name },
    license: theme.license,
    homepage: `${siteConfig.url}/themes/${theme.slug}`,
    repository: siteConfig.repoUrl,
    experimental: { themes: "./themes/" },
  };
  return [
    { path: `${dir}/.claude-plugin/plugin.json`, contents: json(manifest) },
    { path: `${dir}/themes/${theme.slug}.json`, contents: json(theme.theme) },
  ];
}

export function buildGeneratedFiles(themes: Theme[]): GeneratedFile[] {
  const files: GeneratedFile[] = [
    {
      path: ".claude-plugin/marketplace.json",
      contents: json(buildMarketplace(themes)),
    },
  ];
  for (const theme of themes) {
    if (theme.type === "cli") {
      files.push(...buildCliPluginFiles(theme));
    }
  }
  return files;
}
