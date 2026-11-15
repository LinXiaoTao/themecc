import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { primaryButton, secondaryButton } from "@/components/button-styles";
import { CopyCommand } from "@/components/copy-command";
import {
  ArrowRightIcon,
  BookIcon,
  MonitorIcon,
  ShieldIcon,
  TerminalIcon,
} from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { TerminalPreview } from "@/components/terminal-preview";
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
  const desktopThemes = getDesktopThemes();
  const cliThemes = getCliThemes();
  const desktopCount = desktopThemes.length;
  const cliCount = cliThemes.length;
  const tn = await getTranslations("Nav");
  const showcaseDesktop = desktopThemes[0] ? toSummary(desktopThemes[0]) : null;
  const showcaseCli = cliThemes[0] ? toSummary(cliThemes[0]) : null;
  const stats = [
    { value: desktopCount, label: tn("desktop") },
    { value: cliCount, label: tn("cli") },
    { value: guides.length, label: tn("guides") },
  ];

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
    <div className="space-y-20">
      <JsonLd data={jsonLd} />
      <section className="grid items-center gap-12 pt-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:pt-10">
        <div className="rise-in space-y-8">
          <div className="space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-accent"
              />
              {t("eyebrow")}
            </p>
            <h1 className="max-w-2xl text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              {t("heading")}
            </h1>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {t("lead")}
            </p>
          </div>
          <div className="max-w-xl space-y-3">
            <h2 className="text-sm font-semibold">
              {t("addMarketplaceTitle")}
            </h2>
            <CopyCommand
              command={marketplaceAddCommand()}
              copyLabel={tt("copy")}
              copiedLabel={tt("copied")}
              event={{
                name: "copy_marketplace_add",
                params: { placement: "home" },
              }}
            />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("addMarketplaceHelp")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/desktop" className={primaryButton}>
              {tn("desktop")}
              <ArrowRightIcon className="size-4" />
            </Link>
            <Link href="/cli" className={secondaryButton}>
              {tn("cli")}
            </Link>
          </div>
          <dl className="flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dd className="font-mono text-3xl font-semibold tracking-tight">
                  {stat.value}
                </dd>
                <dt className="text-sm text-muted-foreground">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
        <div aria-hidden="true" className="relative hidden pb-16 lg:block">
          {showcaseDesktop?.poster ? (
            <Image
              src={showcaseDesktop.poster}
              alt=""
              width={640}
              height={360}
              sizes="480px"
              className="aspect-video w-full rotate-1 rounded-2xl border border-border object-cover shadow-card-hover"
            />
          ) : null}
          {showcaseCli?.cliTheme ? (
            <div className="absolute -bottom-0 -left-8 w-[78%] -rotate-2">
              <TerminalPreview
                theme={showcaseCli.cliTheme}
                label=""
                compact
                className="shadow-card-hover"
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2">
        <div className="group relative flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-foreground/25 hover:shadow-card-hover">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <MonitorIcon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold">
              <Link href="/desktop" className="after:absolute after:inset-0">
                {t("desktopCardTitle")}
              </Link>
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {t("desktopCardBody", { count: desktopCount })}
            </p>
          </div>
          <ArrowRightIcon className="size-5 shrink-0 self-center text-muted-foreground transition group-hover:translate-x-1 group-hover:text-accent" />
        </div>
        <div className="group relative flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-foreground/25 hover:shadow-card-hover">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <TerminalIcon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold">
              <Link href="/cli" className="after:absolute after:inset-0">
                {t("cliCardTitle")}
              </Link>
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {t("cliCardBody", { count: cliCount })}
            </p>
          </div>
          <ArrowRightIcon className="size-5 shrink-0 self-center text-muted-foreground transition group-hover:translate-x-1 group-hover:text-accent" />
        </div>
      </section>

      {latest.length > 0 ? (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t("latestHeading")}
          </h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((theme, index) => (
              <li key={theme.slug} className="flex">
                <ThemeCard theme={theme} priority={index < 3} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("howHeading")}
        </h2>
        <ol className="grid gap-5 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <span
                aria-hidden="true"
                className="flex size-9 items-center justify-center rounded-full bg-accent font-mono text-sm font-semibold text-accent-foreground"
              >
                {index + 1}
              </span>
              <h3 className="mt-4 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-5 rounded-2xl border border-accent/30 bg-accent-soft/60 p-6 sm:flex-row sm:items-start sm:p-8">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <ShieldIcon className="size-5" />
        </span>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">{t("safetyHeading")}</h2>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {t("safetyBody")}
          </p>
          <Link
            href="/guides/mod-security"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline hover:underline-offset-4"
          >
            {t("safetyLink")}
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("guidesHeading")}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={`/guides/${guide.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm font-medium shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-card"
              >
                <BookIcon className="size-5 shrink-0 text-accent" />
                <span className="flex-1">{guide.meta.title}</span>
                <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-accent" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-12 text-center shadow-card sm:px-12">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(30rem_14rem_at_50%_0%,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("submitHeading")}
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            {t("submitBody")}
          </p>
          <Link href="/submit" className={primaryButton}>
            {t("submitLink")}
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
