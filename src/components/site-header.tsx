import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { GithubIcon } from "./icons";
import { LocaleSwitcher } from "./locale-switcher";
import { LogoMark } from "./logo-mark";
import { NavLinks } from "./nav-links";

export async function SiteHeader() {
  const t = await getTranslations("Nav");
  const links = [
    { href: "/desktop", label: t("desktop") },
    { href: "/cli", label: t("cli") },
    { href: "/guides", label: t("guides") },
    { href: "/submit", label: t("submit") },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 sm:px-6">
        <Link
          href="/"
          aria-label={t("home")}
          className="order-1 flex items-center gap-2 font-mono text-lg font-semibold tracking-tight"
        >
          <LogoMark className="size-7" />
          {siteConfig.name}
        </Link>
        <nav
          aria-label="Main"
          className="order-3 -mx-1 flex w-full items-center gap-1 overflow-x-auto px-1 text-sm md:order-2 md:mx-0 md:w-auto md:flex-1 md:overflow-visible md:px-0"
        >
          <NavLinks items={links} />
        </nav>
        <div className="order-2 ml-auto flex items-center gap-2 md:order-3">
          <a
            href={siteConfig.repoUrl}
            rel="noopener"
            aria-label={t("github")}
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <GithubIcon className="size-5" />
          </a>
          <LocaleSwitcher label={t("language")} />
        </div>
      </div>
    </header>
  );
}
