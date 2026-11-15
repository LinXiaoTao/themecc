import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { InstallBlock } from "@/components/install-block";
import { JsonLd } from "@/components/json-ld";
import { OutboundLink } from "@/components/outbound-link";
import { PreviewMedia } from "@/components/preview-media";
import { TerminalPreview } from "@/components/terminal-preview";
import { TokenTable } from "@/components/token-table";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
import { cliRawUrl } from "@/lib/registry/install";
import type { CliTheme, DesktopTheme, Theme } from "@/lib/registry/schema";
import { pickText, previewPath } from "@/lib/registry/text";
import { getAllThemes, getTheme } from "@/lib/registry/themes";
import { absoluteUrl, buildPageMetadata, localizedPath } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllThemes().map((theme) => ({ locale, slug: theme.slug })),
  );
}

function themePath(slug: string): string {
  return `/themes/${slug}`;
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/themes/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const theme = getTheme(slug);
  if (!hasLocale(routing.locales, locale) || !theme) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "Meta" });
  const tt = await getTranslations({ locale, namespace: "Theme" });
  const metadata = buildPageMetadata({
    locale,
    pathname: themePath(slug),
    title: t("themeTitle", {
      name: theme.name,
      type: theme.type === "desktop" ? tt("typeDesktop") : tt("typeCli"),
    }),
    description: pickText(theme.description, locale),
  });
  if (theme.type === "desktop") {
    const image = absoluteUrl(previewPath(theme.slug, theme.preview.poster));
    return {
      ...metadata,
      openGraph: { ...metadata.openGraph, images: [{ url: image }] },
      twitter: { ...metadata.twitter, images: [image] },
    };
  }
  return metadata;
}

function sourceUrl(theme: DesktopTheme): string {
  const base = `https://github.com/${theme.source.repo}/tree/${theme.source.sha}`;
  return theme.source.path ? `${base}/${theme.source.path}` : base;
}

function authorName(theme: Theme): string {
  return theme.type === "desktop"
    ? `@${theme.author.github}`
    : theme.author.name;
}

function authorUrl(theme: Theme): string | undefined {
  if (theme.type === "desktop") {
    return `https://github.com/${theme.author.github}`;
  }
  return theme.author.github
    ? `https://github.com/${theme.author.github}`
    : undefined;
}

type DetailRow = { label: string; value: string };

export default async function ThemePage({
  params,
}: PageProps<"/[locale]/themes/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const theme = getTheme(slug);
  if (!theme) {
    notFound();
  }
  return <ThemeView theme={theme} locale={locale} />;
}

