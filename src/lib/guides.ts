import type { ComponentType } from "react";
import { z } from "zod";
import type { Locale } from "@/i18n/routing";

export const GUIDE_SLUGS = [
  "install-themes",
  "desktop-themes",
  "cli-theme-json",
  "mod-security",
] as const;

export type GuideSlug = (typeof GUIDE_SLUGS)[number];

const guideMetaSchema = z.object({
  title: z.string().min(10).max(80),
  description: z.string().min(40).max(200),
  updated: z.iso.date(),
});

export type GuideMeta = z.infer<typeof guideMetaSchema>;

export type Guide = {
  slug: GuideSlug;
  meta: GuideMeta;
  Content: ComponentType;
};

export function isGuideSlug(value: string): value is GuideSlug {
  return (GUIDE_SLUGS as readonly string[]).includes(value);
}

export async function loadGuide(
  locale: Locale,
  slug: GuideSlug,
): Promise<Guide> {
  const mod = await import(`../../content/guides/${locale}/${slug}.mdx`);
  const meta = guideMetaSchema.parse("meta" in mod ? mod.meta : undefined);
  return { slug, meta, Content: mod.default };
}

export async function loadGuides(locale: Locale): Promise<Guide[]> {
  return Promise.all(GUIDE_SLUGS.map((slug) => loadGuide(locale, slug)));
}
