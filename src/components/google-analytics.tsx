import Script from "next/script";

type Props = {
  measurementId: string;
  storageKey: string;
};

/**
 * GA4 with Consent Mode v2. Storage is denied until the visitor accepts.
 * A stored decision is applied before the first config call.
 */
export function GoogleAnalytics({ measurementId, storageKey }: Props) {
  const id = JSON.stringify(measurementId);
  const key = JSON.stringify(storageKey);
  const init = `
window.dataLayer = window.dataLayer || [];
window.gtag = function () { window.dataLayer.push(arguments); };
var stored = null;
try { stored = window.localStorage.getItem(${key}); } catch (e) {}
var state = stored === "granted" ? "granted" : "denied";
gtag("consent", "default", {
  analytics_storage: state,
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied"
});
gtag("js", new Date());
gtag("config", ${id});
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
