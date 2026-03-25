"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Package,
  Receipt,
  FileText,
  DollarSign,
  BarChart2,
  ShoppingCart,
  Truck,
  Users,
  ChevronRight,
  ArrowLeft,
  Edit,
  LayoutGrid,
  LogIn,
  Percent,
  GemIcon,
  Building2,
  Headset,
  CalendarRange,
  Settings,
} from "lucide-react";
import { MEIOO_ICON_PATH, MEIOO_ICON_VB } from "./MeiooIcon";

interface NavChild {
  label: string;
  active?: boolean;
  meioo?: boolean;
  hasChildren?: boolean;
  href?: string;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  children?: NavChild[];
}

const navItems: NavItem[] = [
  { icon: Home, label: "Página Inicial" },
  {
    icon: Edit,
    label: "Cadastros",
    children: [
      { label: "Produto", hasChildren: true },
      { label: "Participante", hasChildren: true },
      { label: "Fiscal", hasChildren: true },
      { label: "Financeiro", hasChildren: true },
      { label: "Caixa Venda", hasChildren: true },
      { label: "Usuário", hasChildren: true },
      { label: "Veículo", hasChildren: true },
      { label: "Setor", hasChildren: true },
    ],
  },
  {
    icon: BarChart2,
    label: "Faturamento",
    children: [
      { label: "Notas Fiscais Eletrônicas", hasChildren: true },
      { label: "Notas Fiscais de Serviços", hasChildren: true },
      { label: "Manifesto de Documentos", hasChildren: true },
      { label: "Conhecimento de Transporte", hasChildren: true },
      { label: "Conhecimento de Transporte - OS", hasChildren: true },
      { label: "Orçamento", hasChildren: true },
      { label: "Condicional", hasChildren: true },
      { label: "Pedido de Venda", hasChildren: true },
      { label: "Ordem de Serviço", hasChildren: true },
      { label: "Venda Futura/Retiradas", hasChildren: true },
      { label: "Venda Externa/Retornos", hasChildren: true },
      { label: "Geração/Reajuste Contrato", hasChildren: true },
      { label: "Romaneio de Carga/Entrega", hasChildren: true },
      { label: "Importação XML NFe/NFCe/CTe", hasChildren: true },
    ],
  },
  {
    icon: LayoutGrid,
    label: "PDV",
    children: [
      { label: "Caixa", hasChildren: true },
      { label: "Vendas", hasChildren: true },
      { label: "Configuração", hasChildren: true },
    ],
  },
  {
    icon: LogIn,
    label: "Entrada de Nota",
    children: [
      { label: "Cadastrar" },
      { label: "Consultar" },
      { label: "Importação XML" },
      { label: "Tributação NFe Entrada", hasChildren: true },
    ],
  },
  {
    icon: Receipt,
    label: "Documentos Recebidos",
    children: [
      { label: "Consulta de NFe's Recebidas" },
      { label: "Consultar Documentos Recebidos" },
      { label: "Importação NFe's Recebidas" },
      { label: "Importação CTe's Recebidos" },
      { label: "Eventos Vinculados as NFe's" },
      { label: "Manifestação NFe's por Usuário" },
    ],
  },
  {
    icon: DollarSign,
    label: "Financeiro",
    active: true,
    children: [
      { label: "Caixa", hasChildren: true },
      { label: "Lançamento Financeiro" },
      { label: "Consultar Lançamentos" },
      { label: "Recebimentos de Cartões" },
      { label: "Lançamentos Recorrentes" },
      { label: "Contas em Aberto de Clientes" },
      { label: "Contas em Aberto por Documentos" },
      { label: "Boletos", hasChildren: true },
      { label: "Custo Fixo", hasChildren: true },
      { label: "Extrato Bancário", hasChildren: true },
      { label: "Controle de Cheques" },
      { label: "Movimentação entre Contas" },
      { label: "Consultar Transações/Integrações" },
      { label: "divider" },
      { label: "Contas a Receber", active: true, meioo: true, href: "/financeiro/contas-a-receber" },
      { label: "Contas a Pagar", meioo: true, href: "/financeiro/contas-a-pagar" },
      { label: "Cobranças Bancárias", meioo: true, hasChildren: true },
    ],
  },
  {
    icon: ShoppingCart,
    label: "Pedido de Compra",
    children: [
      { label: "Cadastrar" },
      { label: "Consultar" },
      { label: "Cotação", hasChildren: true },
    ],
  },
  {
    icon: Settings,
    label: "Assinador",
    children: [
      { label: "Painel de Assinaturas" },
    ],
  },
  {
    icon: CalendarRange,
    label: "Agenda",
    children: [
      { label: "Agenda de Compromissos" },
      { label: "Agenda de Cobranças" },
    ],
  },
  {
    icon: Percent,
    label: "Fiscal",
    children: [
      { label: "Lançamentos", hasChildren: true },
      { label: "Arquivos Fiscais", hasChildren: true },
      { label: "Registro de Inventário", hasChildren: true },
      { label: "Gestão de Documentos" },
    ],
  },
  {
    icon: GemIcon,
    label: "Estoque",
    children: [
      { label: "Entradas" },
      { label: "Entradas e Saídas" },
      { label: "Entradas e Saídas Detalhado" },
      { label: "Curva ABC" },
      { label: "Últimas Vendas" },
      { label: "Estoque Sintético" },
      { label: "Lucro de Estoque" },
      { label: "Tabela de Preços" },
      { label: "Giro de Mercadorias" },
      { label: "Quantidade em Estoque" },
      { label: "Estoque por Localização" },
      { label: "Estoque Mínimo/Máximo" },
      { label: "Posição Atual do Estoque" },
      { label: "Ajuste de Estoque em Lote" },
      { label: "Ajuste de Estoque por Produto" },
      { label: "Quantidade em Estoque/Grade" },
      { label: "Contagem Estoque/Ajuste de Estoque" },
    ],
  },
  { icon: Building2, label: "Empresas" },
  { icon: Truck, label: "Logística" },
  { icon: Headset, label: "Suporte" },
];

