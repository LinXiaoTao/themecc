import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ConsentBanner } from "@/components/consent-banner";
import { GoogleAnalytics } from "@/components/google-analytics";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { isProductionDeployment, siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import { CONSENT_STORAGE_KEY } from "@/lib/analytics";
import { REGION_COOKIE } from "@/lib/consent-region";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "Meta" });
  const verification: NonNullable<Metadata["verification"]> = {};
  if (siteConfig.verification.google) {
    verification.google = siteConfig.verification.google;
  }
  if (siteConfig.verification.bing) {
    verification.other = { "msvalidate.01": siteConfig.verification.bing };
  }
  return {
    metadataBase: new URL(siteConfig.url),
    applicationName: siteConfig.name,
    title: {
      default: `${siteConfig.name}: ${t("tagline")}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: t("homeDescription"),
    robots: isProductionDeployment
      ? { index: true, follow: true }
      : { index: false, follow: false },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: "/apple-icon.png",
    },
    verification,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("Nav");
  const analyticsId = isProductionDeployment
    ? siteConfig.analytics.googleAnalyticsId
    : "";
  const tc = await getTranslations("Consent");

  return (
    <html
      lang={locale === "zh" ? "zh-Hans" : locale}
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="relative isolate flex min-h-screen flex-col">
        <div aria-hidden="true" className="hero-backdrop" />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-background focus:px-3 focus:py-2"
        >
          {t("skip")}
        </a>
        <NextIntlClientProvider>
          <SiteHeader />
          <main
            id="main"
            className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6"
          >
            {children}
          </main>
          <SiteFooter />
          {analyticsId ? (
            <>
              <GoogleAnalytics
                measurementId={analyticsId}
                storageKey={CONSENT_STORAGE_KEY}
                regionCookie={REGION_COOKIE}
              />
              <ConsentBanner
                message={tc("message")}
                acceptLabel={tc("accept")}
                declineLabel={tc("decline")}
              />
            </>
          ) : null}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
