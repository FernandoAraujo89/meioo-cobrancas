"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AvanteHeader } from "@/app/components/AvanteHeader";
import { AvanteSidebar } from "@/app/components/AvanteSidebar";
import { PainelMeioo } from "@/app/components/PainelMeioo";
import {
  Users,
  Package,
  ClipboardList,
  FileText,
  BarChart2,
  Layers,
  Truck,
  ShoppingCart,
  DollarSign,
  Box,
  Wrench,
  Receipt,
  BookOpen,
  ArrowDownToLine,
  FileCheck,
  Inbox,
  ChevronRight,
} from "lucide-react";

interface Atalho {
  acao: string;
  titulo: string;
  descricao: string;
  cor: string;
  bg: string;
  icon: React.ElementType;
  href?: string;
}

const ATALHOS: Atalho[] = [
  // Linha 1
  { acao: "Consulta",    titulo: "Participante",       descricao: "Busque por clientes cadastrados!",             cor: "#3b82f6", bg: "#dbeafe", icon: Users },
  { acao: "Consulta",    titulo: "Produto",             descricao: "Busque por produtos cadastrados!",             cor: "#3b82f6", bg: "#dbeafe", icon: Package },
  { acao: "Emitir",      titulo: "Ordem de Serviço",   descricao: "Emita novas Ordens de Serviço!",              cor: "#f59e0b", bg: "#fef3c7", icon: ClipboardList },
  { acao: "Consulta",    titulo: "Ordem de Serviço",   descricao: "Busque por Ordens de Serviço!",               cor: "#f59e0b", bg: "#fef3c7", icon: ClipboardList },
  { acao: "Emitir",      titulo: "NFe",                 descricao: "Emita notas fiscais eletrônicas descomplicado!", cor: "#22c55e", bg: "#dcfce7", icon: FileText },
  { acao: "Consulta",    titulo: "NFe",                 descricao: "Confira notas fiscais eletrônicas facilmente!", cor: "#22c55e", bg: "#dcfce7", icon: FileText },
  { acao: "Emitir",      titulo: "Notas de Serviço",   descricao: "Emita novas Notas de Serviço!",              cor: "#ef4444", bg: "#fee2e2", icon: Receipt },
  // Linha 2
  { acao: "Consulta",    titulo: "Notas de Serviço",   descricao: "Busque por Notas de Serviço!",               cor: "#ef4444", bg: "#fee2e2", icon: Receipt },
  { acao: "Emitir",      titulo: "CTe",                 descricao: "Emita novas CTe!",                           cor: "#3b82f6", bg: "#dbeafe", icon: Truck },
  { acao: "Consulta",    titulo: "CTe",                 descricao: "Busque por CTe emitidos!",                   cor: "#3b82f6", bg: "#dbeafe", icon: Truck },
  { acao: "Ajuste",      titulo: "Estoque",             descricao: "Arrume o estoque!",                          cor: "#8b5cf6", bg: "#ede9fe", icon: Box },
  { acao: "Consulta",    titulo: "MDFe",                descricao: "Busque por MDFe emitidos!",                  cor: "#f59e0b", bg: "#fef3c7", icon: Layers },
  { acao: "Consulta",    titulo: "Orçamento",           descricao: "Busque por Orçamento!",                      cor: "#22c55e", bg: "#dcfce7", icon: BarChart2 },
  { acao: "Abertura",    titulo: "Caixa",               descricao: "Controle sua movimentação de caixa!",        cor: "#f59e0b", bg: "#fef3c7", icon: DollarSign },
  // Linha 3
  { acao: "Fechamento",  titulo: "Caixa",               descricao: "Veja seus resultados de venda simplificados!", cor: "#ef4444", bg: "#fee2e2", icon: DollarSign },
  { acao: "Realizar",    titulo: "Venda",               descricao: "Efetue sua venda de forma rápida e descomplicada!", cor: "#8b5cf6", bg: "#ede9fe", icon: ShoppingCart, href: "/pdv/realizar-venda" },
  { acao: "Consultar Vendas", titulo: "NFC-e",          descricao: "Consulte vendas com emissão de NFC-e!",      cor: "#8b5cf6", bg: "#ede9fe", icon: ShoppingCart },
  { acao: "Cadastrar",   titulo: "Nota de Entrada",    descricao: "Cadastre Novas notas de Entrada!",           cor: "#22c55e", bg: "#dcfce7", icon: ArrowDownToLine },
  { acao: "Consultar",   titulo: "Notas de Entrada",   descricao: "Veja as notas emitidas por seus fornecedores!", cor: "#22c55e", bg: "#dcfce7", icon: FileCheck },
  { acao: "Consultar",   titulo: "Notas Recebidas",    descricao: "Manifeste suas operações!",                  cor: "#3b82f6", bg: "#dbeafe", icon: Inbox },
  { acao: "Consultar",   titulo: "Financeiro",          descricao: "Busque por Lançamentos Financeiros!",        cor: "#f59e0b", bg: "#fef3c7", icon: BookOpen, href: "/financeiro/contas-a-receber" },
];

