"use client";

import { Bell, Search, ChevronDown, HelpCircle } from "lucide-react";

export function AvanteHeader() {
  return (
    <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-6 shrink-0 z-10">
      {/* Logo Avante */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-lg font-bold text-white text-sm"
          style={{ width: 32, height: 32, background: "#2c6eff" }}
        >
          A
        </div>
        <span className="font-semibold text-dark text-base tracking-tight">
          Avante Web
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xs mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
          <input
            className="w-full pl-8 pr-3 h-8 rounded bg-bg border border-border text-xs text-dark placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            placeholder="Buscar..."
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-bg text-muted hover:text-dark transition-colors">
          <HelpCircle size={16} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-bg text-muted hover:text-dark transition-colors relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-border cursor-pointer hover:opacity-80">
          <div className="w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center">
            FA
          </div>
          <span className="text-xs font-medium text-dark">Fernando</span>
          <ChevronDown size={12} className="text-muted" />
        </div>
      </div>
    </header>
  );
}
