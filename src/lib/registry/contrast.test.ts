import { describe, expect, it } from "vitest";
import {
  assumedBackground,
  contrastLevel,
  contrastRatio,
  isForegroundToken,
  parseColor,
} from "./contrast";

describe("parseColor", () => {
  it("parses 3 and 6 digit hex", () => {
    expect(parseColor("#fff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseColor("#1e1e1e")).toEqual({ r: 30, g: 30, b: 30 });
  });

  it("parses rgb()", () => {
    expect(parseColor("rgb(10, 20, 30)")).toEqual({ r: 10, g: 20, b: 30 });
  });

  it("returns null for terminal dependent colors", () => {
    expect(parseColor("ansi:red")).toBeNull();
    expect(parseColor("ansi256(12)")).toBeNull();
  });
});

describe("contrastRatio", () => {
  it("is 21 for black on white", () => {
    const black = parseColor("#000000");
    const white = parseColor("#ffffff");
    if (!black || !white) {
      throw new Error("colors must parse");
    }
    expect(contrastRatio(black, white)).toBeCloseTo(21, 5);
  });

  it("is 1 for identical colors", () => {
    const color = parseColor("#336699");
    if (!color) {
      throw new Error("color must parse");
    }
    expect(contrastRatio(color, color)).toBeCloseTo(1, 5);
  });
});

describe("contrastLevel", () => {
  it("maps ratios to WCAG levels", () => {
    expect(contrastLevel(8)).toBe("aaa");
    expect(contrastLevel(5)).toBe("aa");
    expect(contrastLevel(3.2)).toBe("aa-large");
    expect(contrastLevel(2)).toBe("fail");
  });
});

describe("assumedBackground", () => {
  it("uses a dark background for dark bases and a light one for light bases", () => {
    expect(assumedBackground("dark-ansi")).toEqual({ r: 30, g: 30, b: 30 });
    expect(assumedBackground("light")).toEqual({ r: 255, g: 255, b: 255 });
  });
});

describe("isForegroundToken", () => {
  it("treats accent and status tokens as text", () => {
    for (const name of [
      "claude",
      "text",
      "error",
      "success",
      "promptBorder",
      "suggestion",
    ]) {
      expect(isForegroundToken(name)).toBe(true);
    }
  });

  it("excludes background, diff, and meter tokens", () => {
    for (const name of [
      "userMessageBackground",
      "bashMessageBackgroundColor",
      "userMessageBackgroundHover",
      "selectionBg",
      "diffAdded",
      "diffRemovedWord",
      "rate_limit_fill",
    ]) {
      expect(isForegroundToken(name)).toBe(false);
    }
  });
});
