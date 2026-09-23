"use client";

import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { fleeTransition } from "@/lib/motion";
import { clampSpot, pickFleeSpot, type Bounds, type Point, type Size } from "@/lib/runaway";

/** Kursor shu masofaga yaqinlashsa — qochadi. */
const FLEE_RADIUS = 110;
/** Ketma-ket sakrashlar orasidagi eng kichik tanaffus (ms) — titrashning oldini oladi. */
const COOLDOWN = 200;
/** Viewport cheti bilan bo'shliq. */
const PAD = 16;
/** Tepada til tanlagich va tugma ustidagi taunt pufakchasi uchun joy. */
const TOP_RESERVE = 88;
/** Pastda StepDots uchun ajratilgan joy. */
const BOTTOM_RESERVE = 80;

const FLEE_GEOMETRY = {
  minRadius: 96,
  maxRadius: 280,
  pointerSafe: 120,
  minTravel: 80,
} as const;

/** Undov yozuvi screen kirib bo'lgandan keyin paydo bo'lsin (s). */
const HINT_DELAY = 0.9;

/** Har nechanchi qochishda kulgili matn chiqsin. */
const TAUNT_EVERY = 2;
const TAUNT_DURATION = 1600;

interface RunawayButtonProps {
  children: React.ReactNode;
  /** "Ha" / "Да" tugmasi — undan uzoqlashmaslik uchun o'lchanadi. */
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  /** Har qochganda chaqiriladi — reducer'dagi `NO_ATTEMPT`. */
  onFlee: () => void;
  /** `state.noAttempts` — taunt chastotasini hisoblash uchun. */
  fleeCount: number;
}

