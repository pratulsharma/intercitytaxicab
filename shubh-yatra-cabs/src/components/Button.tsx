// WHAT: A reusable button with two looks: "primary" (main action) and "secondary" (quiet).
// WHY:  Buttons appear on every screen. One component keeps them identical and easy to restyle.
// HOW:  "variant" is a union type from Day 6, so only the allowed words compile.
//       "variant = 'primary'" is a default: if the parent doesn't pass one, primary is used.
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

// Record<ButtonVariant, string> forces an entry for EVERY variant. Add a third variant
// and forget its style, and TypeScript refuses to compile.
const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-amber-700 text-white hover:bg-amber-800",
  secondary: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
};

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant; // "?" = optional
  type?: "button" | "submit" | "reset";
};

export default function Button({ children, variant = "primary", type = "button" }: ButtonProps) {
  return (
    <button
      type={type}
      className={`w-full rounded-lg px-8 py-3 font-semibold sm:w-auto ${variantClass[variant]}`}
    >
      {children}
    </button>
  );
}