export default function HomePage() {
  const router = useRouter();
  const [painelMeiooAberto, setPainelMeiooAberto] = useState(false);
  const [busca, setBusca] = useState("");

  const filtrados = ATALHOS.filter(
    a =>
      busca === "" ||
      a.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      a.acao.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <AvanteHeader onBusca={setBusca} />

      <div className="flex flex-1 overflow-hidden">
        <AvanteSidebar onAbrirMeioo={() => setPainelMeiooAberto(true)} />

        <main className="flex-1 overflow-y-auto safe-scroll bg-bg">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Page title */}
            <div className="flex items-center gap-2 mb-6 sm:mb-8">
              <h1 className="text-lg sm:text-xl font-bold text-dark">Empresa Demonstração</h1>
              <ChevronRight size={16} className="text-muted" />
            </div>

            {/* Shortcuts grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4">
              {filtrados.map((atalho, i) => {
                const Icon = atalho.icon;
                return (
                  <button
                    key={i}
                    onClick={() => atalho.href && router.push(atalho.href)}
                    className={`group bg-surface border border-border rounded-xl p-4 text-left flex flex-col gap-3 shadow-card transition-all duration-150
                      ${atalho.href
                        ? "hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                        : "hover:border-border-dark cursor-default opacity-80"
                      }`}
                  >
                    {/* Ação label */}
                    <p className="text-[10px] font-semibold text-muted uppercase tracking-wide leading-none">
                      {atalho.acao}
                    </p>

                    {/* Icon + Title */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: atalho.bg }}
                      >
                        <Icon size={20} style={{ color: atalho.cor }} />
                      </div>
                      <p className="text-sm font-bold text-dark leading-snug">{atalho.titulo}</p>
                    </div>

                    {/* Description */}
                    <div className="border-t border-border pt-2 mt-auto">
                      <div className="flex items-start gap-1.5">
                        <svg viewBox="0 0 70 70" width={12} height={12} fill="none" className="shrink-0 mt-0.5 opacity-30">
                          <path d="M27.6 36.4H19.6C18.7 36.4 18 35.7 18 34.8v-.5c0-.9.7-1.6 1.6-1.6h8c.9 0 1.6.7 1.6 1.6v.5c0 .9-.7 1.6-1.6 1.6Z" fill="#2C6EFF"/>
                          <path d="M30.9 29.4h-8c-.9 0-1.6-.7-1.6-1.6v-.5c0-.9.7-1.6 1.6-1.6h8c.9 0 1.6.7 1.6 1.6v.5c0 .9-.7 1.6-1.6 1.6Z" fill="#2C6EFF"/>
                          <path d="M30.9 42.9h-8c-.9 0-1.6-.7-1.6-1.6 0-.9.7-1.6 1.6-1.6h8c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6Z" fill="#2C6EFF"/>
                        </svg>
                        <p className="text-[11px] text-muted leading-snug">{atalho.descricao}</p>
                      </div>
                    </div>
                  </button>
                );
              })}

              {filtrados.length === 0 && (
                <div className="col-span-full text-center py-16 text-muted text-sm">
                  Nenhum atalho encontrado para &ldquo;{busca}&rdquo;.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <PainelMeioo
        aberto={painelMeiooAberto}
        onFechar={() => setPainelMeiooAberto(false)}
      />
    </div>
  );
}
