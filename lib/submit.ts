import { type ContactPayload, isValidMessage, isValidName } from "@/lib/contact";

/** Server Telegram'ni 10s kutadi — klient undan biroz ko'proq. */
const REQUEST_TIMEOUT_MS = 15_000;

/**
 * Xabarni `/api/submit-invite` orqali Telegram'ga yuboradi.
 * Muvaffaqiyatsiz bo'lsa (tarmoq, server yoki Telegram xatosi) — xato tashlaydi;
 * foydalanuvchiga ko'rsatiladigan matnni komponent tanlaydi.
 */
export async function submitInvite(payload: ContactPayload): Promise<void> {
  if (!isValidName(payload.name) || !isValidMessage(payload.message)) {
    throw new Error("Invalid contact payload");
  }

  const response = await fetch("/api/submit-invite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  const result = (await response.json().catch(() => null)) as
    | { ok: boolean; error?: string }
    | null;

  if (!response.ok || !result?.ok) {
    throw new Error(result?.error ?? `HTTP ${response.status}`);
  }
}
