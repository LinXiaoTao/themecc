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
}: PageProps<"/[locale]/terms">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const { meta } = await loadLegal(locale, "terms");
  return buildPageMetadata({
    locale,
    pathname: "/terms",
    title: meta.title,
    description: meta.description,
  });
}

export default async function TermsPage({
  params,
}: PageProps<"/[locale]/terms">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  return <LegalPage locale={locale} slug="terms" />;
}
