import { NextResponse } from "next/server";

import { parseContactPayload } from "@/lib/contact";
import { formatInviteMessage } from "@/lib/telegram";

/** Telegram javob bermasa, foydalanuvchi cheksiz kutib qolmasin. */
const TELEGRAM_TIMEOUT_MS = 10_000;

/**
 * Javob kodlari — klient ularni foydalanuvchi uchun matnga aylantiradi:
 * - `invalid_payload` (400): forma ma'lumoti noto'g'ri;
 * - `not_configured` (500): serverda token/chat ID yo'q;
 * - `telegram_failed` (502): Telegram xato qaytardi yoki javob bermadi.
 */
export type SubmitInviteError = "invalid_payload" | "not_configured" | "telegram_failed";

function fail(error: SubmitInviteError, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("invalid_payload", 400);
  }

  const payload = parseContactPayload(body);
  if (!payload) return fail("invalid_payload", 400);

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("[submit-invite] TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID berilmagan");
    return fail("not_configured", 500);
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: formatInviteMessage(payload),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
      cache: "no-store",
    });

    const result = (await response.json().catch(() => null)) as
      | { ok: boolean; description?: string }
      | null;

    if (!response.ok || !result?.ok) {
      // Token URL ichida — log'ga faqat status va Telegram izohini yozamiz
      console.error("[submit-invite] Telegram xatosi:", response.status, result?.description);
      return fail("telegram_failed", 502);
    }
  } catch (error) {
    console.error(
      "[submit-invite] Telegram'ga ulanib bo'lmadi:",
      error instanceof Error ? error.name : error,
    );
    return fail("telegram_failed", 502);
  }

  return NextResponse.json({ ok: true });
}
