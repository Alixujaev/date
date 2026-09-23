"use client";

import { motion, useIsPresent, useReducedMotion } from "framer-motion";

import type { Direction } from "@/lib/flow";
import { screenVariants } from "@/lib/motion";

/** Card kengligi: `md` — matnli screenlar, `lg` — ikki ustunli (sana/vaqt, ovqat). */
export type ShellWidth = "md" | "lg";

const WIDTHS: Record<ShellWidth, string> = {
  md: "max-w-xl",
  lg: "max-w-3xl",
};

interface ScreenShellProps {
  children: React.ReactNode;
  /** Transition yo'nalishi — reducer'dagi `state.direction`. */
  direction: Direction;
  width?: ShellWidth;
}

/**
 * Har bir screen ekran markazidagi shu card ichida render qilinadi.
 * Past (masalan 768px) noutbuk ekranlarida card sig'masa, sahifa scroll bo'ladi —
 * `my-auto` tepani kesmaydi.
 *
 * Exit animatsiyasi paytida screen hali DOM'da turadi — `inert` bo'lmasa,
 * "Далее"ni ikki marta tez bosish bitta bosqichni sakrab o'tadi.
 */
export function ScreenShell({ children, direction, width = "md" }: ScreenShellProps) {
  const reduced = useReducedMotion() ?? false;
  const isPresent = useIsPresent();

  return (
    <motion.section
      custom={direction}
      variants={screenVariants(reduced)}
      initial="enter"
      animate="center"
      exit="exit"
      inert={!isPresent}
      aria-hidden={!isPresent || undefined}
      className={`flex min-h-[100dvh] w-full flex-col items-center px-8 pb-20 pt-20 ${
        isPresent ? "" : "pointer-events-none"
      }`}
    >
      <div
        className={`glass-card my-auto flex w-full flex-col items-center px-12 py-11 text-center ${WIDTHS[width]}`}
      >
        {children}
      </div>
    </motion.section>
  );
}
