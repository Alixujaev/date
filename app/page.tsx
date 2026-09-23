"use client";

import { AnimatePresence } from "framer-motion";
import { useReducer } from "react";
import type { ComponentType } from "react";

import { FinaleScreen } from "@/components/screens/FinaleScreen";
import { WelcomeScreen } from "@/components/screens/WelcomeScreen";
import { StepDots } from "@/components/ui/StepDots";
import {
  flowReducer,
  initialFlowState,
  type ScreenProps,
  type StepId,
} from "@/lib/flow";
import { scrollToTopInstant } from "@/lib/scroll";

/**
 * Aktiv ekranlar xaritasi:
 * 1-screen (welcome) -> 2-screen (forma: FinaleScreen).
 * DateTimeScreen va FoodScreen vaqtincha flow'dan chiqarilgan,
 * lekin komponentlar papkasida saqlangan.
 */
const SCREENS: Partial<Record<StepId, ComponentType<ScreenProps>>> = {
  welcome: WelcomeScreen,
  finale: FinaleScreen,
};

export default function Home() {
  const [state, dispatch] = useReducer(flowReducer, initialFlowState);
  const Screen = SCREENS[state.step];

  if (!Screen) {
    return null;
  }

  return (
    <>
      <AnimatePresence
        mode="wait"
        custom={state.direction}
        initial={false}
        onExitComplete={scrollToTopInstant}
      >
        <Screen key={state.step} state={state} dispatch={dispatch} />
      </AnimatePresence>

      <StepDots current={state.step} />
    </>
  );
}
