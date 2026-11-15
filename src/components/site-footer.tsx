import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { LogoMark } from "./logo-mark";

const linkClass = "transition-colors hover:text-foreground";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const tn = await getTranslations("Nav");
  return (
    <footer className="mt-20 border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-muted-foreground sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="flex items-center gap-2 font-mono text-base font-semibold text-foreground">
            <LogoMark className="size-6" />
            {siteConfig.name}
          </p>
          <p className="max-w-md leading-relaxed">{t("disclaimer")}</p>
        </div>
        <nav aria-label="Explore" className="flex flex-col gap-2">
          <Link href="/desktop" className={linkClass}>
            {tn("desktop")}
          </Link>
          <Link href="/cli" className={linkClass}>
            {tn("cli")}
          </Link>
          <Link href="/guides" className={linkClass}>
            {tn("guides")}
          </Link>
          <Link href="/submit" className={linkClass}>
            {tn("submit")}
          </Link>
        </nav>
        <nav aria-label="Footer" className="flex flex-col gap-2">
          <Link href="/privacy" className={linkClass}>
            {t("privacy")}
          </Link>
          <Link href="/terms" className={linkClass}>
            {t("terms")}
          </Link>
          <a href={siteConfig.reportUrl} rel="noopener" className={linkClass}>
            {t("issues")}
          </a>
          <a href={siteConfig.repoUrl} rel="noopener" className={linkClass}>
            {t("source")}
          </a>
        </nav>
      </div>
    </footer>
  );
}
