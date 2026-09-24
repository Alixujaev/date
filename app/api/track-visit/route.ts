import { NextResponse } from "next/server";

import { formatVisitMessage, type VisitPayload } from "@/lib/telegram";

const TELEGRAM_TIMEOUT_MS = 10_000;

export async function POST(request: Request) {
  let body: Partial<VisitPayload> = {};
  try {
    body = await request.json();
  } catch {
    // Bo'sh so'rov kelsa ham xatolik bermaymiz
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    // Agar bot sozlanmagan bo'lsa, xatolik qaytarmasdan jim chiqib ketamiz
    return NextResponse.json({ ok: false, message: "not_configured" });
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || "Aniqlanmadi";
  const userAgent = request.headers.get("user-agent") || "";

  const visitPayload: VisitPayload = {
    visitCount: typeof body.visitCount === "number" ? body.visitCount : 1,
    screenWidth: body.screenWidth,
    screenHeight: body.screenHeight,
    isMobile: body.isMobile,
    referrer: body.referrer,
    language: body.language,
    ip,
    userAgent,
  };

  try {
    const text = formatVisitMessage(visitPayload);
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (err) {
    console.error("[track-visit] Telegram'ga xabar yuborishda xatolik:", err);
  }

  return NextResponse.json({ ok: true });
}
