import { useLocale, useTranslations } from "next-intl";
import {
  cliFileInstallCommand,
  installPlan,
  pluginNameFor,
} from "@/lib/registry/install";
import type { Theme } from "@/lib/registry/schema";
import { pickText } from "@/lib/registry/text";
import { CopyCommand } from "./copy-command";

type Props = {
  theme: Theme;
};

export function InstallBlock({ theme }: Props) {
  const t = useTranslations("Theme");
  const locale = useLocale();
  const plan = installPlan(theme);
  const copyLabel = t("copy");
  const copiedLabel = t("copied");
  const type = theme.type;

  return (
    <section
      aria-labelledby="install-heading"
      className="space-y-5 self-start rounded-2xl border border-border bg-card p-6 shadow-card"
    >
      <h2 id="install-heading" className="text-xl font-semibold">
        {t("install")}
      </h2>
      <div className="space-y-2">
        <p className="text-sm font-medium">{t("stepAdd")}</p>
        <CopyCommand
          command={plan.addMarketplace}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
          event={{
            name: "copy_marketplace_add",
            params: { placement: "detail" },
          }}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">{t("stepInstall")}</p>
        <CopyCommand
          command={plan.install}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
          event={{
            name: "copy_install",
            params: { slug: theme.slug, type, method: "marketplace" },
          }}
        />
        <p className="text-xs text-muted-foreground">{pluginNameFor(theme)}</p>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{t("stepActivate")}</p>
        <p className="text-sm text-muted-foreground">
          {theme.type === "desktop"
            ? theme.usage
              ? pickText(theme.usage, locale)
              : t("activateDesktop")
            : t("activateCli", { name: theme.name })}
        </p>
      </div>
      {theme.type === "cli" ? (
        <details className="rounded-xl border border-border bg-muted/40 p-4">
          <summary className="cursor-pointer text-sm font-medium">
            {t("singleFileHeading")}
          </summary>
          <div className="mt-3 space-y-3">
            <p className="text-sm text-muted-foreground">
              {t("singleFileBody")}
            </p>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{t("posix")}</p>
              <CopyCommand
                command={cliFileInstallCommand(theme.slug, "posix")}
                copyLabel={copyLabel}
                copiedLabel={copiedLabel}
                event={{
                  name: "copy_install",
                  params: { slug: theme.slug, type, method: "file" },
                }}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{t("powershell")}</p>
              <CopyCommand
                command={cliFileInstallCommand(theme.slug, "powershell")}
                copyLabel={copyLabel}
                copiedLabel={copiedLabel}
                event={{
                  name: "copy_install",
                  params: { slug: theme.slug, type, method: "file" },
                }}
              />
            </div>
          </div>
        </details>
      ) : null}
    </section>
  );
}
