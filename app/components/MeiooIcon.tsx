"use client";

interface MeiooIconProps {
  size?: number;
  className?: string;
  variant?: "default" | "badge";
}

export function MeiooIcon({ size = 16, className = "", variant = "default" }: MeiooIconProps) {
  if (variant === "badge") {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-[3px] bg-dark text-white font-bold leading-none select-none ${className}`}
        style={{ width: size, height: size * 0.72, fontSize: size * 0.52 }}
        title="Meioo"
      >
        o
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-[3px] border-2 border-dark text-dark font-bold leading-none select-none ${className}`}
      style={{ width: size, height: size * 0.72, fontSize: size * 0.52 }}
      title="Meioo"
    >
      o
    </span>
  );
}
