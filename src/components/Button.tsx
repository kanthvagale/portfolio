import type { ComponentPropsWithoutRef, ElementType } from "react";

type ButtonVariant = "primary" | "secondary" | "inverted";

type ButtonProps<T extends ElementType> = {
  variant?: ButtonVariant;
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "variant">;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-paper hover:bg-ink/85 hover:-translate-y-0.5 hover:shadow-lg",
  secondary:
    "border border-ink/15 text-ink hover:border-ink/40 hover:-translate-y-0.5 hover:shadow-md",
  inverted:
    "bg-paper text-ink hover:bg-paper/90 hover:-translate-y-0.5 hover:shadow-lg",
};

export default function Button<T extends ElementType = "button">(allProps: ButtonProps<T>) {
  const { variant = "primary", as, className, ...rest } = allProps as ButtonProps<T> & {
    className?: string;
  };
  const Component = (as ?? "button") as ElementType;

  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 ${variantClasses[variant]} ${className ?? ""}`}
      {...rest}
    />
  );
}
