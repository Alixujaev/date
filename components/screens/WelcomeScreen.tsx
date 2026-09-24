"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useRef } from "react";

import { ScreenShell } from "@/components/ScreenShell";
import { Button } from "@/components/ui/Button";
import { RunawayButton } from "@/components/ui/RunawayButton";
import { reachGoal } from "@/lib/analytics";
import type { ScreenProps } from "@/lib/flow";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { itemVariants } from "@/lib/motion";

export function WelcomeScreen({ state, dispatch }: ScreenProps) {
  const { t } = useTranslation();
  const reduced = useReducedMotion() ?? false;
  const item = itemVariants(reduced);

  const yesRef = useRef<HTMLButtonElement>(null);

  const handleYes = () => {
    reachGoal("answer_yes");
    dispatch({ type: "ANSWER", answer: "yes" });
    // "Ha" bosilganda to'g'ridan-to'g'ri forma ekraniga o'tamiz
    dispatch({ type: "GOTO", step: "finale" });
  };

  const handleFlee = useCallback(() => {
    reachGoal("flee_no", { attempts: state.noAttempts + 1 });
    dispatch({ type: "NO_ATTEMPT" });
  }, [dispatch, state.noAttempts]);

  return (
    <ScreenShell direction={state.direction}>
      <motion.span
        variants={item}
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted backdrop-blur-sm"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-blush-400 animate-pulse" />
        {t.welcome.badge}
      </motion.span>

      <motion.h1
        variants={item}
        className="text-balance font-display text-5xl font-semibold leading-[1.1]"
      >
        {t.welcome.titleQuestion}{" "}
        <span className="text-gradient italic">{t.welcome.titleHighlight}</span>
        {t.welcome.titleRest ? ` ${t.welcome.titleRest}` : ""}
      </motion.h1>

      <motion.p
        variants={item}
        className="mt-5 max-w-md text-balance text-lg leading-relaxed text-muted"
      >
        {t.welcome.description}
      </motion.p>

      <motion.div
        variants={item}
        className="mt-16 flex items-center justify-center gap-4"
      >
        <Button
          ref={yesRef}
          variant="primary"
          className="min-w-[10rem]"
          onClick={handleYes}
        >
          {t.welcome.yes}
        </Button>
        <RunawayButton
          anchorRef={yesRef}
          fleeCount={state.noAttempts}
          onFlee={handleFlee}
        >
          {t.welcome.no}
        </RunawayButton>
      </motion.div>

      <motion.p variants={item} className="mt-10 text-xs text-muted/70">
        {t.welcome.durationHint}
      </motion.p>
    </ScreenShell>
  );
}
