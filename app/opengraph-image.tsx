import { ImageResponse } from "next/og";

import { loadGoogleFont } from "@/lib/og-font";
import { BRAND, OG_SIZE, SITE } from "@/lib/site";

export const alt = SITE.title;
export const size = OG_SIZE;
export const contentType = "image/png";

const COPY = {
  badge: "Особое приглашение",
  title: "Пойдёшь со мной на свидание?",
  description: "Один вопрос и четыре коротких шага.",
  yes: "Да",
  no: "Нет",
} as const;

const FONT = "Manrope";

export default async function Image() {
  // Faqat rasmdagi harflar yuklanadi — fayl kichik bo'ladi
  const glyphs = Object.values(COPY).join("") + COPY.badge.toUpperCase();
  const [regular, bold] = await Promise.all([
    loadGoogleFont(FONT, 500, glyphs),
    loadGoogleFont(FONT, 800, glyphs),
  ]);
  const fonts = [
    regular && { name: FONT, data: regular, weight: 500 as const, style: "normal" as const },
    bold && { name: FONT, data: bold, weight: 800 as const, style: "normal" as const },
  ].filter((font) => font !== null);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: BRAND.ink,
          position: "relative",
          overflow: "hidden",
          fontFamily: fonts.length > 0 ? FONT : "sans-serif",
        }}
      >
        {/* Glow orblari */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "550px",
            height: "550px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(248, 110, 163, 0.45) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-100px",
            width: "550px",
            height: "550px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(155, 118, 245, 0.45) 0%, transparent 70%)",
          }}
        />

        {/* Shisha karta */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "50px 70px",
            borderRadius: "36px",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 30px 80px rgba(0, 0, 0, 0.7)",
            maxWidth: "960px",
            textAlign: "center",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 24px",
              borderRadius: "9999px",
              backgroundColor: "rgba(248, 110, 163, 0.15)",
              border: "1px solid rgba(248, 110, 163, 0.35)",
              color: "#ffc2da",
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "26px",
            }}
          >
            {COPY.badge}
          </div>

          {/* Sarlavha */}
          <div
            style={{
              fontSize: "60px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#f4eefb",
              lineHeight: 1.15,
              marginBottom: "18px",
            }}
          >
            {COPY.title}
          </div>

          {/* Tavsif */}
          <div
            style={{
              fontSize: "24px",
              fontWeight: 500,
              color: "#a99cc4",
              maxWidth: "760px",
              lineHeight: 1.45,
              marginBottom: "36px",
            }}
          >
            {COPY.description}
          </div>

          {/* Tugmalar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 44px",
                borderRadius: "9999px",
                background: "linear-gradient(90deg, #f86ea3, #b99dff)",
                color: "#0b0713",
                fontSize: "22px",
                fontWeight: 700,
                boxShadow: "0 10px 30px rgba(248, 110, 163, 0.5)",
              }}
            >
              {COPY.yes}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 44px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                color: "#f4eefb",
                fontSize: "22px",
                fontWeight: 600,
              }}
            >
              {COPY.no}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    },
  );
}
