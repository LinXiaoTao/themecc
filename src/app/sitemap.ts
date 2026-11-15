import type { MetadataRoute } from "next";
import { HREFLANG, routing } from "@/i18n/routing";
import { GUIDE_SLUGS } from "@/lib/guides";
import { getAllThemes } from "@/lib/registry/themes";
import { absoluteUrl, localizedPath } from "@/lib/seo";

type Entry = {
  pathname: string;
  lastModified?: string;
};

function staticEntries(): Entry[] {
  const pages = [
    "/",
    "/desktop",
    "/cli",
    "/guides",
    "/submit",
    "/privacy",
    "/terms",
  ];
  return [
    ...pages.map((pathname) => ({ pathname })),
    ...GUIDE_SLUGS.map((slug) => ({ pathname: `/guides/${slug}` })),
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: Entry[] = [
    ...staticEntries(),
    ...getAllThemes().map((theme) => ({
      pathname: `/themes/${theme.slug}`,
      lastModified: theme.addedAt,
    })),
  ];

  return entries.flatMap((entry) =>
    routing.locales.map((locale) => {
      const languages: Record<string, string> = {};
      for (const item of routing.locales) {
        languages[HREFLANG[item]] = absoluteUrl(
          localizedPath(item, entry.pathname),
        );
      }
      return {
        url: absoluteUrl(localizedPath(locale, entry.pathname)),
        ...(entry.lastModified ? { lastModified: entry.lastModified } : {}),
        alternates: { languages },
      };
    }),
  );
}
