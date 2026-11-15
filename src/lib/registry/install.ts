import { siteConfig } from "@/config/site";
import type { Theme } from "./schema";

export type ShellKind = "posix" | "powershell";

export type InstallPlan = {
  /** Run once. Adds the ThemeCC marketplace. */
  addMarketplace: string;
  /** Installs this theme from the ThemeCC marketplace. */
  install: string;
  /** Command that selects the theme after installing. Null when the mod applies itself. */
  activate: string | null;
};

export function pluginNameFor(theme: Theme): string {
  switch (theme.type) {
    case "desktop":
      return theme.plugin;
    case "cli":
      return `cli-${theme.slug}`;
    default: {
      const unreachable: never = theme;
      return unreachable;
    }
  }
}

export function marketplaceAddCommand(): string {
  return `/plugin marketplace add ${siteConfig.repo}`;
}

export function installPlan(theme: Theme): InstallPlan {
  const plugin = pluginNameFor(theme);
  const install = `/plugin install ${plugin}@${siteConfig.marketplaceName}`;
  switch (theme.type) {
    case "desktop":
      return {
        addMarketplace: marketplaceAddCommand(),
        install,
        activate: null,
      };
    case "cli":
      return {
        addMarketplace: marketplaceAddCommand(),
        install,
        activate: "/theme",
      };
    default: {
      const unreachable: never = theme;
      return unreachable;
    }
  }
}

export function cliRawUrl(slug: string): string {
  return `https://raw.githubusercontent.com/${siteConfig.repo}/${siteConfig.defaultBranch}/registry/cli/${slug}/theme.json`;
}

/** Single-file install for CLI themes. Creates ~/.claude/themes if needed. */
export function cliFileInstallCommand(slug: string, shell: ShellKind): string {
  const url = cliRawUrl(slug);
  switch (shell) {
    case "posix":
      return `mkdir -p ~/.claude/themes && curl -fsSL -o ~/.claude/themes/${slug}.json ${url}`;
    case "powershell":
      return `New-Item -ItemType Directory -Force "$HOME/.claude/themes" | Out-Null; Invoke-WebRequest -Uri ${url} -OutFile "$HOME/.claude/themes/${slug}.json"`;
    default: {
      const unreachable: never = shell;
      return unreachable;
    }
  }
}
