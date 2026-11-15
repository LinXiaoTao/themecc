import { getTranslations } from "next-intl/server";
import { SITE_MIN_VERSIONS, siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";
import type { ThemeType } from "@/lib/registry/schema";
import { toSummary } from "@/lib/registry/summary";
import { getThemesByType } from "@/lib/registry/themes";
import { absoluteUrl, localizedPath } from "@/lib/seo";
import { JsonLd } from "./json-ld";
import { ThemeBrowser } from "./theme-browser";

type Props = {
  type: ThemeType;
  locale: Locale;
};

export async function ThemeListPage({ type, locale }: Props) {
  const t = await getTranslations("List");
  const themes = getThemesByType(type);
  const summaries = themes.map(toSummary);
  const isDesktop = type === "desktop";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: isDesktop ? t("desktopHeading") : t("cliHeading"),
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: themes.map((theme, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: theme.name,
        url: absoluteUrl(localizedPath(locale, `/themes/${theme.slug}`)),
      })),
    },
  };

  return (
    <div className="space-y-8">
      <JsonLd data={jsonLd} />
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          {isDesktop ? t("desktopHeading") : t("cliHeading")}
        </h1>
        <p className="max-w-3xl text-muted-foreground">
          {isDesktop ? t("desktopLead") : t("cliLead")}
        </p>
        <p className="max-w-3xl text-sm text-muted-foreground">
          <strong className="font-medium text-foreground">
            {t("requirements")}:{" "}
          </strong>
          {isDesktop
            ? t("desktopReq", {
                backdrop: SITE_MIN_VERSIONS.desktopBackdrop,
                colors: SITE_MIN_VERSIONS.desktopColors,
              })
            : t("cliReq", { version: SITE_MIN_VERSIONS.cliCustomTheme })}
        </p>
      </header>
      <ThemeBrowser themes={summaries} showMotionFilter={isDesktop} />
    </div>
  );
}
