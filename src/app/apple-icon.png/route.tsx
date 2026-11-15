import { ImageResponse } from "next/og";

export const dynamic = "force-static";

const SIZE = 180;

export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#c4572d",
      }}
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 64 64"
        fill="none"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
      >
        <title>ThemeCC</title>
        <path d="M32 13v38M13 32h38M18.5 18.5l27 27M45.5 18.5l-27 27" />
      </svg>
    </div>,
    { width: SIZE, height: SIZE },
  );
}
