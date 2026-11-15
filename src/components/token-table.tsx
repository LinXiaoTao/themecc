import { useTranslations } from "next-intl";
import {
  assumedBackground,
  contrastLevel,
  contrastRatio,
  isForegroundToken,
  parseColor,
} from "@/lib/registry/contrast";
import { toCssColor } from "@/lib/registry/preview-colors";
import type { CliThemeFile } from "@/lib/registry/schema";

type Props = {
  theme: CliThemeFile;
};

export function TokenTable({ theme }: Props) {
  const t = useTranslations("Theme");
  const background = assumedBackground(theme.base);
  const backgroundLabel = theme.base.startsWith("light")
    ? "#ffffff"
    : "#1e1e1e";
  const rows = Object.entries(theme.overrides).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return (
    <section aria-labelledby="tokens-heading" className="space-y-3">
      <h2 id="tokens-heading" className="text-xl font-semibold">
        {t("tokensHeading")}
      </h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th scope="col" className="px-3 py-2 font-medium">
                {t("tokenName")}
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                {t("tokenValue")}
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                {t("tokenContrast")}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, value]) => {
              const rgb = parseColor(value);
              const ratio =
                rgb && isForegroundToken(name)
                  ? contrastRatio(rgb, background)
                  : null;
              return (
                <tr key={name} className="border-t border-border">
                  <th
                    scope="row"
                    className="px-3 py-2 text-left font-mono font-normal"
                  >
                    {name}
                  </th>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-2 font-mono">
                      <span
                        aria-hidden="true"
                        className="inline-block size-4 rounded border border-border"
                        style={{ background: toCssColor(value) }}
                      />
                      {value}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono">
                    {ratio === null
                      ? "–"
                      : `${ratio.toFixed(1)}:1 ${contrastLevel(ratio).toUpperCase()}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        {t("contrastNote", { background: backgroundLabel })}
      </p>
    </section>
  );
}
