import type { CliThemeFile } from "./schema";

/** Standard xterm palette for the 16 ANSI colors. Used only for the web preview. */
const ANSI_NAMES: Record<string, string> = {
  black: "#000000",
  red: "#cd3131",
  green: "#0dbc79",
  yellow: "#e5e510",
  blue: "#2472c8",
  magenta: "#bc3fbc",
  cyan: "#11a8cd",
  white: "#e5e5e5",
  blackBright: "#666666",
  redBright: "#f14c4c",
  greenBright: "#23d18b",
  yellowBright: "#f5f543",
  blueBright: "#3b8eea",
  magentaBright: "#d670d6",
  cyanBright: "#29b8db",
  whiteBright: "#ffffff",
};

const ANSI_16 = [
  "black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
  "blackBright",
  "redBright",
  "greenBright",
  "yellowBright",
  "blueBright",
  "magentaBright",
  "cyanBright",
  "whiteBright",
] as const;

function hex(value: number): string {
  return value.toString(16).padStart(2, "0");
}

function ansi256ToHex(index: number): string {
  if (index < 16) {
    const name = ANSI_16[index] ?? "white";
    return ANSI_NAMES[name] ?? "#ffffff";
  }
  if (index < 232) {
    const n = index - 16;
    const levels = [0, 95, 135, 175, 215, 255];
    const r = levels[Math.floor(n / 36) % 6] ?? 0;
    const g = levels[Math.floor(n / 6) % 6] ?? 0;
    const b = levels[n % 6] ?? 0;
    return `#${hex(r)}${hex(g)}${hex(b)}`;
  }
  const gray = 8 + (Math.min(index, 255) - 232) * 10;
  return `#${hex(gray)}${hex(gray)}${hex(gray)}`;
}

/** Converts any value allowed in a theme file into a CSS color. */
export function toCssColor(value: string): string {
  if (value.startsWith("ansi:")) {
    return ANSI_NAMES[value.slice(5)] ?? "#808080";
  }
  const ansi256 = /^ansi256\((\d{1,3})\)$/.exec(value);
  if (ansi256) {
    return ansi256ToHex(Number(ansi256[1]));
  }
  return value;
}

export type PreviewTokens = {
  /** Assumed terminal background. Themes cannot change it. */
  background: string;
  text: string;
  claude: string;
  subtle: string;
  success: string;
  error: string;
  warning: string;
  promptBorder: string;
  suggestion: string;
  diffAdded: string;
  diffRemoved: string;
  userMessageBackground: string;
};

const DARK: PreviewTokens = {
  background: "#1e1e1e",
  text: "#e6e6e6",
  claude: "#d77757",
  subtle: "#8a8a8a",
  success: "#4eba65",
  error: "#ff6b80",
  warning: "#ffc107",
  promptBorder: "#888888",
  suggestion: "#b1b9f9",
  diffAdded: "#225c2b",
  diffRemoved: "#7a2936",
  userMessageBackground: "#373737",
};

const LIGHT: PreviewTokens = {
  background: "#ffffff",
  text: "#1a1a1a",
  claude: "#d77757",
  subtle: "#666666",
  success: "#2c7a39",
  error: "#ab2b3f",
  warning: "#966c1e",
  promptBorder: "#999999",
  suggestion: "#5769f7",
  diffAdded: "#69db7c",
  diffRemoved: "#ffa8b4",
  userMessageBackground: "#f0f0f0",
};

const TOKEN_KEYS = [
  "text",
  "claude",
  "subtle",
  "success",
  "error",
  "warning",
  "promptBorder",
  "suggestion",
  "diffAdded",
  "diffRemoved",
  "userMessageBackground",
] as const satisfies readonly (keyof PreviewTokens)[];

/** Approximate colors for a preview. These are estimates, not Claude Code's real base palette. */
export function previewTokens(theme: CliThemeFile): PreviewTokens {
  const fallback = theme.base.startsWith("light") ? LIGHT : DARK;
  const resolved: PreviewTokens = { ...fallback };
  for (const key of TOKEN_KEYS) {
    const value = theme.overrides[key];
    if (value) {
      resolved[key] = toCssColor(value);
    }
  }
  return resolved;
}
