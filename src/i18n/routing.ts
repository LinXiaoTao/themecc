import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "zh"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];

export const HREFLANG: Record<Locale, string> = {
  en: "en",
  zh: "zh-Hans",
};

export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  zh: "zh_CN",
};
