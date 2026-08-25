"use client";

import dynamic from "next/dynamic";
import { DEFAULT_PATTERN_SCENE_SETTINGS } from "@/components/ThreeExtrusionScene";

const ThreeExtrusionScene = dynamic(
  () => import("@/components/ThreeExtrusionScene"),
  { ssr: false },
);

export default function HeroPatternBackground() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <ThreeExtrusionScene
        settings={DEFAULT_PATTERN_SCENE_SETTINGS}
        interactive={false}
      />
    </div>
  );
}
