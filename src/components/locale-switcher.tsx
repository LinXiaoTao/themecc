"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
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
    <nav aria-label={label} className="flex items-center gap-1 text-sm">
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          hrefLang={locale === "zh" ? "zh-Hans" : locale}
          lang={locale}
          aria-current={locale === current ? "true" : undefined}
          className={
            locale === current
              ? "rounded px-2 py-1 font-medium text-foreground"
              : "rounded px-2 py-1 text-muted-foreground hover:text-foreground"
          }
        >
          {LABELS[locale] ?? locale}
        </Link>
      ))}
    </nav>
  );
}
