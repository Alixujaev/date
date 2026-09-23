/**
 * Telegram xabarini tayyorlash — faqat serverda (API route) ishlatiladi.
 */

import type { ContactPayload } from "@/lib/contact";

/** `parse_mode: "HTML"` uchun foydalanuvchi matnini zararsizlantiradi. */
export function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function formatInviteMessage(payload: ContactPayload): string {
  return [
    "<b>Yangi xabar!</b>",
    `<b>Ism:</b> ${escapeHtml(payload.name)}`,
    `<b>Xabar:</b> ${escapeHtml(payload.message)}`,
  ].join("\n");
}
