# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A single-page, interactive "will you go on a date with me?" invitation (Next.js 15 App Router, React 19, TypeScript, Tailwind 3, framer-motion). It has no backend and no routes beyond `/`. **Desktop only**: below 1024px (Tailwind `lg`) the app is hidden via CSS and `DesktopOnlyNotice` shows a single message instead (see `app/layout.tsx`). Don't add touch/mobile-specific logic. Keep copy short and mostly emoji-free — the notice text and the food option icons are the intended exceptions. Code comments are written in Uzbek.

## Commands

```bash
npm run dev        # dev server at http://localhost:3000
npm run build      # production build (also the Vercel build)
npm run lint       # next lint (next/core-web-vitals)
npm run typecheck  # tsc --noEmit
```

There is no test runner or test suite. The pure modules in `lib/` (`flow.ts`, `runaway.ts`, `date.ts`, `contact.ts`) are kept free of React on purpose so they can be tested in isolation.

## Architecture

**Flow state machine.** `app/page.tsx` is a client component. It holds a single `useReducer(flowReducer)` from `lib/flow.ts` and renders one screen at a time from the `SCREENS: Record<StepId, …>` map. Steps are `welcome → when → food → finale` (`STEP_ORDER`). Navigation happens only through reducer actions (`NEXT`/`BACK`/`GOTO`/`RESET`), never through URL routing. Every screen receives the same `ScreenProps` (`state`, `dispatch`). To add a step:

1. Extend `StepId` and `STEP_ORDER`.
2. Add the step to the `SCREENS` map. TypeScript enforces this.
3. Add its strings to the translations.

**Layout.** Each screen renders inside `ScreenShell`, a centered `glass-card` whose width is `md` (`max-w-xl`) or `lg` (`max-w-3xl`, used by the two-column date/time screen and the food screen). Panels inside the card use `.inset-panel`, not `glass-card`, to avoid a second layer of blur and shadow.

**Transitions.** Screens sit inside `<AnimatePresence mode="wait" custom={state.direction}>`. `ScreenShell` applies `screenVariants` from `lib/motion.ts` (the direction-aware slide/fade, plus a fade-only path for reduced motion). While a screen is exiting, `ScreenShell` marks it `inert` (`useIsPresent`), so a fast double-click cannot dispatch `NEXT` twice. `onExitComplete` resets the scroll position. Child elements use `itemVariants(reduced)` for staggered entry. Keep all motion definitions in `lib/motion.ts` and always honour `useReducedMotion()`.

**i18n.** `lib/i18n/translations.ts` defines the `Translations` interface and `ru`/`uz`/`en` dictionaries. `ru` is the default locale. `LanguageProvider` (in `layout.tsx`) stores the choice in `localStorage` (`date_invite_lang`) and updates `<html lang>`. Components read strings through `useTranslation().t`. Some content modules (`lib/food.ts` labels, `JOKE_CARD`) have untranslated fallbacks. At render time the localized entry (e.g. `t.food.options[id]`) takes precedence over them.

**Dates.** `lib/date.ts` does everything in local time. It stores dates as ISO `yyyy-mm-dd` strings and times as `HH:mm`. It avoids `toISOString()` on purpose because of the UTC day shift. The calendar grid is always 6 weeks.

**Runaway "No" button.** `lib/runaway.ts` (`pickFleeSpot`) holds the geometry: polar candidates around the "Yes" button, clamped to bounds, with an injectable `random`. `components/ui/RunawayButton.tsx` is the React wrapper around it. It reacts only to the mouse (`mousemove` proximity plus `onMouseEnter`).

**Contact form (step 4).** `FinaleScreen` has three phases: `form`, `submitting` and `sent`. `components/ui/ContactForm.tsx` collects a name, a phone number and an optional note.

- The phone field is masked with `formatUzPhone` (`+998 XX XXX XX XX`). Validation lives in `lib/contact.ts`.
- The payload phone is normalized to `+998XXXXXXXXX`.
- `SelectionSummary` is a read-only review of the date, time and food.
- `lib/submit.ts` (`submitInvite`) is the only client entry point. It POSTs the payload to `app/api/submit-invite/route.ts` and throws on any failure. `FinaleScreen` then shows `t.finale.submitError`, and the submit button turns into a retry button.
- The route never trusts the client. It re-validates the body with `parseContactPayload` (`lib/contact.ts`) and builds an HTML message with `formatInviteMessage` (`lib/telegram.ts`), which always uses Uzbek labels and escapes user text. It then calls the Telegram `sendMessage` API with a 10s timeout.
- Error codes: `invalid_payload` (400), `not_configured` (500) and `telegram_failed` (502).
- Server-only env vars: `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. See `.env.local.example`. On Vercel they must be added under Project Settings → Environment Variables. Never expose them via `NEXT_PUBLIC_`.

**Metadata and deploy.** `lib/site.ts` is the source of truth for the site name, title, description, OG size and brand colours. Brand colours are duplicated in `tailwind.config.ts`, so keep the two in sync. `SITE.url` resolves in this order:

1. `NEXT_PUBLIC_SITE_URL`
2. `VERCEL_PROJECT_PRODUCTION_URL`
3. `VERCEL_URL`
4. `http://localhost:3000`

It feeds `metadataBase`, so OG image URLs are absolute on Vercel with no extra config. The favicon (`ICON_SIZES`), Apple icon and OG/Twitter images are generated in code (`app/icon.tsx`, `app/apple-icon.tsx`, `app/opengraph-image.tsx`, `app/twitter-image.tsx`, via `next/og`). At build time the OG image fetches the Manrope font from Google Fonts (`lib/og-font.ts`). If the fetch fails, it falls back to the default font. The site is set to `robots: noindex`.

## Styling

Tailwind is extended with custom palettes (`ink`, `plum`, `blush`, `ember`), a `font-display` font (Lora) and a `font-sans` font (Manrope), both loaded via `next/font` CSS variables. Both fonts must include the `cyrillic` subset, because the default locale is Russian. Shared classes such as `glass-card` and CSS variables such as `--text-primary` live in `app/globals.css`.
