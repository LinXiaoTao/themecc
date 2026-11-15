import { ImageResponse } from "next/og";

export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

const SWATCHES = [
  "#88c0d0",
  "#a6e3a1",
  "#f9e2af",
  "#f38ba8",
  "#cba6f7",
  "#fab387",
];

export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#14151a",
        color: "#f5f5f7",
      }}
    >
      <div style={{ display: "flex", gap: 16 }}>
        {SWATCHES.map((color) => (
          <div
            key={color}
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: color,
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 108, fontWeight: 700, letterSpacing: -2 }}>
          ThemeCC
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 44,
            color: "#b4b7c2",
            lineHeight: 1.25,
          }}
        >
          <div>Claude Code themes with previews.</div>
          <div>Install any of them with one command.</div>
        </div>
      </div>
      <div style={{ fontSize: 30, color: "#8a8fa0" }}>
        Desktop and CLI. Open registry on GitHub.
      </div>
    </div>,
    { ...size },
  );
}
