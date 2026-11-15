import { previewTokens } from "@/lib/registry/preview-colors";
import type { CliThemeFile } from "@/lib/registry/schema";

type Props = {
  theme: CliThemeFile;
  label: string;
  compact?: boolean;
};

/** A static mock of a Claude Code session, colored from the theme's values. */
export function TerminalPreview({ theme, label, compact = false }: Props) {
  const c = previewTokens(theme);
  return (
    <div
      role="img"
      aria-label={label}
      aria-hidden={label === "" ? true : undefined}
      className="overflow-hidden rounded-lg border border-border font-mono text-[12px] leading-[1.55] sm:text-[13px]"
      style={{ background: c.background, color: c.text }}
    >
      <div className="space-y-1 px-3 py-3 sm:px-4">
        <div style={{ color: c.claude }}>
          ✻ Claude Code <span style={{ color: c.inactive }}>v2.1</span>
        </div>
        <div
          className="rounded px-2 py-1"
          style={{ background: c.userMessageBackground }}
        >
          &gt; Add input validation
        </div>
        <div>
          <span style={{ color: c.claude }}>●</span> I&apos;ll read the form
          first.
        </div>
        <div style={{ color: c.inactive }}>
          &nbsp;&nbsp;⎿ Read signup.tsx (84 lines)
        </div>
        {compact ? null : (
          <>
            <div>
              <span style={{ color: c.success }}>●</span> Update(signup.tsx)
            </div>
            <div style={{ background: c.diffRemoved }} className="px-2">
              - const email = form.email;
            </div>
            <div style={{ background: c.diffAdded }} className="px-2">
              + const email = parse(form.email);
            </div>
            <div>
              <span style={{ color: c.error }}>✗</span> 1 test failed{" "}
              <span style={{ color: c.warning }}>(retrying)</span>
            </div>
            <div>
              <span style={{ color: c.success }}>✓</span> 12 tests passed
            </div>
          </>
        )}
        <div
          className="rounded border px-2 py-1"
          style={{ borderColor: c.promptBorder }}
        >
          <span style={{ color: c.text }}>&gt; </span>
          <span style={{ color: c.suggestion }}>/theme</span>
        </div>
      </div>
    </div>
  );
}
