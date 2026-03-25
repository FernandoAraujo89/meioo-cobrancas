"use client";

import { useState } from "react";
import { AvanteHeader } from "@/app/components/AvanteHeader";
import { AvanteSidebar } from "@/app/components/AvanteSidebar";
import { ContasReceberTable } from "@/app/components/cobranca/ContasReceberTable";
import { PainelCobranca } from "@/app/components/cobranca/PainelCobranca";
import { PainelMeioo } from "@/app/components/PainelMeioo";
import { MeiooIcon } from "@/app/components/MeiooIcon";
import { MeiooOnboarding } from "@/app/components/MeiooOnboarding";
import {
  Plus,
  Filter,
  ChevronDown,
  Calendar,
  RefreshCw,
  Download,
} from "lucide-react";

type TipoFluxo = "menu" | "pix" | "boleto" | "link" | "cartao" | "pagar";

const tabs = [
  { label: "Em aberto", count: 5, active: false },
  { label: "A vencer", count: 3, active: false },
  { label: "Pendente", count: 0, active: false },
  { label: "Recebido", count: 2, active: false },
  { label: "Cancelado", count: 0, active: false },
  { label: "Todos", count: 7, active: true },
];

export default function ContasAReceberPage() {
  const [painelAberto, setPainelAberto] = useState(false);
  const [fluxo, setFluxo] = useState<TipoFluxo>("menu");
  const [painelMeiooAberto, setPainelMeiooAberto] = useState(false);

  function abrirPainel(tipo: TipoFluxo = "menu") {
    setFluxo(tipo);
    setPainelAberto(true);
  }

  function fecharPainel() {
    setPainelAberto(false);
    setTimeout(() => setFluxo("menu"), 300);
  }

  function abrirCobrancaDoMeioo(tipo: "pix" | "boleto" | "link" | "cartao" | "pagar" | "menu") {
    setFluxo(tipo);
    setPainelAberto(true);
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AvanteHeader />

      <div className="flex flex-1 overflow-hidden">
        <AvanteSidebar onAbrirMeioo={() => setPainelMeiooAberto(true)} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[11px] text-muted mb-4">
              <span>Início</span>
              <span>/</span>
              <span>Financeiro</span>
              <span>/</span>
              <span className="text-dark font-medium">Contas a Receber</span>
            </div>

            {/* Page header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-xl font-bold text-dark leading-tight">
                  Contas a Receber
                </h1>
                <p className="text-xs text-muted mt-0.5">
                  Gerencie suas cobranças e recebimentos
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button className="h-8 px-3 flex items-center gap-1.5 rounded-lg border border-border bg-surface text-xs font-medium text-dark hover:bg-bg transition-colors">
                  <Download size={13} className="text-muted" />
                  Exportar
                </button>
                <button className="h-8 px-3 flex items-center gap-1.5 rounded-lg border border-border bg-surface text-xs font-medium text-dark hover:bg-bg transition-colors">
                  <RefreshCw size={13} className="text-muted" />
                </button>
                <button
                  id="btn-incluir-cobranca"
                  onClick={() => abrirPainel("menu")}
                  className="h-8 px-4 flex items-center gap-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors shadow-sm"
                >
                  <Plus size={13} />
                  Incluir cobrança
                  <MeiooIcon size={13} variant="badge" className="opacity-80" />
                </button>
              </div>
            </div>

            {/* Filters row */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-xs">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    placeholder="Pesquisar por cliente..."
                    className="w-full pl-8 pr-3 h-8 rounded-lg border border-border bg-surface text-xs text-dark placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>

                <button className="h-8 px-3 flex items-center gap-1.5 rounded-lg border border-border bg-surface text-xs font-medium text-dark hover:bg-bg transition-colors">
                  <Calendar size={13} className="text-muted" />
                  24–31 Agosto
                  <ChevronDown size={11} className="text-muted" />
                </button>

                <button className="h-8 px-3 flex items-center gap-1.5 rounded-lg border border-border bg-surface text-xs font-medium text-dark hover:bg-bg transition-colors">
                  <Filter size={13} className="text-muted" />
                  Filtros
                </button>
              </div>
            </div>

            {/* Summary cards */}
            <div id="summary-cards" className="grid grid-cols-3 gap-3 mb-5">
              {[
                {
                  label: "Total a Receber",
                  valor: "R$ 2.180,02",
                  sub: "7 cobranças",
                  color: "text-dark",
                },
                {
                  label: "Vencido",
                  valor: "R$ 149,00",
                  sub: "1 cobrança",
                  color: "text-danger",
                },
                {
                  label: "Recebido este mês",
                  valor: "R$ 100,00",
                  sub: "1 cobrança",
                  color: "text-success",
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="bg-surface rounded-lg border border-border p-4 shadow-card"
                >
                  <p className="text-[11px] text-muted font-medium mb-1">
                    {card.label}
                  </p>
                  <p className={`text-lg font-bold ${card.color}`}>
                    {card.valor}
                  </p>
                  <p className="text-[11px] text-muted mt-0.5">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-0 border-b border-border mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors -mb-px
                    ${tab.active ? "border-primary text-primary" : "border-transparent text-muted hover:text-dark"}`}
                >
                  {tab.label}
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold
                    ${tab.active ? "bg-primary/10 text-primary" : "bg-bg text-muted"}`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Table */}
            <div id="cobrancas-table">
              <ContasReceberTable />
            </div>

            {/* Meioo attribution */}
            <div className="flex items-center gap-2 mt-4 text-[11px] text-muted">
              <MeiooIcon size={14} variant="badge" />
              <span>
                Cobranças via{" "}
                <strong className="text-dark">Meioo</strong> — Conta Digital
                Avante
              </span>
            </div>
          </div>
        </main>
      </div>

      <PainelCobranca
        aberto={painelAberto}
        fluxo={fluxo}
        onFechar={fecharPainel}
        onFluxo={setFluxo}
      />

      <PainelMeioo
        aberto={painelMeiooAberto}
        onFechar={() => setPainelMeiooAberto(false)}
        onAbrirCobranca={abrirCobrancaDoMeioo}
      />

      <MeiooOnboarding />
    </div>
  );
}
