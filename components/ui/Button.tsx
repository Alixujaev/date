"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

export type ButtonVariant = "primary" | "ghost";

// HTMLMotionProps — motion o'z animatsiya proplarini DOM event handlerlari bilan
// to'qnashtirmasligi uchun (onAnimationStart va h.k.).
// `children` motion'da MotionValue ham bo'lishi mumkin — spinner yonida faqat ReactNode kerak.
type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  /**
   * Jarayon ketyapti: tugma bosilmaydi, lekin `disabled` kabi xiralashmaydi —
   * spinner ko'rinadi va `aria-busy` qo'yiladi.
   */
  loading?: boolean;
  /** React 19 da `ref` oddiy prop — destrukturatsiya qilinmay `...props` orqali o'tadi. */
  ref?: React.Ref<HTMLButtonElement>;
};

// `transition-all` ataylab ishlatilmaydi: CSS transform transition'i framer-motion
// har kadrda yozadigan inline transform bilan to'qnashib, hover/tap'ni "sudraydi".
const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 text-base font-semibold tracking-tight select-none transition-[background-color,border-color,color,opacity,box-shadow,filter] duration-200 disabled:cursor-not-allowed disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-blush-500 via-blush-400 to-plum-400 text-ink-900 shadow-glow hover:from-blush-400 hover:to-plum-300 active:brightness-95",
  ghost:
    "border border-white/15 bg-white/[0.04] text-[color:var(--text-primary)] backdrop-blur-sm hover:bg-white/[0.09] active:bg-white/[0.12]",
};

const spinnerColor: Record<ButtonVariant, string> = {
  primary: "border-ink-900/30 border-t-ink-900",
  ghost: "border-white/25 border-t-white",
};

export function Button({
  variant = "primary",
  fullWidth = false,
  loading = false,
  className = "",
  type = "button",
  disabled = false,
  children,
  ...props
}: ButtonProps) {
  const reduced = useReducedMotion() ?? false;
  const inactive = disabled || loading;
  const isInteractive = !reduced && !inactive;

  return (
    <motion.button
      type={type}
      disabled={inactive}
      aria-busy={loading || undefined}
      whileHover={isInteractive ? { scale: 1.03, y: -2 } : undefined}
      whileTap={isInteractive ? { scale: 0.97 } : undefined}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      className={`${base} ${variants[variant]} ${
        disabled && !loading ? "opacity-40" : ""
      } ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {loading && (
        <span
          aria-hidden
          className={`h-4 w-4 shrink-0 animate-spin rounded-full border-2 ${spinnerColor[variant]}`}
        />
      )}
      {children}
    </motion.button>
  );
}
