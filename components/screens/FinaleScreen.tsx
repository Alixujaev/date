"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { ScreenShell } from "@/components/ScreenShell";
import { Button } from "@/components/ui/Button";
import { ContactForm, type ContactValues } from "@/components/ui/ContactForm";
import { reachGoal } from "@/lib/analytics";
import type { ScreenProps } from "@/lib/flow";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { itemVariants, quickFade, screenVariants } from "@/lib/motion";
import { scrollToTopInstant } from "@/lib/scroll";
import { submitInvite } from "@/lib/submit";

type Phase = "form" | "submitting" | "sent";

export function FinaleScreen({ state, dispatch }: ScreenProps) {
  const { t } = useTranslation();
  const reduced = useReducedMotion() ?? false;
  const item = itemVariants(reduced);

  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState<string | null>(null);

  // Yuborish tugamay turib screen unmount bo'lsa — state yangilanmaydi
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleSubmit = useCallback(
    async (values: ContactValues) => {
      if (phase !== "form") return;
      setError(null);
      setPhase("submitting");

      try {
        await submitInvite({
          name: values.name,
          message: values.message,
        });
        reachGoal("invite_sent", { name: values.name });
        if (mountedRef.current) setPhase("sent");
      } catch {
        if (!mountedRef.current) return;
        setError(t.finale.submitError);
        setPhase("form");
      }
    },
    [phase, t.finale.submitError],
  );

  const submitting = phase === "submitting";

  return (
    <ScreenShell direction={state.direction}>
      <AnimatePresence mode="wait" initial={false} onExitComplete={scrollToTopInstant}>
        {phase === "sent" ? (
          <motion.div
            key="sent"
            inherit={false}
            custom={1}
            variants={screenVariants(reduced)}
            initial="enter"
            animate="center"
            className="flex w-full flex-col items-center py-6"
          >
            <motion.h2
              variants={item}
              className="text-balance font-display text-4xl font-semibold leading-tight"
            >
              <span className="text-gradient italic">{t.finale.sentTitle}</span>
            </motion.h2>

            <motion.p
              variants={item}
              aria-live="polite"
              className="mt-3 max-w-sm text-balance text-base leading-relaxed text-muted"
            >
              {t.finale.sentText}
            </motion.p>

            <motion.div variants={item} className="mt-8">
              <Button
                variant="ghost"
                className="min-w-[9rem]"
                onClick={() => dispatch({ type: "RESET" })}
              >
                {t.common.startOver}
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            exit={
              reduced
                ? { opacity: 0, transition: { duration: 0.15 } }
                : { opacity: 0, y: -24, scale: 0.98, transition: quickFade }
            }
            className="flex w-full flex-col items-center"
          >
            <motion.span
              variants={item}
              className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted"
            >
              {t.finale.badge}
            </motion.span>

            <motion.h2
              variants={item}
              className="max-w-md text-balance font-display text-3xl font-semibold leading-tight"
            >
              {t.finale.title}
            </motion.h2>

            <motion.div variants={item} className="mt-8 w-full">
              <ContactForm
                onSubmit={handleSubmit}
                submitting={submitting}
                error={error}
              />
            </motion.div>

            <motion.div variants={item} className="mt-4">
              <Button
                variant="ghost"
                className="min-w-[9rem]"
                disabled={submitting}
                onClick={() => dispatch({ type: "BACK" })}
              >
                {t.common.back}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenShell>
  );
}
