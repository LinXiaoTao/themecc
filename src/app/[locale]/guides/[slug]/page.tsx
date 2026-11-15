import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { GUIDE_SLUGS, isGuideSlug, loadGuide } from "@/lib/guides";
import { absoluteUrl, buildPageMetadata, localizedPath } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    GUIDE_SLUGS.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/guides/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale) || !isGuideSlug(slug)) {
    return {};
  }
  const { meta } = await loadGuide(locale, slug);
  return buildPageMetadata({
    locale,
    pathname: `/guides/${slug}`,
    title: meta.title,
    description: meta.description,
    type: "article",
  });
}

export default async function GuidePage({
  params,
}: PageProps<"/[locale]/guides/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale) || !isGuideSlug(slug)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("Guides");
  const tn = await getTranslations("Nav");
  const { meta, Content } = await loadGuide(locale, slug);
  const url = absoluteUrl(localizedPath(locale, `/guides/${slug}`));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: tn("guides"),
            item: absoluteUrl(localizedPath(locale, "/guides")),
          },
          { "@type": "ListItem", position: 2, name: meta.title, item: url },
        ],
      },
      {
        "@type": "Article",
        headline: meta.title,
        description: meta.description,
        dateModified: meta.updated,
        inLanguage: locale === "zh" ? "zh-Hans" : "en",
        mainEntityOfPage: url,
        author: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
        },
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
        },
      },
    ],
  };

  return (
    <article className="space-y-6">
      <JsonLd data={jsonLd} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link href="/guides" className="hover:text-foreground">
          {tn("guides")}
        </Link>
      </nav>
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{meta.title}</h1>
        <p className="text-sm text-muted-foreground">
          {t("updated", { date: meta.updated })}
        </p>
      </header>
      <div className="prose-content">
        <Content />
      </div>
    </article>
  );
}
