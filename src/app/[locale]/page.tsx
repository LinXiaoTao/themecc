import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CopyCommand } from "@/components/copy-command";
import { JsonLd } from "@/components/json-ld";
import { ThemeCard } from "@/components/theme-card";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { loadGuides } from "@/lib/guides";
import { marketplaceAddCommand } from "@/lib/registry/install";
import { toSummary } from "@/lib/registry/summary";
import {
  getAllThemes,
  getCliThemes,
  getDesktopThemes,
} from "@/lib/registry/themes";
import { absoluteUrl, buildPageMetadata, localizedPath } from "@/lib/seo";

const LATEST_COUNT = 6;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    ...buildPageMetadata({
      locale,
      pathname: "/",
      title: t("homeTitle"),
      description: t("homeDescription"),
    }),
    title: { absolute: t("homeTitle") },
  };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations("Home");
  const tt = await getTranslations("Theme");
  const guides = await loadGuides(locale);
  const latest = getAllThemes().slice(0, LATEST_COUNT).map(toSummary);
  const desktopCount = getDesktopThemes().length;
  const cliCount = getCliThemes().length;

  const steps = [
    { title: t("step1Title"), body: t("step1Body") },
    { title: t("step2Title"), body: t("step2Body") },
    { title: t("step3Title"), body: t("step3Body") },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl(localizedPath(locale, "/")),
    inLanguage: locale === "zh" ? "zh-Hans" : "en",
  };

  return (
    <div className="space-y-14">
      <JsonLd data={jsonLd} />
      <section className="space-y-6">
        <div className="space-y-3">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight">
            {t("heading")}
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">{t("lead")}</p>
        </div>
        <div className="max-w-2xl space-y-2">
          <h2 className="text-sm font-semibold">{t("addMarketplaceTitle")}</h2>
          <CopyCommand
            command={marketplaceAddCommand()}
            copyLabel={tt("copy")}
            copiedLabel={tt("copied")}
            event={{
              name: "copy_marketplace_add",
              params: { placement: "home" },
            }}
          />
          <p className="text-sm text-muted-foreground">
            {t("addMarketplaceHelp")}
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="relative rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/40">
          <h2 className="text-lg font-semibold">
            <Link href="/desktop" className="after:absolute after:inset-0">
              {t("desktopCardTitle")}
            </Link>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("desktopCardBody", { count: desktopCount })}
          </p>
        </div>
        <div className="relative rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/40">
          <h2 className="text-lg font-semibold">
            <Link href="/cli" className="after:absolute after:inset-0">
              {t("cliCardTitle")}
            </Link>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("cliCardBody", { count: cliCount })}
          </p>
        </div>
      </section>

      {latest.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{t("latestHeading")}</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((theme, index) => (
              <li key={theme.slug} className="flex">
                <ThemeCard theme={theme} priority={index < 3} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("howHeading")}</h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-lg border border-border p-5"
            >
              <p className="font-mono text-sm text-accent">{index + 1}</p>
              <h3 className="mt-1 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 rounded-lg border border-border bg-muted/50 p-6">
        <h2 className="text-xl font-semibold">{t("safetyHeading")}</h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          {t("safetyBody")}
        </p>
        <Link
          href="/guides/mod-security"
          className="text-sm font-medium text-accent underline underline-offset-2"
        >
          {t("safetyLink")}
        </Link>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("guidesHeading")}</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={`/guides/${guide.slug}`}
                className="block rounded-lg border border-border p-4 text-sm font-medium transition-colors hover:border-foreground/40"
              >
                {guide.meta.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 border-t border-border pt-10">
        <h2 className="text-2xl font-semibold">{t("submitHeading")}</h2>
        <p className="max-w-2xl text-muted-foreground">{t("submitBody")}</p>
        <Link
          href="/submit"
          className="inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          {t("submitLink")}
        </Link>
      </section>
    </div>
  );
}
