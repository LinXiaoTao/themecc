import type { ComponentType } from "react";
import { z } from "zod";
import type { Locale } from "@/i18n/routing";

export const LEGAL_SLUGS = ["privacy", "terms"] as const;

export type LegalSlug = (typeof LEGAL_SLUGS)[number];

const legalMetaSchema = z.object({
  title: z.string().min(2).max(80),
  description: z.string().min(40).max(200),
  updated: z.iso.date(),
});

export type LegalDocument = {
  slug: LegalSlug;
  meta: z.infer<typeof legalMetaSchema>;
  Content: ComponentType;
};

export async function loadLegal(
  locale: Locale,
  slug: LegalSlug,
): Promise<LegalDocument> {
  const mod = await import(`../../content/legal/${locale}/${slug}.mdx`);
  const meta = legalMetaSchema.parse("meta" in mod ? mod.meta : undefined);
  return { slug, meta, Content: mod.default };
}
