type Props = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: Props) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is serialized from trusted data with "<" escaped.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