interface AvanteSidebarProps {
  onAbrirMeioo?: () => void;
}

export function AvanteSidebar({ onAbrirMeioo }: AvanteSidebarProps) {
  const router = useRouter();
  const [flyoutItem, setFlyoutItem] = useState<NavItem | null>(null);

  function handleIconClick(item: NavItem) {
    if (item.children) {
      setFlyoutItem(flyoutItem?.label === item.label ? null : item);
    } else {
      setFlyoutItem(null);
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
                id={item.label === "Financeiro" ? "financeiro-nav-btn" : undefined}
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
            id="meioo-sidebar-btn"
            onClick={() => { setFlyoutItem(null); onAbrirMeioo?.(); }}
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
            className="absolute left-14 top-0 h-full bg-surface border-r border-border z-20 shadow-panel flex flex-col"
            style={{ width: 280 }}
          >
            {/* Flyout header */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border shrink-0">
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

            {/* Divider accent */}
            <div className="mx-4 border-b border-primary/30 shrink-0" />

            {/* Sub-items — scrollable */}
            <nav className="flex-1 overflow-y-auto py-2">
              {(() => {
                const regularItems = flyoutItem.children.filter(c => c.label !== "divider" && !c.meioo);
                const meiooItems  = flyoutItem.children.filter(c => c.meioo);

                function renderBtn(child: NavChild) {
                  return (
                    <button
                      key={child.label}
                      onClick={() => {
                        if (child.href) {
                          setFlyoutItem(null);
                          router.push(child.href);
                        }
                      }}
                      className={`w-full flex items-center gap-2 px-5 py-3 text-sm transition-colors hover:bg-bg text-left
                        ${child.active ? "text-primary font-semibold" : "text-dark/70 hover:text-dark"}
                        ${child.href ? "cursor-pointer" : ""}`}
                    >
                      {child.meioo && (
                        <span
                          className="inline-flex items-center justify-center rounded-[2px] bg-dark shrink-0"
                          style={{ width: 14, height: 10 }}
                          title="Meioo"
                        >
                          <svg viewBox={MEIOO_ICON_VB} width={10} height={7} fill="none" aria-hidden>
                            <path d={MEIOO_ICON_PATH} fill="white" />
                          </svg>
                        </span>
                      )}
                      <span className="flex-1">{child.label}</span>
                      {child.hasChildren && (
                        <ChevronRight size={14} className="text-muted shrink-0" />
                      )}
                    </button>
                  );
                }

                return (
                  <>
                    {regularItems.map(renderBtn)}
                    {meiooItems.length > 0 && (
                      <>
                        <div className="mx-4 my-2 border-b border-border" />
                        <div id="meioo-flyout-items">
                          {meiooItems.map(renderBtn)}
                        </div>
                      </>
                    )}
                  </>
                );
              })()}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
