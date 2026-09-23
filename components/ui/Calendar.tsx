"use client";

import { useMemo, useState } from "react";

import {
  addMonths,
  buildMonthGrid,
  compareMonths,
  formatLongDate,
  formatMonthTitle,
  fromISODate,
  isSameDay,
  startOfMonth,
  toISODate,
} from "@/lib/date";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface CalendarProps {
  /** Tanlangan sana — ISO `yyyy-mm-dd`, hali tanlanmagan bo'lsa null. */
  value: string | null;
  onSelect: (iso: string) => void;
  /** Shu kundan oldingi sanalar tanlanmaydi (shu kunning o'zi mumkin). */
  minDate: Date;
}

/** `minDate` oyidan boshlab necha oy oldinga varaqlash mumkin. */
const MAX_MONTHS_AHEAD = 12;

const cell =
  "flex h-10 w-full items-center justify-center rounded-xl text-sm transition-colors select-none";

export function Calendar({ value, onSelect, minDate }: CalendarProps) {
  const { locale, t } = useTranslation();
  const selected = useMemo(() => (value ? fromISODate(value) : null), [value]);

  const [cursor, setCursor] = useState(() =>
    startOfMonth(selected ?? minDate),
  );

  const days = useMemo(() => buildMonthGrid(cursor), [cursor]);
  const canGoBack = compareMonths(cursor, minDate) > 0;
  const canGoForward = compareMonths(cursor, minDate) < MAX_MONTHS_AHEAD;

  return (
    <div className="inset-panel w-full p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setCursor((month) => addMonths(month, -1))}
          disabled={!canGoBack}
          aria-label={t.common.prevMonth}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:bg-white/[0.07] hover:text-[color:var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <span aria-hidden className="text-base font-bold">‹</span>
        </button>

        <span
          aria-live="polite"
          className="font-display text-base font-semibold capitalize"
        >
          {formatMonthTitle(cursor, locale)}
        </span>

        <button
          type="button"
          onClick={() => setCursor((month) => addMonths(month, 1))}
          disabled={!canGoForward}
          aria-label={t.common.nextMonth}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:bg-white/[0.07] hover:text-[color:var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <span aria-hidden className="text-base font-bold">›</span>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1" aria-hidden>
        {t.dateTime.weekdaysShort.map((day) => (
          <span
            key={day}
            className="flex h-8 items-center justify-center text-xs font-medium uppercase tracking-wider text-muted/60"
          >
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const iso = toISODate(day);
          const outsideMonth = day.getMonth() !== cursor.getMonth();
          const disabled = day.getTime() < minDate.getTime();
          const isSelected = selected !== null && isSameDay(day, selected);

          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(iso)}
              aria-pressed={isSelected}
              aria-label={formatLongDate(day, locale)}
              className={[
                cell,
                isSelected
                  ? "bg-gradient-to-br from-blush-500 to-plum-400 font-semibold text-ink-900 shadow-glow"
                  : disabled
                    ? "cursor-not-allowed text-muted/20"
                    : outsideMonth
                      ? "text-muted/40 hover:bg-white/[0.06]"
                      : "text-[color:var(--text-primary)] hover:bg-white/[0.08]",
              ].join(" ")}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
