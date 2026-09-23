"use client";

import { motion, useReducedMotion } from "framer-motion";

import { ScreenShell } from "@/components/ScreenShell";
import { Button } from "@/components/ui/Button";
import { findFood, FOOD_OPTIONS } from "@/lib/food";
import type { ScreenProps } from "@/lib/flow";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { itemVariants } from "@/lib/motion";

export function FoodScreen({ state, dispatch }: ScreenProps) {
  const { t } = useTranslation();
  const reduced = useReducedMotion() ?? false;
  const item = itemVariants(reduced);

  const chosen = findFood(state.food);
  const chosenInfo = state.food ? t.food.options[state.food] : undefined;

  return (
    <ScreenShell direction={state.direction} width="lg">
      <motion.span
        variants={item}
        className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted"
      >
        {t.food.badge}
      </motion.span>

      <motion.h2
        variants={item}
        className="text-balance font-display text-4xl font-semibold leading-tight"
      >
        {t.food.titlePrefix}{" "}
        <span className="text-gradient italic">{t.food.titleHighlight}</span>
      </motion.h2>

      <motion.p variants={item} className="mt-2 text-sm text-muted">
        {t.food.subtitle}
      </motion.p>

      <motion.fieldset variants={item} className="mt-8 w-full">
        <legend className="sr-only">
          {t.food.titlePrefix} {t.food.titleHighlight}
        </legend>

        <div className="grid grid-cols-3 gap-3">
          {FOOD_OPTIONS.map((option) => {
            const isSelected = state.food === option.id;
            const localizedOption = t.food.options[option.id] ?? option;

            return (
              <label
                key={option.id}
                className="cursor-pointer select-none"
              >
                <input
                  type="radio"
                  name="food"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => dispatch({ type: "SET_FOOD", food: option.id })}
                  className="peer sr-only"
                />

                <span
                  className={[
                    "flex h-full flex-col items-center gap-1 rounded-2xl border px-4 py-5 text-center transition-[background-color,border-color,box-shadow,transform]",
                    "peer-focus-visible:ring-2 peer-focus-visible:ring-blush-400 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ink-900",
                    isSelected
                      ? "border-blush-400/60 bg-blush-500/15 shadow-glow scale-[1.02]"
                      : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]",
                  ].join(" ")}
                >
                  <span aria-hidden className="text-3xl leading-none">
                    {option.emoji}
                  </span>
                  <span
                    className={`mt-2 text-sm font-semibold ${
                      isSelected ? "text-[color:var(--text-primary)]" : "text-muted"
                    }`}
                  >
                    {localizedOption.label}
                  </span>
                  <span
                    className={`text-xs ${
                      isSelected ? "text-blush-300" : "text-muted/60"
                    }`}
                  >
                    {localizedOption.hint}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </motion.fieldset>

      <motion.p
        variants={item}
        aria-live="polite"
        className="mt-4 flex min-h-6 items-center justify-center text-sm text-muted"
      >
        {chosen && chosenInfo ? (
          <>
            <span className="font-medium text-[color:var(--text-primary)]">
              {chosenInfo.label}
            </span>
            <span className="pl-1.5 text-muted/70">· {t.food.selectedText}</span>
          </>
        ) : (
          <span className="text-xs text-muted/70">{t.food.promptText}</span>
        )}
      </motion.p>

      <motion.div
        variants={item}
        className="mt-6 flex items-center gap-3"
      >
        <Button variant="ghost" className="min-w-[9rem]" onClick={() => dispatch({ type: "BACK" })}>
          {t.common.back}
        </Button>
        <Button
          variant="primary"
          className="min-w-[9rem]"
          disabled={chosen === undefined}
          onClick={() => dispatch({ type: "NEXT" })}
        >
          {t.common.continue}
        </Button>
      </motion.div>

    </ScreenShell>
  );
}
