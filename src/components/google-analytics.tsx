import Script from "next/script";

type Props = {
  measurementId: string;
  storageKey: string;
  regionCookie: string;
};

/**
 * GA4 with Consent Mode v2. Visitors from regions that need consent (EEA, UK,
 * Switzerland, and unknown locations) start denied until they accept. Everyone
 * else is granted by default. A stored decision is applied before the first
 * config call. Google signals and ad personalization stay off.
 */
export function GoogleAnalytics({
  measurementId,
  storageKey,
  regionCookie,
}: Props) {
  const id = JSON.stringify(measurementId);
  const key = JSON.stringify(storageKey);
  const region = JSON.stringify(regionCookie);
  const init = `
window.dataLayer = window.dataLayer || [];
window.gtag = function () { window.dataLayer.push(arguments); };
var stored = null;
try { stored = window.localStorage.getItem(${key}); } catch (e) {}
var open = document.cookie.split("; ").indexOf(${region} + "=open") !== -1;
var state = open || stored === "granted" ? "granted" : "denied";
gtag("consent", "default", {
  analytics_storage: state,
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied"
});
gtag("js", new Date());
gtag("config", ${id}, {
  allow_google_signals: false,
  allow_ad_personalization_signals: false
});
`;
  return (
    <>
      <Script id="ga-init" strategy="afterInteractive">
        {init}
      </Script>
      <Script
        id="ga-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
        strategy="afterInteractive"
      />
    </>
  );
}
