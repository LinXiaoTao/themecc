import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  return (
    <div className="space-y-4 py-16 text-center">
      <h1 className="text-3xl font-bold tracking-tight">{t("heading")}</h1>
      <p className="text-muted-foreground">{t("body")}</p>
      <Link
        href="/"
        className="inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
      >
        {t("home")}
      </Link>
    </div>
  );
}
