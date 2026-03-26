"use client";

// New Meioo icon — square 59.02×59.02 with rounded-corner bg path
const BG_PATH =
  "M46.92,59.02H12.1c-6.68,0-12.1-5.42-12.1-12.1V12.1C0,5.42,5.42,0,12.1,0h34.82c6.68,0,12.1,5.42,12.1,12.1v34.82c0,6.68-5.42,12.1-12.1,12.1";
const INNER_PATH =
  "M14.28,18.77v21.91c0,.47.38.85.85.85h30.43c.47,0,.85-.38.85-.85v-21.91c0-.47-.38-.85-.85-.85H15.13c-.47,0-.85.38-.85.85M42.19,37.7h-23.68v-15.95h23.68v15.95Z";
const VB = "0 0 59.02 59.02";

interface MeiooIconProps {
  size?: number;
  className?: string;
  variant?: "default" | "badge";
}

export function MeiooIcon({ size = 16, className = "", variant = "default" }: MeiooIconProps) {
  // The new icon is self-contained: outer path = dark rounded-rect bg, inner path = white icon
  return (
    <svg
      viewBox={VB}
      width={size}
      height={size}
      fill="none"
      className={`select-none shrink-0 ${className}`}
      aria-label="Meioo"
      aria-hidden
    >
      <path d={BG_PATH} fill="#17191E" />
      <path d={INNER_PATH} fill="white" />
    </svg>
  );
}

// Exports for inline SVG use in other components
export const MEIOO_ICON_BG_PATH = BG_PATH;
export const MEIOO_ICON_PATH = INNER_PATH;
export const MEIOO_ICON_VB = VB;
