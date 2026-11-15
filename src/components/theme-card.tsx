import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { previewTokens } from "@/lib/registry/preview-colors";
import type { ThemeSummary } from "@/lib/registry/summary";
import { pickText } from "@/lib/registry/text";
import { TerminalPreview } from "./terminal-preview";

type Props = {
  theme: ThemeSummary;
  priority?: boolean;
};

const chipClass =
  "rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs text-muted-foreground";

export function ThemeCard({ theme, priority = false }: Props) {
  const t = useTranslations("List");
  const tt = useTranslations("Theme");
  const locale = useLocale();
  const description = pickText(theme.description, locale);
  const schemeLabel =
    theme.colorScheme.length === 2
      ? t("lightDark")
      : theme.colorScheme[0] === "light"
        ? t("light")
        : t("dark");
  const swatches = theme.cliTheme
    ? (() => {
        const c = previewTokens(theme.cliTheme);
        return [
          { key: "claude", color: c.claude },
          { key: "suggestion", color: c.suggestion },
          { key: "success", color: c.success },
          { key: "warning", color: c.warning },
          { key: "error", color: c.error },
        ];
      })()
    : [];

  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:border-foreground/25 hover:shadow-card-hover">
      <div className="relative overflow-hidden">
        {theme.type === "desktop" && theme.poster ? (
          <Image
            src={theme.poster}
            alt=""
            width={640}
            height={360}
            priority={priority}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : theme.cliTheme ? (
          <div className="bg-muted/60 p-3">
            <TerminalPreview theme={theme.cliTheme} label="" compact />
          </div>
        ) : null}
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          {theme.type === "desktop" ? tt("typeDesktop") : tt("typeCli")}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold leading-tight">
            <Link
              href={`/themes/${theme.slug}`}
              className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label={t("viewTheme", { name: theme.name })}
            >
              {theme.name}
            </Link>
          </h3>
          {swatches.length > 0 ? (
            <span aria-hidden="true" className="flex shrink-0 -space-x-1">
              {swatches.map(({ key, color }) => (
                <span
                  key={key}
                  className="size-3.5 rounded-full border border-card"
                  style={{ background: color }}
                />
              ))}
            </span>
          ) : null}
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
          <li className={chipClass}>{schemeLabel}</li>
          {theme.type === "desktop" ? (
            <li className={chipClass}>
              {theme.motion ? t("animated") : t("still")}
            </li>
          ) : null}
          {theme.minClaudeCode ? (
            <li className={chipClass}>
              {t("requires", { version: theme.minClaudeCode })}
            </li>
          ) : null}
        </ul>
      </div>
    </article>
  );
}
