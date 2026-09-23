/** 3-bosqichdagi ovqat variantlari. Kontent — React yo'q. */

export interface FoodOption {
  /** State'da shu `id` saqlanadi. */
  id: string;
  emoji: string;
  label: string;
  hint: string;
}

export const FOOD_OPTIONS: readonly FoodOption[] = [
  { id: "pizza", emoji: "🍕", label: "Pitsa", hint: "Klassika, xato yoʻq" },
  { id: "sushi", emoji: "🍣", label: "Sushi", hint: "Nozik taʼm" },
  { id: "burger", emoji: "🍔", label: "Burger", hint: "Tez va mazali" },
  { id: "coffee", emoji: "☕", label: "Kafe", hint: "Gaplashish uchun" },
  { id: "national", emoji: "🍜", label: "Milliy taom", hint: "Osh, somsa, lagʻmon" },
  { id: "dessert", emoji: "🍰", label: "Shirinlik", hint: "Toʻgʻri desertga" },
] as const;

export function findFood(id: string | null): FoodOption | undefined {
  return id === null ? undefined : FOOD_OPTIONS.find((option) => option.id === id);
}
