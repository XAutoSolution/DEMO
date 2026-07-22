"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Reusable animated segmented control. The sliding pill is a single
// layoutId instance, so it animates smoothly between options.
export function TypeToggle<T extends string>({
  options,
  value,
  onChange,
  accent = "#0f766e",
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  accent?: string;
}) {
  return (
    <div className="inline-flex rounded-full bg-neutral-100 p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "relative rounded-full px-5 py-2 text-sm font-medium transition-colors",
              active ? "text-white" : "text-neutral-600 hover:text-neutral-900"
            )}
          >
            {active && (
              <motion.span
                layoutId="type-toggle-pill"
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: accent }}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative z-10">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
