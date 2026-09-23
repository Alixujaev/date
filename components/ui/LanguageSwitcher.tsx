"use client";

import { motion } from "framer-motion";
import { type Locale, LOCALES, LOCALE_LABELS } from "@/lib/i18n/translations";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <aside
      aria-label="Language selector"
      className="fixed right-6 top-6 z-40"
    >
      <div className="flex items-center gap-1 rounded-full border border-white/15 bg-ink-900/70 p-1 shadow-card backdrop-blur-md">
        {LOCALES.map((lang: Locale) => {
          const isActive = locale === lang;

          return (
            <button
              key={lang}
              type="button"
              onClick={() => setLocale(lang)}
              aria-pressed={isActive}
              className={`relative rounded-full px-2.5 py-1 text-xs font-semibold tracking-wider transition-colors ${
                isActive
                  ? "text-ink-900"
                  : "text-muted hover:bg-white/[0.08] hover:text-[color:var(--text-primary)]"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="active-lang-pill"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blush-400 via-blush-300 to-plum-300 shadow-glow"
                />
              )}
              <span className="relative z-10">{LOCALE_LABELS[lang]}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
