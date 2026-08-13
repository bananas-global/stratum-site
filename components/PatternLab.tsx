"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_PATTERN_LAYOUT,
  IconPattern,
  type PatternLayout,
} from "@/components/IconPattern";

type LabValues = PatternLayout & { scale: number };

const DEFAULTS: LabValues = {
  scale: 0.445,
  ...DEFAULT_PATTERN_LAYOUT,
};

type SliderKey = keyof LabValues;

const GROUPS: Array<{
  label: string;
  controls: Array<{
    key: SliderKey;
    label: string;
    min: number;
    max: number;
    step: number;
  }>;
}> = [
  {
    label: "Tamanho",
    controls: [{ key: "scale", label: "Escala", min: 0, max: 1, step: 0.005 }],
  },
  {
    label: "Escala do SVG",
    controls: [
      { key: "iconScale", label: "Escala interna", min: 0.5, max: 1, step: 0.001 },
    ],
  },
  {
    label: "Centro da rotação 180°",
    controls: [
      { key: "rotationX", label: "Rotação X", min: 200, max: 450, step: 0.1 },
      { key: "rotationY", label: "Rotação Y", min: 100, max: 300, step: 0.1 },
    ],
  },
  {
    label: "Vetor U",
    controls: [
      { key: "uX", label: "U · horizontal", min: 350, max: 650, step: 0.1 },
      { key: "uY", label: "U · vertical", min: -50, max: 200, step: 0.1 },
    ],
  },
  {
    label: "Vetor V",
    controls: [
      { key: "vX", label: "V · horizontal", min: -100, max: 250, step: 0.1 },
      { key: "vY", label: "V · vertical", min: -500, max: -200, step: 0.1 },
    ],
  },
];

export default function PatternLab() {
  const [values, setValues] = useState<LabValues>(DEFAULTS);
  const [panelOpen, setPanelOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [viewport, setViewport] = useState({ width: 1, height: 1 });

  useEffect(() => {
    const measure = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    document.body.classList.add("pattern-lab-open");
    measure();
    window.addEventListener("resize", measure);

    return () => {
      document.body.classList.remove("pattern-lab-open");
      window.removeEventListener("resize", measure);
    };
  }, []);

  const layout = useMemo<PatternLayout>(
    () => ({
      iconScale: values.iconScale,
      rotationX: values.rotationX,
      rotationY: values.rotationY,
      uX: values.uX,
      uY: values.uY,
      vX: values.vX,
      vY: values.vY,
    }),
    [values],
  );

  const output = useMemo(() => JSON.stringify(values, null, 2), [values]);

  const update = (key: SliderKey, value: number) => {
    setCopied(false);
    setValues((current) => ({ ...current, [key]: value }));
  };

  const copyValues = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[10000] isolate overflow-hidden bg-[#0d0f10]">
      <div className="absolute inset-0">
        <IconPattern
          width={viewport.width}
          height={viewport.height}
          scale={values.scale}
          color="#60727A"
          bgFrom="#151718"
          bgTo="#090A0B"
          layout={layout}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 border border-white/10"
      />

      {!panelOpen && (
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          className="absolute right-5 top-5 rounded-sm border border-white/15 bg-black/80 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-white shadow-2xl backdrop-blur-xl transition hover:border-white/30 hover:bg-black"
        >
          Mostrar controles
        </button>
      )}

      {panelOpen && (
        <aside className="absolute bottom-4 right-4 top-4 flex w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-white/15 bg-[#0b0c0d]/95 shadow-[0_30px_100px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
          <header className="flex items-start justify-between gap-5 border-b border-white/10 px-5 py-5">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8d9ba1]">
                Pattern Lab
              </p>
              <h1 className="mt-1 font-body text-lg font-medium tracking-[-0.02em] text-white">
                Ajuste o encaixe
              </h1>
              <p className="mt-1 text-xs leading-5 text-white/45">
                Use as setas do teclado para ajustes finos.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              aria-label="Esconder controles"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-sm border border-white/10 text-lg text-white/55 transition hover:border-white/25 hover:text-white"
            >
              ×
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-1">
            {GROUPS.map((group) => (
              <fieldset key={group.label} className="border-b border-white/8 py-4 last:border-0">
                <legend className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
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
                      value={values[control.key]}
                      onChange={(value) => update(control.key, value)}
                    />
                  ))}
                </div>
              </fieldset>
            ))}
          </div>

          <footer className="border-t border-white/10 bg-black/30 p-5">
            <pre className="mb-4 max-h-28 overflow-auto rounded-sm border border-white/8 bg-black/35 p-3 font-mono text-[10px] leading-4 text-white/45">
              {output}
            </pre>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <button
                type="button"
                onClick={copyValues}
                className="rounded-sm bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#b8c5ca] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {copied ? "Valores copiados ✓" : "Copiar valores"}
              </button>
              <button
                type="button"
                onClick={() => setValues(DEFAULTS)}
                className="rounded-sm border border-white/15 px-4 py-3 text-sm text-white/65 transition hover:border-white/30 hover:text-white"
              >
                Resetar
              </button>
            </div>
            <Link
              href="/pattern-generator"
              className="mt-3 block text-center text-xs text-white/35 underline-offset-4 transition hover:text-white/70 hover:underline"
            >
              Voltar ao gerador
            </Link>
          </footer>
        </aside>
      )}
    </div>
  );
}

function SliderControl({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="group block">
      <span className="mb-2 flex items-center justify-between gap-4 text-xs text-white/60">
        <span className="transition group-hover:text-white/80">{label}</span>
        <output className="min-w-16 rounded-sm bg-white/6 px-2 py-1 text-right font-mono text-[11px] tabular-nums text-white/85">
          {value.toFixed(3)}
        </output>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
        className="h-1.5 w-full cursor-ew-resize appearance-none rounded-full bg-white/12 accent-[#8d9ba1] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      />
    </label>
  );
}
