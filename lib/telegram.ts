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

export interface VisitPayload {
  visitCount: number;
  screenWidth?: number;
  screenHeight?: number;
  isMobile?: boolean;
  referrer?: string;
  language?: string;
  ip?: string;
  userAgent?: string;
}

function parseDeviceInfo(userAgent?: string, isMobile?: boolean): string {
  if (!userAgent) {
    return isMobile ? "📱 Telefon / Planshet" : "💻 Kompyuter (Desktop)";
  }

  let os = "Noma'lum OS";
  if (/windows/i.test(userAgent)) os = "Windows";
  else if (/iphone/i.test(userAgent)) os = "iPhone (iOS)";
  else if (/ipad/i.test(userAgent)) os = "iPad (iPadOS)";
  else if (/macintosh|mac os x/i.test(userAgent)) os = "macOS (Apple)";
  else if (/android/i.test(userAgent)) os = "Android";
  else if (/linux/i.test(userAgent)) os = "Linux";

  let browser = "Brauzer";
  if (/telegram/i.test(userAgent)) browser = "Telegram ichki brauzeri";
  else if (/instagram/i.test(userAgent)) browser = "Instagram ichki brauzeri";
  else if (/edg/i.test(userAgent)) browser = "Microsoft Edge";
  else if (/chrome|crios/i.test(userAgent)) browser = "Chrome";
  else if (/firefox|fxios/i.test(userAgent)) browser = "Firefox";
  else if (/safari/i.test(userAgent)) browser = "Safari";

  return `${isMobile ? "📱" : "💻"} ${os} — ${browser}`;
}

export function formatVisitMessage(payload: VisitPayload): string {
  const visitText =
    payload.visitCount === 1
      ? "✨ <b>1-marta</b> (Birinchi kirishi!)"
      : `🔁 <b>${payload.visitCount}-marta</b> (Qayta tashrif)`;

  const deviceText = parseDeviceInfo(payload.userAgent, payload.isMobile);
  const resolution =
    payload.screenWidth && payload.screenHeight
      ? ` (${payload.screenWidth}x${payload.screenHeight})`
      : "";

  const timeUz = new Date().toLocaleString("ru-RU", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const lines = [
    "👀 <b>Saytga yangi tashrif!</b>",
    "",
    `🔢 <b>Tashrif soni:</b> ${visitText}`,
    `🖥 <b>Qurilma:</b> ${deviceText}${resolution}`,
    `⏰ <b>Vaqt:</b> ${timeUz} (Toshkent)`,
  ];

  if (payload.ip && payload.ip !== "Aniqlanmadi") {
    lines.push(`🌐 <b>IP manzil:</b> <code>${escapeHtml(payload.ip)}</code>`);
  }

  if (payload.referrer && payload.referrer !== "direct") {
    lines.push(`🔗 <b>Manba:</b> ${escapeHtml(payload.referrer)}`);
  }

  return lines.join("\n");
}

