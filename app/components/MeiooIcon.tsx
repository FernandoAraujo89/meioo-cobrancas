"use client";

// Meioo logo path — frame/hollow-rect shape, viewBox 0 0 120 120
const PATH =
  "M87.8292 36.3711C90.1313 36.3711 91.9975 38.2196 91.9975 40.4999V78.5976C91.9975 80.8779 90.1313 82.7264 87.8292 82.7264H32.6946C30.3926 82.7264 28.5264 80.8779 28.5264 78.5976V40.4999C28.5264 38.2196 30.3926 36.3711 32.6946 36.3711H87.8292ZM38.1891 44.6287V74.2811H82.3347V44.6287H38.1891Z";

// Tight viewBox around the icon shape (with small padding)
const VB = "20 28 80 62";

interface MeiooIconProps {
  size?: number;
  className?: string;
  variant?: "default" | "badge";
}

export function MeiooIcon({ size = 16, className = "", variant = "default" }: MeiooIconProps) {
  if (variant === "badge") {
    // Rectangular dark badge — same proportions as before, SVG icon inside
    const w = size;
    const h = Math.round(size * 0.72);
    return (
      <span
        className={`inline-flex items-center justify-center rounded-[3px] bg-dark select-none shrink-0 ${className}`}
        style={{ width: w, height: h }}
        title="Meioo"
      >
        <svg viewBox={VB} width={w * 0.78} height={h * 0.78} fill="none" aria-hidden>
          <path d={PATH} fill="white" />
        </svg>
      </span>
    );
  }

  // Default: full circular icon (as in original SVG file)
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="none"
      className={`select-none shrink-0 ${className}`}
      aria-label="Meioo"
      aria-hidden
    >
      <circle cx="59.9053" cy="59.9053" r="59.9053" fill="#17191E" />
      <path d={PATH} fill="white" />
    </svg>
  );
}

// Exporta o path e viewBox para uso inline em outros componentes
export const MEIOO_ICON_PATH = PATH;
export const MEIOO_ICON_VB = VB;
