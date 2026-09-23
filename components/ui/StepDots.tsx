"use client";

import { motion } from "framer-motion";

import { STEP_ORDER, type StepId, stepIndex } from "@/lib/flow";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface StepDotsProps {
  current: StepId;
}

/** 4 bosqichning qaysi biridaligini ko'rsatuvchi kichik indikator. */
export function StepDots({ current }: StepDotsProps) {
  const { t } = useTranslation();
  const activeIndex = stepIndex(current);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-7 z-20 flex items-center justify-center gap-2"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={STEP_ORDER.length}
      aria-valuenow={activeIndex + 1}
      aria-label={t.common.stepIndicator(activeIndex + 1, STEP_ORDER.length)}
    >
      {STEP_ORDER.map((step, index) => {
        const isActive = index === activeIndex;
        return (
          <motion.span
            key={step}
            layout
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className={`h-1.5 rounded-full ${
              isActive
                ? "w-7 bg-blush-400"
                : index < activeIndex
                  ? "w-1.5 bg-plum-400/70"
                  : "w-1.5 bg-white/15"
            }`}
          />
        );
      })}
    </div>
  );
}