export function RunawayButton({
  children,
  anchorRef,
  onFlee,
  fleeCount,
}: RunawayButtonProps) {
  const { t } = useTranslation();
  const reduced = useReducedMotion() ?? false;

  const dockRef = useRef<HTMLSpanElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const [taunt, setTaunt] = useState<string | null>(null);

  const dockOriginRef = useRef<Point>({ x: 0, y: 0 });
  const sizeRef = useRef<Size>({ width: 0, height: 0 });
  const lastFleeRef = useRef(0);
  const tauntTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fleeCountRef = useRef(fleeCount);

  fleeCountRef.current = fleeCount;

  const measure = useCallback(() => {
    const dock = dockRef.current;
    if (!dock) return;
    const rect = dock.getBoundingClientRect();
    dockOriginRef.current = { x: rect.left, y: rect.top };
    sizeRef.current = { width: rect.width, height: rect.height };
  }, []);

  const currentBounds = useCallback((): Bounds => {
    const { width, height } = sizeRef.current;
    return {
      minX: PAD,
      maxX: Math.max(window.innerWidth - width - PAD, PAD),
      minY: TOP_RESERVE,
      maxY: Math.max(window.innerHeight - height - BOTTOM_RESERVE, TOP_RESERVE),
    };
  }, []);

  const flee = useCallback(
    (pointer: Point | null) => {
      const now = performance.now();
      if (now - lastFleeRef.current < COOLDOWN) return;
      lastFleeRef.current = now;

      measure();
      const dockOrigin = dockOriginRef.current;
      const size = sizeRef.current;
      if (size.width === 0) return;

      const anchorRect = anchorRef.current?.getBoundingClientRect();
      const anchor: Point = anchorRect
        ? {
            x: anchorRect.left + anchorRect.width / 2,
            y: anchorRect.top + anchorRect.height / 2,
          }
        : {
            x: dockOrigin.x + size.width / 2,
            y: dockOrigin.y + size.height / 2,
          };

      const spot = pickFleeSpot({
        ...FLEE_GEOMETRY,
        bounds: currentBounds(),
        size,
        anchor,
        pointer,
        current: { x: dockOrigin.x + x.get(), y: dockOrigin.y + y.get() },
      });

      const transition = fleeTransition(reduced);
      animate(x, spot.x - dockOrigin.x, transition);
      animate(y, spot.y - dockOrigin.y, transition);

      const next = fleeCountRef.current + 1;
      if (next % TAUNT_EVERY === 0) {
        const taunts = t.welcome.taunts;
        setTaunt(taunts[Math.floor(Math.random() * taunts.length)]);
        if (tauntTimerRef.current) clearTimeout(tauntTimerRef.current);
        tauntTimerRef.current = setTimeout(() => setTaunt(null), TAUNT_DURATION);
      }

      onFlee();
    },
    [anchorRef, currentBounds, measure, onFlee, reduced, t.welcome.taunts, x, y],
  );

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  // Sichqoncha tugmaga yaqinlashishi bilan qochadi — ustiga yetib borishga ulgurmaydi
  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const { width, height } = sizeRef.current;
      if (width === 0) return;

      const dx = event.clientX - (dockOriginRef.current.x + x.get() + width / 2);
      const dy = event.clientY - (dockOriginRef.current.y + y.get() + height / 2);

      if (Math.hypot(dx, dy) < FLEE_RADIUS) {
        flee({ x: event.clientX, y: event.clientY });
      }
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [flee, x, y]);

  // Ekran o'lchami o'zgarsa — chegaradan chiqib ketmaslik
  useEffect(() => {
    const handleResize = () => {
      measure();
      const dockOrigin = dockOriginRef.current;
      const spot = clampSpot(
        { x: dockOrigin.x + x.get(), y: dockOrigin.y + y.get() },
        currentBounds(),
      );
      x.set(spot.x - dockOrigin.x);
      y.set(spot.y - dockOrigin.y);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentBounds, measure, x, y]);

  useEffect(() => {
    return () => {
      if (tauntTimerRef.current) clearTimeout(tauntTimerRef.current);
    };
  }, []);

  return (
    <span ref={dockRef} className="relative z-30 inline-flex">
      {/* Ko'rinmas nusxa joyni ushlab turadi — layout siljimaydi */}
      <Button variant="ghost" aria-hidden tabIndex={-1} className="invisible min-w-[7.5rem]">
        {children}
      </Button>

      <motion.div className="absolute left-0 top-0" style={{ x, y }} inherit={false}>
        <span className="relative flex w-fit">
          <Button
            variant="ghost"
            className="min-w-[7.5rem]"
            aria-label={t.welcome.noAriaLabel}
            // Tez harakatda mousemove radiusni "sakrab o'tsa" ham — ustiga kelgan zahoti qochadi
            onMouseEnter={(event) => flee({ x: event.clientX, y: event.clientY })}
          >
            {children}
          </Button>

          <span
            aria-live="polite"
            className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max -translate-x-1/2"
          >
            <AnimatePresence mode="wait">
              {/* Hali birorta ham qochmagan bo'lsa — bosishga undaydi; keyin taunt'lar ishlaydi */}
              {!taunt && fleeCount === 0 && (
                <motion.span
                  key="hint"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: HINT_DELAY, duration: 0.3 } }}
                  exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
                  className="flex flex-col items-center text-xs font-medium text-blush-300"
                >
                  <span className="rounded-full border border-blush-400/30 bg-blush-500/10 px-3 py-1 backdrop-blur-sm">
                    {t.welcome.noHint}
                  </span>
                  <motion.span
                    aria-hidden
                    className="mt-0.5 leading-none"
                    animate={reduced ? undefined : { y: [0, 3, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ↓
                  </motion.span>
                </motion.span>
              )}
              {taunt && (
                <motion.span
                  key={taunt}
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="block rounded-full border border-white/10 bg-ink-800/90 px-3 py-1 text-xs font-medium text-blush-300 shadow-card backdrop-blur-sm"
                >
                  {taunt}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </span>
      </motion.div>
    </span>
  );
}
