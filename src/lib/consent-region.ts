/** Visitors from these countries must opt in before analytics storage is used. */
const CONSENT_COUNTRIES: ReadonlySet<string> = new Set([
  // EU
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  // EEA, UK, Switzerland
  "IS",
  "LI",
  "NO",
  "GB",
  "CH",
]);

/** Session cookie set by the proxy. It holds `consent` or `open`, nothing else. */
export const REGION_COOKIE = "themecc-region";

export type RegionMode = "consent" | "open";

/** A missing country (local development, unknown IP) is treated as requiring consent. */
export function regionModeFor(country: string | null): RegionMode {
  if (country && !CONSENT_COUNTRIES.has(country.toUpperCase())) {
    return "open";
  }
  return "consent";
}
