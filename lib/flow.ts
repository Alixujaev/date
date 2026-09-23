import type { Dispatch } from "react";

/**
 * Barcha mavjud ekranlar: welcome → when → food → finale.
 * when va food hozircha yashirilgan (STEP_ORDER'ga kirmaydi),
 * lekin komponentlar papkasida saqlangan.
 */
export type StepId = "welcome" | "when" | "food" | "finale";

/** Aktiv flow — faqat 2 ta ekran: boshlanish va forma. */
export const STEP_ORDER = ["welcome", "finale"] as const;
export type ActiveStepId = (typeof STEP_ORDER)[number];

/** Barcha StepId'lar ro'yxati (yashirilganlar ham) — komponent kartasi uchun. */
export const ALL_STEPS = ["welcome", "when", "food", "finale"] as const;

/** 1-bosqichdagi javob. */
export type Answer = "yes" | "no";

/** Transition yo'nalishi: 1 = oldinga, -1 = orqaga. */
export type Direction = 1 | -1;

export interface FlowState {
  step: StepId;
  answer: Answer | null;
  /** "Yo'q" necha marta bosilgani — hazil mantiqi uchun. */
  noAttempts: number;
  direction: Direction;
  /** 2-screen (sana) — komponentlar uchun saqlangan */
  date: string | null;
  /** 2-screen (vaqt) — komponentlar uchun saqlangan */
  time: string | null;
  /** 3-screen (ovqat) — komponentlar uchun saqlangan */
  food: string | null;
}

export type FlowAction =
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "GOTO"; step: StepId }
  | { type: "ANSWER"; answer: Answer }
  | { type: "NO_ATTEMPT" }
  | { type: "SET_DATE"; date: string }
  | { type: "SET_TIME"; time: string }
  | { type: "SET_FOOD"; food: string }
  | { type: "RESET" };

export const initialFlowState: FlowState = {
  step: "welcome",
  answer: null,
  noAttempts: 0,
  direction: 1,
  date: null,
  time: null,
  food: null,
};

export function stepIndex(step: StepId): number {
  return STEP_ORDER.indexOf(step as ActiveStepId);
}

function stepAt(index: number): ActiveStepId {
  const clamped = Math.min(Math.max(index, 0), STEP_ORDER.length - 1);
  return STEP_ORDER[clamped];
}

/** Sof reducer — yon effektsiz. */
export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "NEXT": {
      const step = stepAt(stepIndex(state.step) + 1);
      return step === state.step ? state : { ...state, step, direction: 1 };
    }

    case "BACK": {
      const step = stepAt(stepIndex(state.step) - 1);
      return step === state.step ? state : { ...state, step, direction: -1 };
    }

    case "GOTO": {
      if (action.step === state.step) return state;
      const direction: Direction =
        stepIndex(action.step) > stepIndex(state.step) ? 1 : -1;
      return { ...state, step: action.step, direction };
    }

    case "ANSWER":
      return { ...state, answer: action.answer };

    case "NO_ATTEMPT":
      return { ...state, noAttempts: state.noAttempts + 1 };

    case "SET_DATE":
      return state.date === action.date ? state : { ...state, date: action.date };

    case "SET_TIME":
      return state.time === action.time ? state : { ...state, time: action.time };

    case "SET_FOOD":
      return state.food === action.food ? state : { ...state, food: action.food };

    case "RESET":
      return { ...initialFlowState, direction: -1 };

    default:
      return state;
  }
}

/** Har bir screen komponenti aynan shu propslarni oladi. */
export interface ScreenProps {
  state: FlowState;
  dispatch: Dispatch<FlowAction>;
}
