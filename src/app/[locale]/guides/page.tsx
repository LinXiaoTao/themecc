import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { loadGuides } from "@/lib/guides";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/guides">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "Meta" });
  return buildPageMetadata({
    locale,
    pathname: "/guides",
    title: t("guidesTitle"),
    description: t("guidesDescription"),
  });
}

export default async function GuidesPage({
  params,
}: PageProps<"/[locale]/guides">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("Guides");
  const guides = await loadGuides(locale);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("heading")}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {t("lead")}
        </p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2">
        {guides.map((guide) => (
          <li
            key={guide.slug}
            className="relative rounded-2xl border border-border bg-card p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-foreground/25 hover:shadow-card-hover"
          >
            <h2 className="font-semibold leading-snug">
              <Link
                href={`/guides/${guide.slug}`}
                className="after:absolute after:inset-0"
              >
                {guide.meta.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {guide.meta.description}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {t("updated", { date: guide.meta.updated })}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
