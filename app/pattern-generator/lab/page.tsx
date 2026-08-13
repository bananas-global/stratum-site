import type { Metadata } from "next";
import PatternLab from "@/components/PatternLab";

export const metadata: Metadata = {
  title: "Pattern Lab | Stratum (internal)",
  description: "Internal calibration tool for the Stratum icon pattern.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function PatternLabPage() {
  return <PatternLab />;
}