async function ThemeView({ theme, locale }: { theme: Theme; locale: Locale }) {
  const t = await getTranslations("Theme");
  const tl = await getTranslations("List");
  const description = pickText(theme.description, locale);
  const typeLabel = theme.type === "desktop" ? t("typeDesktop") : t("typeCli");
  const listPath = theme.type === "desktop" ? "/desktop" : "/cli";
  const listLabel =
    theme.type === "desktop"
      ? (await getTranslations("Nav"))("desktop")
      : (await getTranslations("Nav"))("cli");

  const rows: DetailRow[] = [];
  if (theme.type === "desktop") {
    rows.push(
      { label: t("version"), value: `${theme.minClaudeCode}+` },
      {
        label: t("appearance"),
        value:
          theme.colorScheme.length === 2
            ? tl("lightDark")
            : theme.colorScheme[0] === "light"
              ? tl("light")
              : tl("dark"),
      },
      {
        label: t("motion"),
        value: theme.motion ? t("motionYes") : t("motionNo"),
      },
    );
  } else {
    rows.push({ label: t("base"), value: theme.theme.base });
  }
  rows.push({ label: t("license"), value: theme.license });

  const author = authorName(theme);
  const authorLink = authorUrl(theme);
  const pageUrl = absoluteUrl(localizedPath(locale, themePath(theme.slug)));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: t("breadcrumbHome"),
            item: absoluteUrl(localizedPath(locale, "/")),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: listLabel,
            item: absoluteUrl(localizedPath(locale, listPath)),
          },
          { "@type": "ListItem", position: 3, name: theme.name, item: pageUrl },
        ],
      },
      {
        "@type": "CreativeWork",
        name: theme.name,
        description,
        url: pageUrl,
        inLanguage: locale === "zh" ? "zh-Hans" : "en",
        license: `https://spdx.org/licenses/${theme.license}`,
        author: authorLink
          ? { "@type": "Person", name: author, url: authorLink }
          : { "@type": "Person", name: author },
        dateCreated: theme.addedAt,
        isPartOf: {
          "@type": "WebSite",
          name: siteConfig.name,
          url: siteConfig.url,
        },
      },
    ],
  };

  return (
    <article className="space-y-10">
      <JsonLd data={jsonLd} />
      <header className="space-y-3">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            {t("breadcrumbHome")}
          </Link>
          <span aria-hidden="true"> / </span>
          <Link href={listPath} className="hover:text-foreground">
            {listLabel}
          </Link>
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{theme.name}</h1>
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs">
            {typeLabel}
          </span>
        </div>
        <p className="max-w-2xl text-muted-foreground">{description}</p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          {theme.type === "desktop" ? (
            <>
              <PreviewMedia
                slug={theme.slug}
                poster={previewPath(theme.slug, theme.preview.poster)}
                video={
                  theme.preview.video
                    ? previewPath(theme.slug, theme.preview.video)
                    : undefined
                }
                alt={t("previewAlt", { name: theme.name })}
                playLabel={t("previewPlay")}
                priority
              />
              <p className="text-xs text-muted-foreground">
                {t("previewHint")}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold">{t("terminalHeading")}</h2>
              <TerminalPreview
                theme={theme.theme}
                label={t("previewAlt", { name: theme.name })}
              />
              <p className="text-xs text-muted-foreground">
                {t("terminalNote", { base: theme.theme.base })}
              </p>
            </>
          )}
        </div>
        <InstallBlock theme={theme} />
      </div>

      {theme.type === "desktop" ? <PermissionsSection theme={theme} /> : null}

      <section aria-labelledby="details-heading" className="space-y-3">
        <h2 id="details-heading" className="text-xl font-semibold">
          {t("details")}
        </h2>
        <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-[max-content_1fr]">
          <dt className="text-muted-foreground">{t("author")}</dt>
          <dd>
            {authorLink ? (
              <a
                href={authorLink}
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                {author}
              </a>
            ) : (
              author
            )}
          </dd>
          {rows.map((row) => (
            <DetailItem key={row.label} label={row.label} value={row.value} />
          ))}
          {theme.type === "desktop" ? (
            <>
              <dt className="text-muted-foreground">{t("source")}</dt>
              <dd>
                <OutboundLink
                  href={sourceUrl(theme)}
                  event={{
                    name: "outbound_repo_click",
                    params: { slug: theme.slug },
                  }}
                  className="underline underline-offset-2"
                >
                  {t("viewSource")}
                </OutboundLink>
              </dd>
              <dt className="text-muted-foreground">{t("pinned")}</dt>
              <dd className="font-mono">{theme.source.sha.slice(0, 12)}</dd>
            </>
          ) : (
            <CliLinks theme={theme} />
          )}
        </dl>
        {theme.type === "desktop" ? (
          <p className="text-sm text-muted-foreground">
            {t("reviewed", {
              by: `@${theme.reviewed.by}`,
              date: theme.reviewed.at,
            })}
          </p>
        ) : null}
        <p>
          <OutboundLink
            href={siteConfig.issuesUrl}
            className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            {t("report")}
          </OutboundLink>
        </p>
      </section>

      {theme.type === "cli" ? <TokenTable theme={theme.theme} /> : null}
    </article>
  );
}

function DetailItem({ label, value }: DetailRow) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </>
  );
}

async function PermissionsSection({ theme }: { theme: DesktopTheme }) {
  const t = await getTranslations("Theme");
  const used: string[] = [];
  if (theme.permissions.network) {
    used.push(t("permNetwork"));
  }
  if (theme.permissions.files) {
    used.push(t("permFiles"));
  }
  if (theme.permissions.commands) {
    used.push(t("permCommands"));
  }
  return (
    <section
      aria-labelledby="permissions-heading"
      className="space-y-3 rounded-lg border border-border bg-muted/50 p-5"
    >
      <h2 id="permissions-heading" className="text-xl font-semibold">
        {t("permissionsHeading")}
      </h2>
      <p className="text-sm text-muted-foreground">{t("permissionsLead")}</p>
      {used.length === 0 ? (
        <p className="text-sm">{t("permNone")}</p>
      ) : (
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {used.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      <p className="text-sm">{t("modWarning")}</p>
    </section>
  );
}

async function CliLinks({ theme }: { theme: CliTheme }) {
  const t = await getTranslations("Theme");
  return (
    <>
      <dt className="text-muted-foreground">{t("download")}</dt>
      <dd>
        <a
          href={cliRawUrl(theme.slug)}
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          theme.json
        </a>
      </dd>
      {theme.upstream ? (
        <>
          <dt className="text-muted-foreground">{t("upstream")}</dt>
          <dd>
            <a
              href={theme.upstream}
              rel="noopener noreferrer"
              className="break-all underline underline-offset-2"
            >
              {theme.upstream}
            </a>
          </dd>
        </>
      ) : null}
      {theme.attribution ? (
        <>
          <dt className="text-muted-foreground">{t("attribution")}</dt>
          <dd>{theme.attribution}</dd>
        </>
      ) : null}
    </>
  );
}
