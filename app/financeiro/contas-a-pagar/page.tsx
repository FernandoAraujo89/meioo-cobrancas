"use client";

import { useState } from "react";
import { AvanteHeader } from "@/app/components/AvanteHeader";
import { AvanteSidebar } from "@/app/components/AvanteSidebar";
import { ContasPagarTable } from "@/app/components/cobranca/ContasPagarTable";
import { PainelMeioo } from "@/app/components/PainelMeioo";
import { MeiooIcon } from "@/app/components/MeiooIcon";
import {
  Plus,
  Filter,
  ChevronDown,
  Calendar,
  RefreshCw,
  Download,
  AlertTriangle,
} from "lucide-react";

const tabs = [
  { label: "Em aberto",  count: 4, active: false },
  { label: "A vencer",   count: 2, active: false },
  { label: "Atrasado",   count: 1, active: false },
  { label: "Pago",       count: 2, active: false },
  { label: "Cancelado",  count: 0, active: false },
  { label: "Todos",      count: 7, active: true  },
];

// Conta atrasada fixa para o botão "Pagar agora" do alerta
const CONTA_ATRASADA = { id: 1, fornecedor: "Fornecedora ABC Ltda.", vencimento: "20/08/2025", valor: 3200.00, saldo: 12650.00 };

export default function ContasAPagarPage() {
  const [activeTab, setActiveTab] = useState("Todos");
  const [painelMeiooAberto, setPainelMeiooAberto] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showPagarModal, setShowPagarModal] = useState(false);
  const [contaModal, setContaModal] = useState(CONTA_ATRASADA);
  const [confirmando, setConfirmando] = useState(false);
  const [pagoOk, setPagoOk] = useState(false);

  function handlePagarAgora() {
    setContaModal(CONTA_ATRASADA);
    setShowPagarModal(true);
    setPagoOk(false);
  }

  function handlePagar(id: string) {
    setContaModal({ ...CONTA_ATRASADA, id: Number(id) });
    setShowPagarModal(true);
    setPagoOk(false);
  }

  async function confirmarPagamento() {
    setConfirmando(true);
    const res = await fetch("/api/pagamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contaId: contaModal.id }),
    });
    setConfirmando(false);
    if (res.ok) {
      setPagoOk(true);
      setTimeout(() => {
        setShowPagarModal(false);
        setPagoOk(false);
        setRefreshKey(k => k + 1);
        setPainelMeiooAberto(true);
      }, 1800);
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AvanteHeader />

      <div className="flex flex-1 overflow-hidden">
        <AvanteSidebar onAbrirMeioo={() => setPainelMeiooAberto(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[11px] text-muted mb-4">
              <span>Início</span>
              <span>/</span>
              <span>Financeiro</span>
              <span>/</span>
              <span className="text-dark font-medium">Contas a Pagar</span>
            </div>

            {/* Page header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-xl font-bold text-dark leading-tight">
                  Contas a Pagar
                </h1>
                <p className="text-xs text-muted mt-0.5">
                  Gerencie seus pagamentos e obrigações financeiras
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
                  onClick={() => setPainelMeiooAberto(true)}
                  className="h-8 px-4 flex items-center gap-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors shadow-sm"
                >
                  <Plus size={13} />
                  Registrar pagamento
                  <MeiooIcon size={13} variant="badge" className="opacity-80" />
                </button>
              </div>
            </div>

            {/* Alerta de vencidos */}
            <div className="flex items-center gap-3 mb-5 p-3 rounded-lg bg-danger-bg border border-danger/20">
              <AlertTriangle size={15} className="text-danger shrink-0" />
              <p className="text-xs text-danger font-medium">
                Você possui <strong>1 conta atrasada</strong> no valor de <strong>R$ 3.200,00</strong>. Regularize para evitar juros e multas.
              </p>
              <button
                onClick={handlePagarAgora}
                className="ml-auto shrink-0 h-6 px-3 rounded-md bg-danger text-white text-[11px] font-semibold hover:bg-danger/90 transition-colors"
              >
                Pagar agora
              </button>
            </div>

            {/* Filters row */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-xs">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                    width="13" height="13" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    placeholder="Pesquisar por fornecedor..."
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
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                {
                  label: "Total a Pagar",
                  valor: "R$ 12.080,50",
                  sub: "7 contas",
                  color: "text-dark",
                },
                {
                  label: "Atrasado",
                  valor: "R$ 3.200,00",
                  sub: "1 conta",
                  color: "text-danger",
                },
                {
                  label: "Pago este mês",
                  valor: "R$ 1.230,50",
                  sub: "2 contas",
                  color: "text-success",
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="bg-surface rounded-lg border border-border p-4 shadow-card"
                >
                  <p className="text-[11px] text-muted font-medium mb-1">{card.label}</p>
                  <p className={`text-lg font-bold ${card.color}`}>{card.valor}</p>
                  <p className="text-[11px] text-muted mt-0.5">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-0 border-b border-border mb-4">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.label;
                return (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(tab.label)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors -mb-px
                      ${isActive ? "border-primary text-primary" : "border-transparent text-muted hover:text-dark"}`}
                  >
                    {tab.label}
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold
                      ${isActive ? "bg-primary/10 text-primary" : "bg-bg text-muted"}`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Table */}
            <ContasPagarTable onPagar={handlePagar} />

            {/* Meioo attribution */}
            <div className="flex items-center gap-2 mt-4 text-[11px] text-muted">
              <MeiooIcon size={14} variant="badge" />
              <span>
                Pagamentos via{" "}
                <strong className="text-dark">Meioo</strong> — Conta Digital Avante
              </span>
            </div>
          </div>
        </main>
      </div>

      {/* Modal confirmação de pagamento */}
      {showPagarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => !confirmando && setShowPagarModal(false)} />
          <div className="relative bg-surface rounded-xl shadow-xl border border-border w-[400px] p-6 z-10">

            {pagoOk ? (
              /* ── Sucesso ── */
              <div className="flex flex-col items-center py-4 gap-3">
                <div className="w-14 h-14 rounded-full bg-success-bg flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-success"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h2 className="text-sm font-bold text-dark">Pagamento realizado!</h2>
                <p className="text-xs text-muted text-center">
                  R$ {contaModal.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} debitado da sua Conta Digital Meioo.<br/>Abrindo o painel…
                </p>
              </div>
            ) : (
              /* ── Confirmação ── */
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MeiooIcon size={20} variant="badge" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-dark">Confirmar pagamento</h2>
                    <p className="text-xs text-muted mt-0.5">Via Conta Digital Meioo</p>
                  </div>
                </div>

                <div className="bg-bg rounded-lg p-4 mb-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted">Fornecedor</span>
                    <span className="font-medium text-dark">{contaModal.fornecedor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Vencimento</span>
                    <span className="font-medium text-danger">{contaModal.vencimento} (atrasado)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Valor</span>
                    <span className="font-bold text-dark">
                      R$ {contaModal.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Saldo disponível</span>
                    <span className="font-medium text-success">
                      R$ {contaModal.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-muted mb-4">
                  O valor será debitado da sua Conta Digital Meioo. Esta operação não pode ser desfeita.
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPagarModal(false)}
                    disabled={confirmando}
                    className="flex-1 h-9 rounded-lg border border-border text-xs font-medium text-dark hover:bg-bg transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmarPagamento}
                    disabled={confirmando}
                    className="flex-1 h-9 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors disabled:opacity-70"
                  >
                    {confirmando ? "Processando…" : "Confirmar pagamento"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <PainelMeioo
        aberto={painelMeiooAberto}
        onFechar={() => setPainelMeiooAberto(false)}
        onAbrirCobranca={() => setPainelMeiooAberto(false)}
        refreshKey={refreshKey}
      />
    </div>
  );
}
