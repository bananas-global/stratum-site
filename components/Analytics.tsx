import Script from "next/script";

/**
 * GA4 — renders nothing until NEXT_PUBLIC_GA4_ID is set (Vercel env var),
 * so local/preview builds stay tag-free. The property feeds the Bananas
 * command-center tenant, which pulls GA4 through the Data API.
 */
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

export default function Analytics() {
  if (!GA4_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA4_ID}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}
