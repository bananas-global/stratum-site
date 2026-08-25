import type { Metadata } from "next";
import MotionPatternLab from "@/components/MotionPatternLab";

export const metadata: Metadata = {
  title: "Three.js Extrusion Lab | Stratum (internal)",
  description: "Internal Three.js tool for testing real extrusion, perspective, lighting, and shadows.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function MotionPatternLabPage() {
  return <MotionPatternLab />;
}
