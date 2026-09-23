/**
 * Sahifani darhol tepaga qaytaradi. `globals.css` dagi `scroll-behavior: smooth`
 * ni chetlab o'tadi — yangi screen kirayotganda sekin scroll ko'rinmasligi kerak.
 */
export function scrollToTopInstant(): void {
  if (typeof window === "undefined" || window.scrollY === 0) return;
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}
