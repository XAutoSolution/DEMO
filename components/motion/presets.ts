// Shared Framer Motion presets. Import these in any demo so motion feels
// consistent across bids and new demos compose fast.
import type { Variants } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

export const staggerGrid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

export const cardIn: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: EASE } },
};

export const overlayIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const panelIn: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: EASE } },
  exit: { opacity: 0, y: 16, scale: 0.98, transition: { duration: 0.18 } },
};
