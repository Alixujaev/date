"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

import { ScreenShell } from "@/components/ScreenShell";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import {
  addDays,
  formatLongDate,
  fromISODate,
  startOfToday,
  TIME_SLOT_VALUES,
} from "@/lib/date";
import type { ScreenProps } from "@/lib/flow";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { itemVariants } from "@/lib/motion";

export function DateTimeScreen({ state, dispatch }: ScreenProps) {
  const { locale, t } = useTranslation();
  const reduced = useReducedMotion() ?? false;
  const item = itemVariants(reduced);

  // "Bugundan keyingi sanalar" — eng erta variant ertaga.
  const minDate = useMemo(() => addDays(startOfToday(), 1), []);

  const ready = state.date !== null && state.time !== null;

  return (
    <ScreenShell direction={state.direction} width="lg">
      <motion.span
        variants={item}
        className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted"
      >
        {t.dateTime.badge}
      </motion.span>

      <motion.h2
        variants={item}
        className="text-balance font-display text-4xl font-semibold leading-tight"
      >
        {t.dateTime.titlePrefix}{" "}
        <span className="text-gradient italic">{t.dateTime.titleHighlight}</span>
      </motion.h2>

      <motion.p variants={item} className="mt-2 text-sm text-muted">
        {t.dateTime.subtitle}
      </motion.p>

      {/* Chapda kalendar, o'ngda vaqt va tanlov xulosasi */}
      <motion.div
        variants={item}
        className="mt-8 grid w-full grid-cols-[minmax(0,1fr)_14rem] gap-6 text-left"
      >
        <Calendar
          value={state.date}
          minDate={minDate}
          onSelect={(date) => dispatch({ type: "SET_DATE", date })}
        />

        <div className="flex flex-col">
          <fieldset>
            <legend className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              {t.dateTime.timeHeading}
            </legend>

            <div className="flex flex-col gap-2">
              {TIME_SLOT_VALUES.map((timeValue) => {
                const isSelected = state.time === timeValue;
                const slotLabel = t.dateTime.timeSlots[timeValue] ?? timeValue;

                return (
                  <button
                    key={timeValue}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => dispatch({ type: "SET_TIME", time: timeValue })}
                    className={[
                      "flex h-12 items-center justify-between rounded-xl border px-4 transition-colors",
                      isSelected
                        ? "border-blush-400/60 bg-blush-500/15 text-[color:var(--text-primary)] shadow-glow"
                        : "border-white/10 bg-white/[0.03] text-muted hover:bg-white/[0.07]",
                    ].join(" ")}
                  >
                    <span className="text-sm font-semibold">{slotLabel}</span>
                    <span
                      className={`text-xs tabular-nums ${
                        isSelected ? "text-blush-300" : "text-muted/70"
                      }`}
                    >
                      {timeValue}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <p
            aria-live="polite"
            className="mt-auto pt-5 text-sm leading-relaxed text-muted"
          >
            {state.date ? (
              <>
                <span className="block font-medium text-[color:var(--text-primary)]">
                  {formatLongDate(fromISODate(state.date), locale)}
                </span>
                {state.time ?? t.dateTime.pickTimeNext}
              </>
            ) : (
              t.dateTime.pickDateFirst
            )}
          </p>
        </div>
      </motion.div>

      <motion.div variants={item} className="mt-8 flex items-center gap-3">
        <Button variant="ghost" className="min-w-[9rem]" onClick={() => dispatch({ type: "BACK" })}>
          {t.common.back}
        </Button>
        <Button
          variant="primary"
          className="min-w-[9rem]"
          disabled={!ready}
          onClick={() => dispatch({ type: "NEXT" })}
        >
          {t.common.continue}
        </Button>
      </motion.div>
    </ScreenShell>
  );
}
