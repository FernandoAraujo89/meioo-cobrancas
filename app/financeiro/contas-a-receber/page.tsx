"use client";

import { useState } from "react";
import { AvanteHeader } from "@/app/components/AvanteHeader";
import { AvanteSidebar } from "@/app/components/AvanteSidebar";
import { ContasReceberTable, contarPorFiltro, Cobranca } from "@/app/components/cobranca/ContasReceberTable";
import { PainelCobranca, DadosPreenchidos } from "@/app/components/cobranca/PainelCobranca";
import { PainelMeioo } from "@/app/components/PainelMeioo";
import { MeiooIcon } from "@/app/components/MeiooIcon";
import { CheckCircle2, Plus, Filter, ChevronDown, Calendar, RefreshCw, Download } from "lucide-react";

type TipoFluxo = "menu" | "pix" | "boleto" | "link" | "cartao" | "pagar";

const TAB_LABELS = ["Em aberto", "A vencer", "Pendente", "Recebido", "Cancelado", "Todos"];

export default function ContasAReceberPage() {
  const [painelAberto, setPainelAberto] = useState(false);
  const [fluxo, setFluxo] = useState<TipoFluxo>("menu");
  const [painelMeiooAberto, setPainelMeiooAberto] = useState(false);
  const [activeTab, setActiveTab] = useState("Todos");
  const [preenchido, setPreenchido] = useState<DadosPreenchidos | undefined>(undefined);
  const [toast, setToast] = useState<string | null>(null);

  function abrirPainel(tipo: TipoFluxo = "menu", dados?: DadosPreenchidos) {
    setPreenchido(dados);
    setFluxo(tipo);
    setPainelAberto(true);
  }

  function fecharPainel() {
    setPainelAberto(false);
    setTimeout(() => {
      setFluxo("menu");
      setPreenchido(undefined);
    }, 300);
  }

  function abrirCobrancaDoMeioo(tipo: "pix" | "boleto" | "link" | "cartao" | "pagar" | "menu") {
    setPreenchido(undefined);
    setFluxo(tipo);
    setPainelAberto(true);
  }

  function handleGerarCobranca(row: Cobranca) {
    abrirPainel("menu", {
      cliente: row.cliente,
      valor: row.saldo > 0 ? row.saldo : row.valor,
      historico: row.historico,
      vencimento: row.vencimento,
    });
  }

  function handleCobrancaGerada() {
    setToast("Cobrança gerada com sucesso!");
    setTimeout(() => setToast(null), 3500);
  }

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <AvanteHeader />

      <div className="flex flex-1 overflow-hidden">
        <AvanteSidebar onAbrirMeioo={() => setPainelMeiooAberto(true)} />

        <main className="flex-1 overflow-y-auto safe-scroll">
          <div className="p-3 sm:p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[11px] text-muted mb-4">
              <span>Início</span><span>/</span>
              <span>Financeiro</span><span>/</span>
              <span className="text-dark font-medium">Contas a Receber</span>
            </div>

            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h1 className="text-xl font-bold text-dark leading-tight">Contas a Receber</h1>
                <p className="text-xs text-muted mt-0.5">Gerencie suas cobranças e recebimentos</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="h-8 px-3 hidden sm:flex items-center gap-1.5 rounded-lg border border-border bg-surface text-xs font-medium text-dark hover:bg-bg transition-colors">
                  <Download size={13} className="text-muted" />Exportar
                </button>
                <button className="h-8 px-3 hidden sm:flex items-center gap-1.5 rounded-lg border border-border bg-surface text-xs font-medium text-dark hover:bg-bg transition-colors">
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

            {/* Filters */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <div className="relative flex-1 min-w-[140px] max-w-xs">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" width="13" height="13"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input placeholder="Pesquisar por cliente..."
                  className="w-full pl-8 pr-3 h-8 rounded-lg border border-border bg-surface text-xs text-dark placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" />
              </div>
              <button className="h-8 px-3 flex items-center gap-1.5 rounded-lg border border-border bg-surface text-xs font-medium text-dark hover:bg-bg transition-colors shrink-0">
                <Calendar size={13} className="text-muted" />
                <span className="hidden sm:inline">24–31 Agosto</span>
                <span className="sm:hidden">Agosto</span>
                <ChevronDown size={11} className="text-muted" />
              </button>
              <button className="h-8 px-3 flex items-center gap-1.5 rounded-lg border border-border bg-surface text-xs font-medium text-dark hover:bg-bg transition-colors shrink-0">
                <Filter size={13} className="text-muted" />Filtros
              </button>
            </div>

            {/* Summary cards */}
            <div id="summary-cards" className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {[
                { label: "Total a Receber", valor: "R$ 2.180,02", sub: "7 cobranças", color: "text-dark" },
                { label: "Vencido", valor: "R$ 149,00", sub: "1 cobrança", color: "text-danger" },
                { label: "Recebido este mês", valor: "R$ 100,00", sub: "1 cobrança", color: "text-success" },
              ].map((card) => (
                <div key={card.label} className="bg-surface rounded-lg border border-border p-4 shadow-card">
                  <p className="text-[11px] text-muted font-medium mb-1">{card.label}</p>
                  <p className={`text-lg font-bold ${card.color}`}>{card.valor}</p>
                  <p className="text-[11px] text-muted mt-0.5">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-0 border-b border-border mb-4 overflow-x-auto">
              {TAB_LABELS.map((label) => {
                const isActive = activeTab === label;
                const count = contarPorFiltro(label);
                return (
                  <button key={label} onClick={() => setActiveTab(label)}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs font-medium border-b-2 transition-colors -mb-px whitespace-nowrap
                      ${isActive ? "border-primary text-primary" : "border-transparent text-muted hover:text-dark"}`}>
                    {label}
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold
                      ${isActive ? "bg-primary/10 text-primary" : "bg-bg text-muted"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Table */}
            <div id="cobrancas-table">
              <ContasReceberTable
                filtro={activeTab}
                onGerarCobranca={handleGerarCobranca}
              />
            </div>

            {/* Meioo attribution */}
            <div className="flex items-center gap-2 mt-4 text-[11px] text-muted">
              <MeiooIcon size={14} variant="badge" />
              <span>Cobranças via <strong className="text-dark">Meioo</strong> — Conta Digital Avante</span>
            </div>
          </div>
        </main>
      </div>

      <PainelCobranca
        aberto={painelAberto}
        fluxo={fluxo}
        onFechar={fecharPainel}
        onFluxo={setFluxo}
        preenchido={preenchido}
        onCobrancaGerada={handleCobrancaGerada}
      />

      <PainelMeioo
        aberto={painelMeiooAberto}
        onFechar={() => setPainelMeiooAberto(false)}
        onAbrirCobranca={abrirCobrancaDoMeioo}
      />

      {/* Toast de sucesso */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 bg-dark text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in">
          <CheckCircle2 size={16} className="text-success shrink-0" />
          {toast}
        </div>
      )}
    </div>
  );
}
