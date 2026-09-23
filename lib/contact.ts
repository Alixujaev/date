/**
 * Aloqa formasi uchun formatlash va validatsiya. Sof funksiyalar — React yo'q.
 */

import { TIME_SLOT_VALUES } from "@/lib/date";
import { findFood } from "@/lib/food";

export const CONTACT_LIMITS = { name: 60, message: 500 } as const;

/** O'zbekiston kodi va undan keyingi raqamlar soni: +998 XX XXX XX XX. */
const COUNTRY = "998";
const LOCAL_DIGITS = 9;
export const PHONE_PREFIX = `+${COUNTRY} `;

export interface ContactPayload {
  name: string;
  message: string;
  /** Avvalgi komponentlar uchun ixtiyoriy saqlangan maydonlar */
  phone?: string | null;
  date?: string | null;
  time?: string | null;
  food?: string | null;
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Kiritilgan matndan `998` dan keyingi 9 ta mahalliy raqamni oladi. */
function localDigits(value: string): string {
  const digits = onlyDigits(value);
  const local = digits.startsWith(COUNTRY) ? digits.slice(COUNTRY.length) : digits;
  return local.slice(0, LOCAL_DIGITS);
}

/**
 * Kiritish maskasi: "901234567" yoki "+998901234567" -> "+998 90 123 45 67".
 * Prefiks doim saqlanadi — foydalanuvchi uni o'chira olmaydi.
 */
export function formatUzPhone(value: string): string {
  const local = localDigits(value);
  const groups = [local.slice(0, 2), local.slice(2, 5), local.slice(5, 7), local.slice(7, 9)];
  return (PHONE_PREFIX + groups.filter(Boolean).join(" ")).trimEnd() + (local ? "" : " ");
}

/** Qat'iy: ortiqcha raqamlar kesilmaydi — "+998 90 123 45 678" noto'g'ri. */
export function isValidUzPhone(value: string): boolean {
  const digits = onlyDigits(value);
  const local = digits.startsWith(COUNTRY) ? digits.slice(COUNTRY.length) : digits;
  return local.length === LOCAL_DIGITS;
}

/** Yuborish uchun: "+998 90 123 45 67" -> "+998901234567". */
export function normalizeUzPhone(value: string): string {
  return `+${COUNTRY}${localDigits(value)}`;
}

export function isValidName(value: string): boolean {
  const name = value.trim();
  return name.length >= 2 && name.length <= CONTACT_LIMITS.name;
}

export function isValidMessage(value: string): boolean {
  const msg = value.trim();
  return msg.length >= 1 && msg.length <= CONTACT_LIMITS.message;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function optionalString(value: unknown): string | null | undefined {
  if (value === null || value === undefined || value === "") return null;
  return typeof value === "string" ? value : undefined;
}

/**
 * API route'ga kelgan JSON'ni tekshiradi va tozalaydi.
 * Endi faqat `name` va `message` majburiy.
 */
export function parseContactPayload(body: unknown): ContactPayload | null {
  if (typeof body !== "object" || body === null) return null;
  const raw = body as Record<string, unknown>;

  const { name, message } = raw;
  if (typeof name !== "string" || !isValidName(name)) return null;
  if (typeof message !== "string" || !isValidMessage(message)) return null;

  const phone = optionalString(raw.phone);
  const date = optionalString(raw.date);
  const time = optionalString(raw.time);
  const food = optionalString(raw.food);

  if (phone !== null && phone !== undefined && !isValidUzPhone(phone)) return null;
  if (date !== null && date !== undefined && !ISO_DATE.test(date)) return null;
  if (time !== null && time !== undefined && !TIME_SLOT_VALUES.includes(time)) return null;
  if (food !== null && food !== undefined && !findFood(food)) return null;

  return {
    name: name.trim(),
    message: message.trim(),
    phone: phone ? normalizeUzPhone(phone) : null,
    date: date ?? null,
    time: time ?? null,
    food: food ?? null,
  };
}
