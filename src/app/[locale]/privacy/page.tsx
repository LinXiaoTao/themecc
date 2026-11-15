import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/components/legal-page";
import { routing } from "@/i18n/routing";
import { loadLegal } from "@/lib/legal";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const { meta } = await loadLegal(locale, "privacy");
  return buildPageMetadata({
    locale,
    pathname: "/privacy",
    title: meta.title,
    description: meta.description,
  });
}

export default async function PrivacyPage({
  params,
}: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  return <LegalPage locale={locale} slug="privacy" />;
}
