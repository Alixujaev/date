/**
 * Yandex Metrika va analitika hodisalarini (Goals) yuborish uchun yordamchi funksiyalar.
 */

declare global {
  interface Window {
    ym?: (
      id: number | string,
      action: "reachGoal" | "hit" | "init" | "params",
      target: string,
      params?: Record<string, unknown>,
    ) => void;
  }
}

/**
 * Yandex Metrika hisoblagichiga maqsadli hodisa (Goal) yuborish.
 * Masalan: reachGoal("click_yes"), reachGoal("no_attempt", { count: 3 })
 */
export function reachGoal(goalName: string, params?: Record<string, unknown>): void {
  const metrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.trim() || "113002335";
  if (!metrikaId || typeof window === "undefined") return;

  if (typeof window.ym === "function") {
    try {
      window.ym(metrikaId.trim(), "reachGoal", goalName, params);
    } catch (e) {
      console.warn("[analytics] reachGoal xatosi:", e);
    }
  }
}
