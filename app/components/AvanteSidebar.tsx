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
  ChevronDown,
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  children?: { label: string; active?: boolean; meioo?: boolean }[];
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
      { label: "Cobranças Bancárias", meioo: true },
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
  const [expanded, setExpanded] = useState<string>("Financeiro");

  return (
    <aside className="w-[200px] bg-surface border-r border-border flex flex-col shrink-0 overflow-hidden">
      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isExpanded = expanded === item.label;

          return (
            <div key={item.label}>
              <button
                onClick={() =>
                  item.children && setExpanded(isExpanded ? "" : item.label)
                }
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-colors hover:bg-bg text-left
                  ${item.active ? "text-primary" : "text-dark/70 hover:text-dark"}`}
              >
                <Icon
                  size={15}
                  className={item.active ? "text-primary" : "text-muted"}
                />
                <span className="flex-1">{item.label}</span>
                {item.children &&
                  (isExpanded ? (
                    <ChevronDown size={12} className="text-muted" />
                  ) : (
                    <ChevronRight size={12} className="text-muted" />
                  ))}
              </button>

              {item.children && isExpanded && (
                <div className="bg-bg/60">
                  {item.children.map((child) => (
                    <button
                      key={child.label}
                      className={`w-full flex items-center gap-2 pl-10 pr-3 py-2 text-xs transition-colors hover:bg-bg text-left
                        ${child.active ? "text-primary font-semibold" : "text-dark/60 hover:text-dark"}`}
                    >
                      {child.active && (
                        <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                      )}
                      <span className={`flex-1 ${child.active ? "" : "pl-3"}`}>
                        {child.label}
                      </span>
                      {child.meioo && (
                        <span
                          className="inline-flex items-center justify-center rounded-[2px] bg-dark text-white font-black leading-none shrink-0"
                          style={{ width: 12, height: 9, fontSize: 6 }}
                          title="Integrado com Meioo"
                        >
                          o
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Divisor + Ícone Meioo fixo no rodapé */}
      <div className="shrink-0 border-t border-border">
        <button
          onClick={onAbrirMeioo}
          className="w-full flex items-center gap-2.5 px-4 py-3.5 hover:bg-bg transition-colors group"
          title="Meioo — Conta Digital Avante"
        >
          {/* Ícone retangular Meioo */}
          <div
            className="flex items-center justify-center rounded-[3px] bg-dark group-hover:bg-primary transition-colors font-black text-white leading-none shrink-0"
            style={{ width: 20, height: 14, fontSize: 9 }}
          >
            o
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs font-semibold text-dark group-hover:text-primary transition-colors leading-tight">
              Meioo
            </p>
            <p className="text-[10px] text-muted leading-tight">Conta Digital</p>
          </div>
          {/* Indicador de saldo */}
          <div className="text-right">
            <p className="text-[10px] font-semibold text-dark leading-tight">R$ 1.849</p>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 ml-auto mt-0.5" />
          </div>
        </button>
      </div>
    </aside>
  );
}
