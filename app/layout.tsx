import type { Metadata, Viewport } from "next";
import { Lora, Manrope } from "next/font/google";

import { AuroraBackground } from "@/components/AuroraBackground";
import { DesktopOnlyNotice } from "@/components/DesktopOnlyNotice";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { LanguageProvider } from "@/lib/i18n/useTranslation";
import { BRAND, SITE } from "@/lib/site";

import "./globals.css";

// Ikkala shrift ham to'liq kirillni qo'llaydi — asosiy til rus, uz/en bilan bir xil ko'rinadi
const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-sans",
});

const display = Lora({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "свидание",
    "приглашение на свидание",
    "интерактивное приглашение",
    "svidaniya",
    "date invite",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: BRAND.ink,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${sans.variable} ${display.variable}`}>
      <body className="relative font-sans selection:bg-blush-500/30 selection:text-blush-200">
        <LanguageProvider>
          <AuroraBackground />
          {/* Sayt faqat desktop uchun: < 1024px da faqat ogohlantirish ko'rinadi */}
          <div className="hidden lg:contents">
            <LanguageSwitcher />
            <main className="relative z-10">{children}</main>
          </div>
          <DesktopOnlyNotice />
        </LanguageProvider>
      </body>
    </html>
  );
}
