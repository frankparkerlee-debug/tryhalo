/**
 * Google Analytics 4 loader.
 *
 * Reads NEXT_PUBLIC_GA_MEASUREMENT_ID from env. If unset/empty, renders
 * nothing and the app runs without analytics — no crashes, no errors.
 *
 * When the env var is set (e.g., "G-XXXXXXXXXX"), this loads gtag.js
 * and configures the data layer so track() can send events via gtag().
 */

import Script from "next/script";

export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Silently render nothing when not configured
  if (!measurementId) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){ dataLayer.push(arguments); }
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            send_page_view: true,
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}
