"use client";

import { useEffect, useRef } from "react";

export function VisitTracker() {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;

    try {
      // Bir brauzer sessiyasi (tab ochiq turganda) ichida qayta-qayta Telegram'ga yozmaslik
      const SESSION_KEY = "date_invite_session_tracked";
      if (sessionStorage.getItem(SESSION_KEY)) {
        return;
      }

      // Qurilma bo'yicha jami necha marta kirilganini hisoblash
      const LOCAL_KEY = "date_invite_visit_count";
      const previousCount = parseInt(localStorage.getItem(LOCAL_KEY) || "0", 10);
      const currentCount = previousCount + 1;
      localStorage.setItem(LOCAL_KEY, String(currentCount));

      // Joriy sessiyani belgilab qo'yish
      sessionStorage.setItem(SESSION_KEY, "true");

      const payload = {
        visitCount: currentCount,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        isMobile: window.innerWidth < 1024,
        referrer: document.referrer || "direct",
        language: navigator.language || "unknown",
      };

      fetch("/api/track-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => {
        console.warn("[VisitTracker] Track visit xatosi:", err);
      });
    } catch {
      // Brauzer xavfsizlik cheklovlari yoki private browsing holatida xatolik chiqmasligi uchun
    }
  }, []);

  return null;
}
