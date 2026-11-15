import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ThemeSummary } from "@/lib/registry/summary";
import { pickText } from "@/lib/registry/text";
import { TerminalPreview } from "./terminal-preview";

type Props = {
  theme: ThemeSummary;
  priority?: boolean;
};

export function ThemeCard({ theme, priority = false }: Props) {
  const t = useTranslations("List");
  const locale = useLocale();
  const description = pickText(theme.description, locale);
  const schemeLabel =
    theme.colorScheme.length === 2
      ? t("lightDark")
      : theme.colorScheme[0] === "light"
        ? t("light")
        : t("dark");

  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-foreground/40">
      {theme.type === "desktop" && theme.poster ? (
        <Image
          src={theme.poster}
          alt=""
          width={640}
          height={360}
          priority={priority}
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
          className="aspect-video w-full object-cover"
        />
      ) : theme.cliTheme ? (
        <div className="p-3 pb-0">
          <TerminalPreview theme={theme.cliTheme} label="" compact />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold leading-tight">
          <Link
            href={`/themes/${theme.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label={t("viewTheme", { name: theme.name })}
          >
            {theme.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {description}
        </p>
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-1 text-xs">
          <li className="rounded-full border border-border px-2 py-0.5">
            {schemeLabel}
          </li>
          {theme.type === "desktop" ? (
            <li className="rounded-full border border-border px-2 py-0.5">
              {theme.motion ? t("animated") : t("still")}
            </li>
          ) : null}
          {theme.minClaudeCode ? (
            <li className="rounded-full border border-border px-2 py-0.5">
              {t("requires", { version: theme.minClaudeCode })}
            </li>
          ) : null}
        </ul>
      </div>
    </article>
  );
}
