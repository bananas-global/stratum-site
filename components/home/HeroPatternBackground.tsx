"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const PATTERN_SCENE_SETTINGS = {
  scale: 0.5,
  fov: 55,
  activeAmount: 2,
  heightMultiplier: 2.3,
  holdMultiplier: 3,
  lighting: 2.5,
  backgroundColor: "#c2c2c2",
  elementColor: "#ffffff",
};

const ThreeExtrusionScene = dynamic(
  () => import("@/components/ThreeExtrusionScene"),
  { ssr: false },
);

export default function HeroPatternBackground() {
  const [renderScene, setRenderScene] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    if (!desktop.matches) return;

    let cancelled = false;
    const start = () => {
      if (!cancelled) setRenderScene(true);
    };
    const idleId = window.requestIdleCallback?.(start, { timeout: 1200 });
    const timeoutId = idleId === undefined ? window.setTimeout(start, 800) : undefined;

    return () => {
      cancelled = true;
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0 bg-[#c2c2c2]" />
      {renderScene ? (
        <ThreeExtrusionScene
          settings={PATTERN_SCENE_SETTINGS}
          interactive={false}
          coverViewport
        />
      ) : null}
    </div>
  );
}
