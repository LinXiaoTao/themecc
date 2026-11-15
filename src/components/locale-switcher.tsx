"use client";

import NextLink from "next/link";
import { useLocale } from "next-intl";
import { getPathname, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = {
  en: "English",
  zh: "中文",
};

type Props = {
  label: string;
};

export function LocaleSwitcher({ label }: Props) {
  const current = useLocale();
  const pathname = usePathname();
  return (
    <nav
      aria-label={label}
      className="flex items-center gap-0.5 rounded-full border border-border bg-card p-0.5 text-xs"
    >
      {routing.locales.map((locale) => (
        <NextLink
          key={locale}
          href={getPathname({ href: pathname, locale })}
          hrefLang={locale === "zh" ? "zh-Hans" : locale}
          lang={locale}
          aria-current={locale === current ? "true" : undefined}
          className={
            locale === current
              ? "rounded-full bg-foreground px-2.5 py-1 font-medium text-background"
              : "rounded-full px-2.5 py-1 text-muted-foreground transition-colors hover:text-foreground"
          }
        >
          {LABELS[locale] ?? locale}
        </NextLink>
      ))}
    </nav>
  );
}
