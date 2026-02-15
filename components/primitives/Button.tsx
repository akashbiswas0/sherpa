import { cn } from "@/lib/utils/cn";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button({
  label,
  onClick,
  variant = "primary",
  isLoading,
  disabled,
  fullWidth,
  type = "button",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary: "bg-green-700 text-white hover:bg-green-800 focus:ring-green-700",
    secondary:
      "border border-green-700 text-green-700 hover:bg-green-50 focus:ring-green-700",
    ghost: "text-green-700 hover:bg-green-50 focus:ring-green-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(base, variants[variant], fullWidth && "w-full")}
    >
      {isLoading ? "Loading…" : label}
    </button>
  );
}
