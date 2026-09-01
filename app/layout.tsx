import type { Metadata, Viewport } from "next";
import { Manrope, Lora } from "next/font/google";
import "./globals.css";
import { SITE, orgGraph, websiteGraph, jsonLd } from "@/lib/site";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import FeedbackCollector from "@/components/FeedbackCollector";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: "Stratum | Managed IT & Cybersecurity for Growing Businesses",
    template: "%s | Stratum",
  },
  description:
    "Stratum is a technology company for growing organizations — structured service across support, continuity, and the systems that move your business forward.",
  applicationName: "Stratum",
  authors: [{ name: "Stratum Technology" }],
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } as Metadata["robots"],
  verification: { google: "r49hyXaJPQwrq0qObnFBp0LgTid1t_-VH5eT50NISbk" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Stratum",
    locale: "en_CA",
    url: SITE.domain,
    images: [{ url: "/og-image.jpg", alt: "Stratum — Managed IT & Cybersecurity" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-image.jpg"] },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/images/webclip.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0f0f",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-CA"
      className={`${manrope.variable} ${lora.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('reveal-ready');
setTimeout(function () {
  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}, 3000);`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd([orgGraph, websiteGraph])}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:border focus:border-line focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:text-ink-bright"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
        <VercelAnalytics />
        {process.env.NODE_ENV === "development" && process.env.HIDE_DEV_WIDGETS !== "1" && (
          <FeedbackCollector />
        )}
      </body>
    </html>
  );
}
