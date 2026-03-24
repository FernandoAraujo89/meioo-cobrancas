"use client";

import { useState } from "react";
import {
  Home,
  Package,
  Receipt,
  FileText,
  ArrowDownCircle,
  DollarSign,
  BarChart2,
  ShoppingCart,
  Truck,
  Users,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { MEIOO_ICON_PATH, MEIOO_ICON_VB } from "./MeiooIcon";

interface NavItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  children?: { label: string; active?: boolean; meioo?: boolean; hasChildren?: boolean }[];
}

const navItems: NavItem[] = [
  { icon: Home, label: "Página Inicial" },
  { icon: Users, label: "Meus Cadastros" },
  { icon: ShoppingCart, label: "Faturamento" },
  { icon: FileText, label: "NFCe" },
  { icon: ArrowDownCircle, label: "Entrada de Nota" },
  { icon: Receipt, label: "Documentos Recebidos" },
  {
    icon: DollarSign,
    label: "Financeiro",
    active: true,
    children: [
      { label: "Contas a Receber", active: true, meioo: true },
      { label: "Contas a Pagar" },
      { label: "Cobranças Bancárias", meioo: true, hasChildren: true },
      { label: "Extratos Bancários" },
      { label: "Relatórios" },
    ],
  },
  { icon: Package, label: "Estoque" },
  { icon: Truck, label: "Produção" },
  { icon: BarChart2, label: "Relatórios" },
];

interface AvanteSidebarProps {
  onAbrirMeioo?: () => void;
}

export function AvanteSidebar({ onAbrirMeioo }: AvanteSidebarProps) {
  const [flyoutItem, setFlyoutItem] = useState<NavItem | null>(null);

  function handleIconClick(item: NavItem) {
    if (item.children) {
      setFlyoutItem(flyoutItem?.label === item.label ? null : item);
    }
  }

  return (
    <div className="flex shrink-0 h-full relative">
      {/* Icon rail — always visible, 56px */}
      <aside className="w-14 bg-surface border-r border-border flex flex-col shrink-0 z-20">
        <nav className="flex-1 overflow-y-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isOpen = flyoutItem?.label === item.label;

            return (
              <button
                key={item.label}
                onClick={() => handleIconClick(item)}
                className={`w-full flex items-center justify-center py-3 transition-colors hover:bg-bg relative
                  ${item.active || isOpen ? "text-primary" : "text-muted hover:text-dark"}`}
                title={item.label}
              >
                {(item.active || isOpen) && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                )}
                <Icon size={18} />
              </button>
            );
          })}
        </nav>

        {/* Meioo footer */}
        <div className="shrink-0 border-t border-border">
          <button
            onClick={onAbrirMeioo}
            className="w-full flex items-center justify-center py-3 hover:bg-bg transition-colors group"
            title="Meioo — Conta Digital Avante"
          >
            <div
              className="flex items-center justify-center rounded-[3px] bg-dark group-hover:bg-primary transition-colors shrink-0"
              style={{ width: 20, height: 14 }}
            >
              <svg viewBox={MEIOO_ICON_VB} width={15} height={11} fill="none" aria-hidden>
                <path d={MEIOO_ICON_PATH} fill="white" />
              </svg>
            </div>
          </button>
        </div>
      </aside>

      {/* Flyout panel — sub-navigation */}
      {flyoutItem && flyoutItem.children && (
        <>
          {/* Backdrop to close flyout */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setFlyoutItem(null)}
          />

          <div
            className="absolute left-14 top-0 h-full bg-surface border-r border-border z-20 shadow-panel"
            style={{ width: 280 }}
          >
            {/* Flyout header */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
              {(() => {
                const FlyIcon = flyoutItem.icon;
                return <FlyIcon size={18} className="text-primary shrink-0" />;
              })()}
              <span className="text-sm font-bold text-dark flex-1">{flyoutItem.label}</span>
              <button
                onClick={() => setFlyoutItem(null)}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-bg text-muted hover:text-dark transition-colors"
              >
                <ArrowLeft size={15} />
              </button>
            </div>

            {/* Divider line */}
            <div className="mx-4 border-b border-primary/30" />

            {/* Sub-items */}
            <nav className="py-2">
              {flyoutItem.children.map((child) => (
                <button
                  key={child.label}
                  className={`w-full flex items-center gap-2 px-5 py-3 text-sm transition-colors hover:bg-bg text-left
                    ${child.active ? "text-primary font-semibold" : "text-dark/70 hover:text-dark"}`}
                >
                  <span className="flex-1">{child.label}</span>
                  {child.meioo && (
                    <span
                      className="inline-flex items-center justify-center rounded-[2px] bg-dark shrink-0"
                      style={{ width: 12, height: 9 }}
                      title="Integrado com Meioo"
                    >
                      <svg viewBox={MEIOO_ICON_VB} width={9} height={7} fill="none" aria-hidden>
                        <path d={MEIOO_ICON_PATH} fill="white" />
                      </svg>
                    </span>
                  )}
                  {child.hasChildren && (
                    <ChevronRight size={14} className="text-muted shrink-0" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
