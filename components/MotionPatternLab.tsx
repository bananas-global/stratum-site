"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DEFAULT_PATTERN_SCENE_SETTINGS,
  type ThreeSceneSettings,
} from "@/components/ThreeExtrusionScene";

const ThreeExtrusionScene = dynamic(
  () => import("@/components/ThreeExtrusionScene"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 grid place-items-center bg-[#efefed] font-mono text-[10px] uppercase tracking-[0.2em] text-black/35">
        Preparando cena 3D…
      </div>
    ),
  },
);

type SliderKey = Exclude<keyof ThreeSceneSettings, "backgroundColor" | "elementColor">;

const DEFAULTS: ThreeSceneSettings = { ...DEFAULT_PATTERN_SCENE_SETTINGS };

const CONTROL_GROUPS: Array<{
  label: string;
  controls: Array<{
    key: SliderKey;
    label: string;
    min: number;
    max: number;
    step: number;
    unit?: string;
  }>;
}> = [
  {
    label: "Geometria real",
    controls: [
      { key: "scale", label: "Tamanho do pattern", min: 0.25, max: 1, step: 0.01 },
    ],
  },
  {
    label: "Animação aleatória",
    controls: [
      {
        key: "activeAmount",
        label: "Quantidade de elementos",
        min: 0,
        max: 3,
        step: 0.1,
        unit: "×",
      },
      {
        key: "heightMultiplier",
        label: "Altura",
        min: 0.25,
        max: 2.5,
        step: 0.05,
        unit: "×",
      },
      {
        key: "holdMultiplier",
        label: "Tempo no alto",
        min: 0.25,
        max: 3,
        step: 0.05,
        unit: "×",
      },
    ],
  },
  {
    label: "Iluminação",
    controls: [
      {
        key: "lighting",
        label: "Luz ambiente",
        min: 0.25,
        max: 2.5,
        step: 0.05,
        unit: "×",
      },
    ],
  },
  {
    label: "Câmera fixa · top down",
    controls: [
      { key: "fov", label: "Perspectiva · FOV", min: 18, max: 55, step: 1, unit: "°" },
    ],
  },
];

function formatValue(value: number, step: number, unit = "") {
  const decimals = step < 0.01 ? 3 : step < 0.1 ? 2 : step < 1 ? 1 : 0;
  return `${value.toFixed(decimals)}${unit}`;
}

export default function MotionPatternLab() {
  const [values, setValues] = useState<ThreeSceneSettings>(DEFAULTS);
  const [panelOpen, setPanelOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.body.classList.add("pattern-lab-open");
    return () => document.body.classList.remove("pattern-lab-open");
  }, []);

  const update = (key: SliderKey, value: number) => {
    setCopied(false);
    setValues((current) => ({ ...current, [key]: value }));
  };

  const updateColor = (key: "backgroundColor" | "elementColor", value: string) => {
    setCopied(false);
    setValues((current) => ({ ...current, [key]: value }));
  };

  const copyPreset = async () => {
    await navigator.clipboard.writeText(JSON.stringify(values, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-[10000] isolate overflow-hidden bg-[#efefed] text-[#111216]">
      <div className={`absolute inset-y-0 left-0 ${panelOpen ? "right-0 md:right-[420px]" : "right-0"}`}>
        <ThreeExtrusionScene settings={values} />
      </div>

      <div className="pointer-events-none absolute left-5 top-5 z-10 md:left-8 md:top-8">
        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-black/42">
          Stratum · Three.js study
        </p>
        <p className="mt-1 text-xs text-black/38">
          pattern p2 · random lift + hover · render sob demanda
        </p>
      </div>

      {!panelOpen && (
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          className="absolute right-5 top-5 z-30 rounded-sm bg-black px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-2xl transition hover:bg-[#343438] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          Mostrar controles
        </button>
      )}

      {panelOpen && (
        <aside className="absolute bottom-3 right-3 top-3 z-30 flex w-[min(390px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[0.6rem] border border-white/10 bg-[#111216]/96 text-white shadow-[0_30px_100px_rgba(20,20,24,0.3)] backdrop-blur-2xl md:bottom-5 md:right-5 md:top-5">
          <header className="flex items-start justify-between gap-5 border-b border-white/10 px-5 py-5">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/42">
                Stratum · 3D Lab
              </p>
              <h1 className="heading-plain mt-1 font-body text-lg font-medium tracking-[-0.025em] text-white">
                Cena 3D real
              </h1>
              <p className="mt-1 text-xs leading-5 text-white/42">
                Eventos aleatórios com render sob demanda.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              aria-label="Esconder controles"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-sm border border-white/10 text-lg text-white/52 transition hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              ×
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-5">
            <fieldset className="border-b border-white/8 py-4">
              <legend className="mb-3 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
                Cores
              </legend>
              <div className="flex flex-col gap-3">
                <ColorControl
                  label="Plano de fundo"
                  value={values.backgroundColor}
                  onChange={(value) => updateColor("backgroundColor", value)}
                />
                <ColorControl
                  label="Material da peça"
                  value={values.elementColor}
                  onChange={(value) => updateColor("elementColor", value)}
                />
              </div>
            </fieldset>

            {CONTROL_GROUPS.map((group) => (
              <fieldset key={group.label} className="border-b border-white/8 py-4 last:border-0">
                <legend className="mb-3 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  {group.label}
                </legend>
                <div className="flex flex-col gap-4">
                  {group.controls.map((control) => (
                    <SliderControl
                      key={control.key}
                      label={control.label}
                      min={control.min}
                      max={control.max}
                      step={control.step}
                      unit={control.unit}
                      value={values[control.key]}
                      onChange={(value) => update(control.key, value)}
                    />
                  ))}
                </div>
              </fieldset>
            ))}
          </div>

          <footer className="border-t border-white/10 bg-black/20 p-5">
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <button
                type="button"
                onClick={copyPreset}
                className="rounded-sm bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#d9dadd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {copied ? "Preset copiado ✓" : "Copiar preset"}
              </button>
              <button
                type="button"
                onClick={() => setValues(DEFAULTS)}
                className="rounded-sm border border-white/14 px-4 py-3 text-sm text-white/60 transition hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Resetar
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4 text-[11px] text-white/30">
              <Link href="/pattern-generator/lab" className="transition hover:text-white/65">
                Laboratório do encaixe
              </Link>
              <Link href="/pattern-generator" className="transition hover:text-white/65">
                Gerador →
              </Link>
            </div>
          </footer>
        </aside>
      )}
    </div>
  );
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 text-xs text-white/58">
      <span>{label}</span>
      <span className="flex items-center gap-2 rounded-sm bg-white/6 p-1.5 pl-2.5">
        <span className="font-mono text-[10px] uppercase tabular-nums text-white/64">{value}</span>
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
          aria-label={`Cor: ${label}`}
          className="h-7 w-9 cursor-pointer rounded-sm border border-white/15 bg-transparent p-0.5"
        />
      </span>
    </label>
  );
}

function SliderControl({
  label,
  min,
  max,
  step,
  unit,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="group block">
      <span className="mb-2 flex items-center justify-between gap-4 text-xs text-white/58">
        <span className="transition group-hover:text-white/82">{label}</span>
        <output className="min-w-16 rounded-sm bg-white/6 px-2 py-1 text-right font-mono text-[10px] tabular-nums text-white/84">
          {formatValue(value, step, unit)}
        </output>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
        className="motion-lab-range h-5 w-full cursor-ew-resize appearance-none bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      />
    </label>
  );
}
