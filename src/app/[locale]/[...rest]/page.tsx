import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

/** Renders the localized not-found page for any path that matches no route. */
export default async function CatchAllPage({
  params,
}: PageProps<"/[locale]/[...rest]">) {
  const { locale } = await params;
  if (hasLocale(routing.locales, locale)) {
    setRequestLocale(locale);
  }
  notFound();
}
