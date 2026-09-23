/**
 * Dekorativ fon — uchta blurlangan gradient dog'i sekin "suzadi".
 * Butunlay CSS asosida, shuning uchun server komponenti bo'lib qolaveradi.
 */
export function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,var(--bg-tint)_0%,var(--bg-base)_62%)]" />
      <div className="absolute -left-24 -top-32 h-[26rem] w-[26rem] rounded-full bg-blush-500/25 blur-[110px] animate-drift will-change-transform" />
      <div
        className="absolute -right-28 top-24 h-[24rem] w-[24rem] rounded-full bg-plum-500/25 blur-[120px] animate-drift will-change-transform"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="absolute bottom-[-8rem] left-1/4 h-[22rem] w-[22rem] rounded-full bg-ember-500/15 blur-[130px] animate-drift will-change-transform"
        style={{ animationDelay: "-12s" }}
      />
      {/* Yengil "grain" — gradientdagi banding'ni yumshatadi */}
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:3px_3px]" />
    </div>
  );
}
