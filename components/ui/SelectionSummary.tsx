"use client";

import { formatLongDate, fromISODate } from "@/lib/date";
import type { FlowState } from "@/lib/flow";
import { findFood } from "@/lib/food";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface SelectionSummaryProps {
  state: Pick<FlowState, "date" | "time" | "food">;
}

const row = "flex items-center justify-between gap-4 px-4 py-3";

/** Oldingi bosqichlardagi tanlovlar — faqat ko'rish uchun, bu yerda o'zgartirilmaydi. */
export function SelectionSummary({ state }: SelectionSummaryProps) {
  const { locale, t } = useTranslation();

  const date = state.date ? formatLongDate(fromISODate(state.date), locale) : "—";
  const food = state.food
    ? (t.food.options[state.food]?.label ?? findFood(state.food)?.label ?? "—")
    : "—";

  const rows = [
    { label: t.finale.dateLabel, value: date },
    { label: t.finale.timeLabel, value: state.time ?? "—" },
    { label: t.finale.foodLabel, value: food },
  ];

  return (
    <section aria-labelledby="selection-summary-title" className="inset-panel overflow-hidden">
      <h3
        id="selection-summary-title"
        className="border-b border-white/[0.07] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-muted"
      >
        {t.finale.reviewTitle}
      </h3>

      <dl className="divide-y divide-white/[0.07]">
        {rows.map(({ label, value }) => (
          <div key={label} className={row}>
            <dt className="text-sm text-muted">{label}</dt>
            <dd className="text-right text-sm font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
