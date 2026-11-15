function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "https://themecc.vercel.app";
}

export const siteConfig = {
  name: "ThemeCC",
  url: resolveSiteUrl(),
  repo: "LinXiaoTao/themecc",
  repoUrl: "https://github.com/LinXiaoTao/themecc",
  reportUrl:
    "https://github.com/LinXiaoTao/themecc/issues/new?template=takedown.yml",
  marketplaceName: "themecc",
  defaultBranch: "main",
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
  },
} as const;

/**
 * True for the production deployment (or a local production build).
 * Preview deployments are noindex and carry no analytics.
 */
export const isProductionDeployment = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";

export const SITE_MIN_VERSIONS = {
  cliCustomTheme: "2.1.118",
  desktopBackdrop: "2.1.319",
  desktopColors: "2.1.324",
} as const;
