import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";

export async function SiteHeader() {
  const t = await getTranslations("Nav");
  const links = [
    { href: "/desktop", label: t("desktop") },
    { href: "/cli", label: t("cli") },
    { href: "/guides", label: t("guides") },
    { href: "/submit", label: t("submit") },
  ] as const;

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link
          href="/"
          aria-label={t("home")}
          className="font-mono text-lg font-semibold tracking-tight"
        >
          {siteConfig.name}
        </Link>
        <nav
          aria-label="Main"
          className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1 text-sm"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-1 text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={siteConfig.repoUrl}
            className="py-1 text-muted-foreground hover:text-foreground"
            rel="noopener"
          >
            {t("github")}
          </a>
        </nav>
        <LocaleSwitcher label={t("language")} />
      </div>
    </header>
  );
}
