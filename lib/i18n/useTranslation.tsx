"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  type Locale,
  LOCALES,
  translations,
  type Translations,
} from "./translations";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "date_invite_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Standart til — rus tili ("ru")
  const [locale, setLocaleState] = useState<Locale>("ru");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && LOCALES.includes(saved)) {
        setLocaleState(saved);
        document.documentElement.lang = saved;
      } else {
        document.documentElement.lang = "ru";
      }
    } catch {
      // localStorage xatolarini (masalan, private mode) xavfsiz o'tkazib yuborish
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
    } catch {
      // ignore
    }
  };

  const t = translations[locale];

  // Tab sarlavhasi tanlangan tilga mos bo'lsin (OG/meta esa server'da rus tilida qoladi)
  useEffect(() => {
    document.title = t.pageTitle;
  }, [t.pageTitle]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Agar kontekstdan tashqarida chaqirilsa, fallback sifatida ruscha tarjimani qaytaramiz
    return {
      locale: "ru" as Locale,
      setLocale: () => {},
      t: translations.ru,
    };
  }
  return context;
}
