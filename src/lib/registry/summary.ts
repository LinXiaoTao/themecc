import type { CliThemeFile, Theme, ThemeType } from "./schema";
import { type LocalizedText, previewPath } from "./text";

export type ColorScheme = "light" | "dark";

/** Serializable subset of a theme, safe to pass to client components. */
export type ThemeSummary = {
  slug: string;
  type: ThemeType;
  name: string;
  description: LocalizedText;
  colorScheme: ColorScheme[];
  motion: boolean;
  minClaudeCode?: string | undefined;
  poster?: string | undefined;
  cliTheme?: CliThemeFile | undefined;
};

export function cliColorScheme(theme: CliThemeFile): ColorScheme {
  return theme.base.startsWith("light") ? "light" : "dark";
}

export function toSummary(theme: Theme): ThemeSummary {
  switch (theme.type) {
    case "desktop":
      return {
        slug: theme.slug,
        type: "desktop",
        name: theme.name,
        description: theme.description,
        colorScheme: theme.colorScheme,
        motion: theme.motion,
        minClaudeCode: theme.minClaudeCode,
        poster: previewPath(theme.slug, theme.preview.poster),
      };
    case "cli":
      return {
        slug: theme.slug,
        type: "cli",
        name: theme.name,
        description: theme.description,
        colorScheme: [cliColorScheme(theme.theme)],
        motion: false,
        cliTheme: theme.theme,
      };
    default: {
      const unreachable: never = theme;
      return unreachable;
    }
  }
}
