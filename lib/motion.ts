import type { Transition, Variants } from "framer-motion";

import type { Direction } from "@/lib/flow";

export const springy: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.9,
};

export const quickFade: Transition = {
  type: "tween",
  duration: 0.22,
  ease: "easeIn",
};

/**
 * Screenlar orasidagi o'tish. `custom` orqali yo'nalish (1 | -1) uzatiladi,
 * `reduced` true bo'lsa faqat fade qoladi.
 */
export function screenVariants(reduced: boolean): Variants {
  if (reduced) {
    return {
      enter: { opacity: 0 },
      center: { opacity: 1, transition: { duration: 0.2 } },
      exit: { opacity: 0, transition: { duration: 0.15 } },
    };
  }

  return {
    enter: (direction: Direction) => ({
      opacity: 0,
      y: 28 * direction,
      scale: 0.98,
    }),
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { ...springy, staggerChildren: 0.08, delayChildren: 0.06 },
    },
    exit: (direction: Direction) => ({
      opacity: 0,
      y: -24 * direction,
      scale: 0.98,
      transition: quickFade,
    }),
  };
}

/** Screen ichidagi elementlar ketma-ket chiqishi uchun. */
export function itemVariants(reduced: boolean): Variants {
  if (reduced) {
    return {
      enter: { opacity: 0 },
      center: { opacity: 1, transition: { duration: 0.2 } },
    };
  }

  return {
    enter: { opacity: 0, y: 16, filter: "blur(6px)" },
    center: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { ...springy, damping: 24 },
    },
  };
}

/**
 * Qochoq tugmaning sakrashi. Reduced-motion rejimida hazil saqlanadi,
 * ammo spring o'rniga qisqa tween — overshoot va chayqalish bo'lmaydi.
 */
export function fleeTransition(reduced: boolean): Transition {
  return reduced
    ? { type: "tween", duration: 0.18, ease: "easeOut" }
    : { type: "spring", stiffness: 380, damping: 20, mass: 0.7 };
}
