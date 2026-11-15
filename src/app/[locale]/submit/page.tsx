import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { OutboundLink } from "@/components/outbound-link";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import { LICENSES } from "@/lib/registry/schema";
import { buildPageMetadata } from "@/lib/seo";

const DESKTOP_EXAMPLE = `{
  "name": "Night Sky",
  "description": {
    "en": "A dark palette with a slow starfield behind the conversation.",
    "zh": "深色配色,对话后方有缓慢移动的星空。"
  },
  "usage": {
    "en": "Start a new local session in the Code tab. Run /night-sky off to remove it."
  },
  "author": { "github": "your-github-name" },
  "license": "MIT",
  "source": {
    "repo": "your-github-name/night-sky",
    "sha": "0123456789abcdef0123456789abcdef01234567"
  },
  "plugin": "night-sky",
  "minClaudeCode": "2.1.324",
  "colorScheme": ["dark"],
  "motion": true,
  "tags": ["space", "dark"],
  "permissions": { "network": false, "files": false, "commands": false },
  "preview": { "poster": "poster.webp", "video": "preview.mp4" },
  "addedAt": "2026-01-01"
}`;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/submit">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "Meta" });
  return buildPageMetadata({
    locale,
    pathname: "/submit",
    title: t("submitTitle"),
    description: t("submitDescription"),
  });
}

export default async function SubmitPage({
  params,
}: PageProps<"/[locale]/submit">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("Submit");

  const steps = [t("step1"), t("step2"), t("step3"), t("step4")];
  const desktopRules = [
    t("desktopRule1"),
    t("desktopRule2"),
    t("desktopRule3"),
    t("desktopRule4"),
    t("desktopRule5"),
    t("desktopRule6"),
  ];
  const cliRules = [t("cliRule1"), t("cliRule2"), t("cliRule3")];

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">{t("heading")}</h1>
        <p className="max-w-2xl text-muted-foreground">{t("lead")}</p>
        <OutboundLink
          href={siteConfig.repoUrl}
          event={{ name: "submit_click", params: { placement: "submit_page" } }}
          className="inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          {t("open")}
        </OutboundLink>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("stepsHeading")}</h2>
        <ol className="list-decimal space-y-2 pl-5">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("desktopHeading")}</h2>
        <p className="max-w-3xl text-muted-foreground">{t("desktopBody")}</p>
        <p className="font-mono text-sm">{t("desktopFiles")}</p>
        <h3 className="font-semibold">{t("desktopRules")}</h3>
        <ul className="list-disc space-y-1 pl-5">
          {desktopRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        <h3 className="font-semibold">{t("example")}</h3>
        <pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 font-mono text-sm leading-relaxed">
          <code>{DESKTOP_EXAMPLE}</code>
        </pre>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("cliHeading")}</h2>
        <p className="max-w-3xl text-muted-foreground">{t("cliBody")}</p>
        <p className="font-mono text-sm">{t("cliFiles")}</p>
        <h3 className="font-semibold">{t("cliRules")}</h3>
        <ul className="list-disc space-y-1 pl-5">
          {cliRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("licensesHeading")}</h2>
        <p className="text-muted-foreground">
          {t("licensesBody", { licenses: LICENSES.join(", ") })}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("reviewHeading")}</h2>
        <p className="max-w-3xl text-muted-foreground">{t("reviewBody")}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("removalHeading")}</h2>
        <p className="max-w-3xl text-muted-foreground">{t("removalBody")}</p>
      </section>
    </div>
  );
}
