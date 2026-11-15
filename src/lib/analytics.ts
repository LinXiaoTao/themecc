export type AnalyticsEvent =
  | {
      name: "copy_install";
      params: { slug: string; type: string; method: "marketplace" | "file" };
    }
  | { name: "copy_marketplace_add"; params: { placement: string } }
  | { name: "preview_play"; params: { slug: string } }
  | { name: "outbound_repo_click"; params: { slug: string } }
  | { name: "submit_click"; params: { placement: string } }
  | { name: "filter_use"; params: { filter: string; value: string } };

export type ConsentDecision = "granted" | "denied";

export const CONSENT_STORAGE_KEY = "themecc-consent";

type Gtag = {
  (command: "event", name: string, params: Record<string, string>): void;
  (
    command: "consent",
    action: "default" | "update",
    params: Record<string, string>,
  ): void;
};

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }
  window.gtag("event", event.name, event.params);
}

export function updateAnalyticsConsent(decision: ConsentDecision): void {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }
  window.gtag("consent", "update", { analytics_storage: decision });
}
