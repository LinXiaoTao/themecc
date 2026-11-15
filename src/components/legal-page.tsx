import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { type LegalSlug, loadLegal } from "@/lib/legal";

type Props = {
  locale: Locale;
  slug: LegalSlug;
};

export async function LegalPage({ locale, slug }: Props) {
  const t = await getTranslations("Guides");
  const { meta, Content } = await loadLegal(locale, slug);
  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{meta.title}</h1>
        <p className="text-sm text-muted-foreground">
          {t("updated", { date: meta.updated })}
        </p>
      </header>
      <div className="prose-content">
        <Content />
      </div>
    </article>
  );
}
