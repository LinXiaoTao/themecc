export type Rgb = { r: number; g: number; b: number };

const HEX3 = /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/;
const HEX6 = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/;
const RGB_FN = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;

function clampByte(value: number): number {
  return Math.min(255, Math.max(0, value));
}

/** Returns null for ansi values because their color depends on the terminal. */
export function parseColor(value: string): Rgb | null {
  const hex3 = HEX3.exec(value);
  if (hex3) {
    return {
      r: Number.parseInt(`${hex3[1]}${hex3[1]}`, 16),
      g: Number.parseInt(`${hex3[2]}${hex3[2]}`, 16),
      b: Number.parseInt(`${hex3[3]}${hex3[3]}`, 16),
    };
  }
  const hex6 = HEX6.exec(value);
  if (hex6) {
    return {
      r: Number.parseInt(hex6[1] ?? "0", 16),
      g: Number.parseInt(hex6[2] ?? "0", 16),
      b: Number.parseInt(hex6[3] ?? "0", 16),
    };
  }
  const fn = RGB_FN.exec(value);
  if (fn) {
    return {
      r: clampByte(Number(fn[1])),
      g: clampByte(Number(fn[2])),
      b: clampByte(Number(fn[3])),
    };
  }
  return null;
}

function channel(value: number): number {
  const s = value / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(color: Rgb): number {
  return (
    0.2126 * channel(color.r) +
    0.7152 * channel(color.g) +
    0.0722 * channel(color.b)
  );
}

/** WCAG 2.x contrast ratio, from 1 to 21. */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

export type ContrastLevel = "aaa" | "aa" | "aa-large" | "fail";

export function contrastLevel(ratio: number): ContrastLevel {
  if (ratio >= 7) {
    return "aaa";
  }
  if (ratio >= 4.5) {
    return "aa";
  }
  if (ratio >= 3) {
    return "aa-large";
  }
  return "fail";
}

export const ASSUMED_BACKGROUNDS = {
  dark: "#1e1e1e",
  light: "#ffffff",
} as const;

export function assumedBackground(base: string): Rgb {
  const hex = base.startsWith("light")
    ? ASSUMED_BACKGROUNDS.light
    : ASSUMED_BACKGROUNDS.dark;
  return parseColor(hex) ?? { r: 0, g: 0, b: 0 };
}

const BACKGROUND_TOKEN = /(Background|BackgroundColor|BackgroundHover|Bg)$/;

/**
 * Whether a token is drawn as text on the terminal background.
 * Background and diff tokens are excluded because contrast against the
 * terminal background does not describe how they are used.
 */
export function isForegroundToken(name: string): boolean {
  if (BACKGROUND_TOKEN.test(name)) {
    return false;
  }
  if (name.startsWith("diff") || name.startsWith("rate_limit")) {
    return false;
  }
  return true;
}
