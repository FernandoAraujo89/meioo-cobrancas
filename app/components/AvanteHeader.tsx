"use client";

import { Bell, Search, ChevronDown, HelpCircle } from "lucide-react";
import { useMeiooTour } from "./MeiooOnboarding";

// Avante logo SVG paths (from logo_avante.svg)
const AVANTE_PATHS = [
  "M27.6326 36.4399H19.6085C18.7204 36.4399 18.0002 35.723 18.0002 34.839V34.2883C18.0002 33.4039 18.7204 32.687 19.6085 32.687H27.6326C28.5206 32.687 29.2407 33.4039 29.2407 34.2883V34.839C29.2407 35.723 28.5206 36.4399 27.6326 36.4399Z",
  "M30.8628 29.4477H22.8387C21.9507 29.4477 21.2305 28.7309 21.2305 27.847V27.2957C21.2305 26.4118 21.9507 25.6949 22.8387 25.6949H30.8628C31.7509 25.6949 32.471 26.4118 32.471 27.2957V27.847C32.471 28.7309 31.7509 29.4477 30.8628 29.4477Z",
  "M30.8628 42.881H22.8387C21.9507 42.881 21.2305 42.1641 21.2305 41.2803C21.2305 40.3963 21.9507 39.6794 22.8387 39.6794H30.8628C31.7509 39.6794 32.471 40.3963 32.471 41.2803C32.471 42.1641 31.7509 42.881 30.8628 42.881Z",
  "M47.5875 37.2214C47.5875 38.5029 47.3041 39.4463 46.7373 40.0511C46.1704 40.6564 45.2794 40.9588 44.0652 40.9588C43.0661 40.9588 42.2971 40.7575 41.7572 40.3541C41.2168 39.9505 40.9474 39.357 40.9474 38.5743C40.9474 37.791 41.2512 37.1922 41.8588 36.7762C42.466 36.3612 43.3225 36.1536 44.4292 36.1536H47.5875V37.2214ZM49.9357 27.5212C48.5591 26.3467 46.5614 25.7593 43.9436 25.7593C41.6218 25.7593 39.5713 26.317 37.7897 27.4324C37.7897 28.2668 38.0218 29.0461 38.4223 29.7133L38.6803 30.0663C39.0309 30.5174 39.4632 30.5769 39.9762 30.2443C40.4887 29.9121 41.0489 29.6395 41.6561 29.4258C42.2632 29.2121 42.8908 29.1056 43.5387 29.1056C44.9417 29.1056 45.9678 29.4139 46.6157 30.0311C47.2636 30.6483 47.5875 31.6681 47.5875 33.0923V33.2703H43.8221C41.4469 33.2703 39.638 33.7387 38.3973 34.6763C37.1552 35.6142 36.5347 36.9487 36.5347 38.6809C36.5347 40.5087 37.1756 41.9022 38.4576 42.8635C39.7396 43.8247 41.6088 44.3051 44.0652 44.3051C46.656 44.3051 48.6259 43.7236 49.976 42.5611C51.3253 41.3985 52.0002 39.7254 52.0002 37.5416V32.8073C52.0002 30.4579 51.3118 28.6961 49.9357 27.5212Z",
];

export function AvanteHeader() {
  const { startTour } = useMeiooTour();

  function handleRestartTour() {
    localStorage.removeItem("meioo_tour_v3");
    startTour();
  }

  return (
    <header className="h-14 bg-surface border-b border-border flex items-center px-0 shrink-0 z-10">
      {/* Logo — fills the entire sidebar column */}
      <div className="h-14 w-14 flex items-center justify-center shrink-0" style={{ background: "#2C6EFF" }}>
        <svg viewBox="0 0 70 70" width={30} height={30} fill="none">
          {AVANTE_PATHS.map((d, i) => (
            <path key={i} d={d} fill="white" />
          ))}
        </svg>
      </div>

      {/* Header content */}
      <div className="flex-1 flex items-center justify-between px-3 sm:px-5 min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="font-semibold text-dark text-sm tracking-tight hidden sm:block">Avante Web</span>
          <div className="relative hidden sm:block ml-0 sm:ml-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
            <input
              className="w-44 sm:w-56 pl-8 pr-3 h-8 rounded bg-bg border border-border text-xs text-dark placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              placeholder="Buscar..."
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleRestartTour}
            title="Reiniciar tour Meioo"
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-bg text-muted hover:text-dark transition-colors"
          >
            <HelpCircle size={16} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-bg text-muted hover:text-dark transition-colors relative">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
          </button>
          <div className="flex items-center gap-1.5 sm:gap-2 pl-2 sm:pl-3 border-l border-border cursor-pointer hover:opacity-80">
            <div className="w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
              FA
            </div>
            <span className="text-xs font-medium text-dark hidden sm:block">Fernando</span>
            <ChevronDown size={12} className="text-muted hidden sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
}
