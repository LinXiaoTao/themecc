export type LocalizedText = { en: string; zh?: string | undefined };

export function pickText(text: LocalizedText, locale: string): string {
  if (locale === "zh" && text.zh) {
    return text.zh;
  }
  return text.en;
}

export function previewPath(slug: string, file: string): string {
  return `/previews/${slug}/${file}`;
}
