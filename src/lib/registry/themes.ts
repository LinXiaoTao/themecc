import { cache } from "react";
import { loadThemesOrThrow } from "./load";
import type { CliTheme, DesktopTheme, Theme, ThemeType } from "./schema";

/** Newest first. On the same day desktop themes come first, then by name. */
function byNewest(a: Theme, b: Theme): number {
  if (a.addedAt !== b.addedAt) {
    return a.addedAt < b.addedAt ? 1 : -1;
  }
  if (a.type !== b.type) {
    return a.type === "desktop" ? -1 : 1;
  }
  return a.name.localeCompare(b.name);
}

export const getAllThemes = cache((): Theme[] => {
  return loadThemesOrThrow().sort(byNewest);
});

export function getDesktopThemes(): DesktopTheme[] {
  return getAllThemes().filter(
    (theme): theme is DesktopTheme => theme.type === "desktop",
  );
}

export function getCliThemes(): CliTheme[] {
  return getAllThemes().filter(
    (theme): theme is CliTheme => theme.type === "cli",
  );
}

export function getThemesByType(type: ThemeType): Theme[] {
  switch (type) {
    case "desktop":
      return getDesktopThemes();
    case "cli":
      return getCliThemes();
    default: {
      const unreachable: never = type;
      return unreachable;
    }
  }
}

export function getTheme(slug: string): Theme | undefined {
  return getAllThemes().find((theme) => theme.slug === slug);
}
