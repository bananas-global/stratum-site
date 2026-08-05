import Script from "next/script";

/**
 * HubSpot tracking script ("the pixel") — portal 343209171, region na3.
 *
 * This is the only HubSpot wiring the site needs. There is no HubSpot API key
 * or connected app involved: HubSpot API keys were sunset in 2022, and the site
 * never writes to HubSpot. It loads page-view tracking, sets HubSpot's cookies,
 * and is the prerequisite for two things:
 *   1. the embedded form on /contact (see HubSpotForm.tsx)
 *   2. HubSpot CTAs — add `hs-cta-trigger-button hs-cta-trigger-button-<id>`
 *      to any of our own buttons and this script hijacks the click. The classes
 *      are inert without it. Not wired to any button yet.
 */
export const HUBSPOT_PORTAL_ID = "343209171";
export const HUBSPOT_REGION = "na3";

export default function HubSpotTracking() {
  return (
    <Script
      id="hs-script-loader"
      src={`//js-${HUBSPOT_REGION}.hs-scripts.com/${HUBSPOT_PORTAL_ID}.js`}
      strategy="afterInteractive"
    />
  );
}
