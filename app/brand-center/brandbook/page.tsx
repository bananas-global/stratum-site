import type { Metadata } from "next";
import BrandbookDeck from "@/components/brandbook/BrandbookDeck";

// Hidden internal tool, same as the rest of Brand Center — not part of
// the public IA, out of search and the sitemap. Reachable by direct link.
export const metadata: Metadata = {
  title: "Brandbook",
  description:
    "The Stratum brand guidelines as a presentation — positioning, logo, colour, typography, voice and imagery.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function BrandbookPage() {
  return <BrandbookDeck />;
}
