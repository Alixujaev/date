"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";

/**
 * 1024px dan tor ekranda sayt o'rniga chiqadi. Ko'rinish faqat CSS (`lg:hidden`)
 * bilan boshqariladi — JS'da o'lchash hydration paytida miltillash beradi.
 */
export function DesktopOnlyNotice() {
  const { t } = useTranslation();

  return (
    <div
      role="alert"
      className="relative z-10 flex min-h-[100dvh] items-center justify-center px-6 text-center lg:hidden"
    >
      <p className="max-w-xs text-balance text-lg font-medium leading-relaxed text-[color:var(--text-primary)]">
        {t.desktopOnlyMessage}
      </p>
    </div>
  );
}
