import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { HREFLANG, type Locale, OG_LOCALE, routing } from "@/i18n/routing";

export function localizedPath(locale: Locale, pathname: string): string {
  if (locale === routing.defaultLocale) {
    return pathname;
  }
  return pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
}

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, siteConfig.url).toString();
}

export function buildAlternates(
  locale: Locale,
  pathname: string,
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const item of routing.locales) {
    languages[HREFLANG[item]] = absoluteUrl(localizedPath(item, pathname));
  }
  languages["x-default"] = absoluteUrl(
    localizedPath(routing.defaultLocale, pathname),
  );
  return {
    canonical: absoluteUrl(localizedPath(locale, pathname)),
    languages,
  };
}

const DEFAULT_OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "ThemeCC: Claude Code themes with previews and one-command install",
};

export function buildPageMetadata(options: {
  locale: Locale;
  pathname: string;
  title: string;
  description: string;
  type?: "website" | "article";
}): Metadata {
  const { locale, pathname, title, description, type = "website" } = options;
  const url = absoluteUrl(localizedPath(locale, pathname));
  return {
    title,
    description,
    alternates: buildAlternates(locale, pathname),
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: OG_LOCALE[locale],
      images: [{ ...DEFAULT_OG_IMAGE, url: absoluteUrl(DEFAULT_OG_IMAGE.url) }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(DEFAULT_OG_IMAGE.url)],
    },
  };
}
