/**
 * Sayt haqidagi umumiy ma'lumot — metadata va OG rasm shu yerdan oladi.
 *
 * `metadataBase` absolyut URL talab qiladi (OG rasm havolasi uchun), shuning
 * uchun manba tartibi: qo'lda berilgan env → Vercel bergan domen → localhost.
 */

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  // Vercel production yoki preview deploy URL'lari
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProd) return `https://${vercelProd}`;

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const SITE = {
  url: resolveSiteUrl(),
  name: "Приглашение на свидание",
  title: "Пойдёшь со мной на свидание?",
  description: "Один вопрос и четыре коротких шага. Кнопку «Нет» поймать не получится.",
  locale: "ru_RU",
} as const;

/** OG/Twitter rasmining o'lchami — `opengraph-image.tsx` bilan bir xil bo'lishi shart. */
export const OG_SIZE = { width: 1200, height: 630 } as const;

/**
 * Favicon o'lchamlari: 32 — oddiy tab, 192 — yuqori zichlikdagi (Retina) ekranlar.
 * `app/icon.tsx` har birini `/icon/<o'lcham>` manzilida chiqaradi.
 */
export const ICON_SIZES = [32, 192] as const;

/** Brend ranglari — Tailwind konfigidagi qiymatlar bilan bir xil. */
export const BRAND = {
  ink: "#0b0713",
  inkTint: "#191033",
  blush: "#f86ea3",
  blushLight: "#ffc2da",
  plum: "#b99dff",
  ember: "#ffcf9b",
  text: "#f4eefb",
  muted: "#a99cc4",
} as const;
