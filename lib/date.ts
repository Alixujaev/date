/**
 * Sana/vaqt yordamchilari. React yo'q — sof funksiyalar.
 *
 * Hamma hisob-kitob **mahalliy vaqtda** bajariladi va sana ISO `yyyy-mm-dd`
 * satri sifatida saqlanadi. `toISOString()` ataylab ishlatilmaydi: u UTC ga
 * o'tkazadi va vaqt mintaqasiga qarab sanani bir kunga surib yuborishi mumkin.
 */

import { type Locale, translations } from "@/lib/i18n/translations";

/** Kalendar to'ri doim 6 hafta — oylar almashganda balandlik sakramaydi. */
export const WEEKS_IN_GRID = 6;

export interface TimeSlotConfig {
  /** `HH:mm` — state'da shu saqlanadi. */
  value: string;
}

export const TIME_SLOT_VALUES: readonly string[] = [
  "13:00",
  "17:00",
  "19:00",
  "21:00",
] as const;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** Mahalliy sanadan `yyyy-mm-dd`. */
export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** `yyyy-mm-dd` dan mahalliy yarim tundagi Date. */
export function fromISODate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfToday(): Date {
  return startOfDay(new Date());
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Oylarni taqqoslash: manfiy = `a` oldinroq, 0 = bir xil oy. */
export function compareMonths(a: Date, b: Date): number {
  return a.getFullYear() * 12 + a.getMonth() - (b.getFullYear() * 12 + b.getMonth());
}

/** Dushanba = 0 … yakshanba = 6. */
export function weekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

/**
 * Oyning to'liq to'ri: 42 kun (6 hafta × 7 kun). Chetlardagi kunlar
 * qo'shni oylardan olinadi, shuning uchun to'r doim to'la bo'ladi.
 */
export function buildMonthGrid(month: Date): Date[] {
  const first = startOfMonth(month);
  const gridStart = addDays(first, -weekdayIndex(first));

  return Array.from({ length: WEEKS_IN_GRID * 7 }, (_, index) =>
    addDays(gridStart, index),
  );
}

/** Kalendar sarlavhasi (masalan: "Октябрь 2026", "2026-yil oktabr", "October 2026"). */
export function formatMonthTitle(month: Date, locale: Locale = "ru"): string {
  const t = translations[locale].dateTime;
  const monthName = t.months[month.getMonth()];
  const year = month.getFullYear();

  if (locale === "uz") {
    return `${year}${t.yearSuffix} ${monthName}`;
  }
  if (locale === "ru") {
    const capitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return `${capitalized} ${year}${t.yearSuffix}`;
  }
  return `${monthName} ${year}`;
}

/** Tanlangan sanani ko'rsatish uchun (masalan: "14 октября, вторник", "14-oktabr, seshanba", "October 14, Tuesday"). */
export function formatLongDate(date: Date, locale: Locale = "ru"): string {
  const t = translations[locale].dateTime;
  const day = date.getDate();
  const monthName = t.months[date.getMonth()];
  const weekday = t.weekdaysLong[weekdayIndex(date)];

  if (locale === "uz") {
    return `${day}-${monthName}, ${weekday}`;
  }
  if (locale === "ru") {
    return `${day} ${monthName}, ${weekday}`;
  }
  return `${monthName} ${day}, ${weekday}`;
}

/** Qisqa sana (masalan: "14 октября", "14-oktabr", "Oct 14"). */
export function formatShortDate(date: Date, locale: Locale = "ru"): string {
  const t = translations[locale].dateTime;
  const day = date.getDate();
  const monthName = t.months[date.getMonth()];

  if (locale === "uz") {
    return `${day}-${monthName}`;
  }
  return `${day} ${monthName}`;
}
