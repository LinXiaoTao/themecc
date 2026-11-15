import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8 text-sm text-muted-foreground">
        <p>{t("disclaimer")}</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/privacy" className="hover:text-foreground">
            {t("privacy")}
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            {t("terms")}
          </Link>
          <a
            href={siteConfig.issuesUrl}
            rel="noopener"
            className="hover:text-foreground"
          >
            {t("issues")}
          </a>
          <a
            href={siteConfig.repoUrl}
            rel="noopener"
            className="hover:text-foreground"
          >
            {t("source")}
          </a>
        </nav>
      </div>
    </footer>
  );
}
