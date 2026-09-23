/**
 * "Qochoq" tugma uchun geometriya. Bu yerda React yo'q — sof funksiyalar,
 * shuning uchun `random` ni almashtirib deterministik tekshirish mumkin.
 * Barcha koordinatalar viewport piksellarida, nuqta = elementning top-left'i.
 */

export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface FleeConfig {
  /** Ruxsat etilgan top-left diapazoni. */
  bounds: Bounds;
  size: Size;
  /** "Ha" tugmasining markazi — undan uzoqlashmaymiz. */
  anchor: Point;
  /** Kursor. Noma'lum bo'lsa null. */
  pointer: Point | null;
  /** Tugmaning hozirgi top-left'i. */
  current: Point;
  /** "Ha" ustiga o'tirib qolmasin. */
  minRadius: number;
  /** Ikkalasi bir ekranda ko'rinib tursin. */
  maxRadius: number;
  /** Kursor tagiga tushib qolmasin. */
  pointerSafe: number;
  /** Sakrash sezilarli bo'lsin. */
  minTravel: number;
  random?: () => number;
}

const CANDIDATES = 24;

function clamp(value: number, min: number, max: number): number {
  // Chegara teskari bo'lsa (juda tor ekran) — pastki chegarani qaytaramiz.
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

export function clampSpot(spot: Point, bounds: Bounds): Point {
  return {
    x: clamp(spot.x, bounds.minX, bounds.maxX),
    y: clamp(spot.y, bounds.minY, bounds.maxY),
  };
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function centerOf(topLeft: Point, size: Size): Point {
  return {
    x: topLeft.x + size.width / 2,
    y: topLeft.y + size.height / 2,
  };
}

/**
 * Tugma sakrab boradigan yangi joyni tanlaydi.
 *
 * Nomzodlar "Ha" atrofida polyar tarzda olinadi (to'g'riburchakdan random
 * olishdan ko'ra yaxshi: tugma ankor atrofida aylanadi va radius sharti
 * konstruksiya bo'yicha bajariladi). Keyin ular chegaraga clamp qilinadi —
 * clamp radiusni buzishi mumkin, shuning uchun shartlar qayta tekshiriladi.
 */
export function pickFleeSpot(config: FleeConfig): Point {
  const {
    bounds,
    size,
    anchor,
    pointer,
    current,
    minRadius,
    maxRadius,
    pointerSafe,
    minTravel,
    random = Math.random,
  } = config;

  const spots: Point[] = [];
  const radiusSpan = Math.max(maxRadius - minRadius, 0);

  for (let i = 0; i < CANDIDATES; i += 1) {
    const angle = random() * Math.PI * 2;
    const radius = minRadius + random() * radiusSpan;

    spots.push(
      clampSpot(
        {
          x: anchor.x + Math.cos(angle) * radius - size.width / 2,
          y: anchor.y + Math.sin(angle) * radius - size.height / 2,
        },
        bounds,
      ),
    );
  }

  const valid: Point[] = [];
  let fallback = spots[0];
  let fallbackScore = -Infinity;

  for (const spot of spots) {
    const center = centerOf(spot, size);
    const fromPointer = pointer ? distance(center, pointer) : Infinity;
    const travel = distance(spot, current);

    if (
      fromPointer >= pointerSafe &&
      travel >= minTravel &&
      distance(center, anchor) <= maxRadius
    ) {
      valid.push(spot);
      continue;
    }

    // Hech biri mos kelmasa — kursordan eng uzoqdagisi, tenglikda ko'proq yurgani.
    const score = Math.min(fromPointer, 1e6) + travel * 0.25;
    if (score > fallbackScore) {
      fallbackScore = score;
      fallback = spot;
    }
  }

  if (valid.length > 0) {
    return valid[Math.min(Math.floor(random() * valid.length), valid.length - 1)];
  }

  return fallback;
}
