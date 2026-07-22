"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

export type Field = {
  label: string;
  placeholder?: string;
  type?: "text" | "select" | "textarea" | "file";
  options?: string[];
};

export type Step = { title: string; fields: Field[] };

// Reusable multi-step form shell. Steps (and their fields) are passed in, so
// the publish flow can change its fields by content type without new code.
export function StepForm({
  steps,
  accent = "#0f766e",
}: {
  steps: Step[];
  accent?: string;
}) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [done, setDone] = useState(false);
  const last = i === steps.length - 1;

  const go = (d: number) => {
    if ((d < 0 && i === 0) || (d > 0 && last)) return;
    setDir(d);
    setI((v) => v + d);
  };

  const progress = ((i + 1) / steps.length) * 100;

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: accent }}
        >
          <Check size={26} />
        </div>
        <p className="text-lg font-semibold text-neutral-900">
          Anuncio publicado
        </p>
        <p className="max-w-xs text-sm text-neutral-500">
          Ya aparece en el catálogo. (Demo — no conectado a base de datos real.)
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-neutral-500">
          <span>
            Paso {i + 1} de {steps.length}
          </span>
          <span>{steps[i].title}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: accent }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="relative min-h-[236px] overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={i}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            {steps[i].fields.map((f) => (
              <label key={f.label} className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-neutral-700">
                  {f.label}
                </span>
                {f.type === "select" ? (
                  <select className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 outline-none focus:border-neutral-400">
                    {(f.options ?? []).map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : f.type === "textarea" ? (
                  <textarea
                    rows={3}
                    placeholder={f.placeholder}
                    className="resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                  />
                ) : f.type === "file" ? (
                  <div className="rounded-lg border border-dashed border-neutral-300 px-3 py-6 text-center text-sm text-neutral-400">
                    Arrastra tus fotos aquí
                  </div>
                ) : (
                  <input
                    placeholder={f.placeholder}
                    className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                  />
                )}
              </label>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={i === 0}
          className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-500 disabled:opacity-40"
        >
          Atrás
        </button>
        <button
          type="button"
          onClick={() => (last ? setDone(true) : go(1))}
          className="rounded-lg px-5 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: accent }}
        >
          {last ? "Publicar" : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
