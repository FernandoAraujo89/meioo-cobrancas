"use client";

import { useState, useEffect, useCallback } from "react";
import { AvanteHeader } from "@/app/components/AvanteHeader";
import { AvanteSidebar } from "@/app/components/AvanteSidebar";
import { PainelCobranca } from "@/app/components/cobranca/PainelCobranca";
import { PainelMeioo } from "@/app/components/PainelMeioo";
import { MeiooIcon } from "@/app/components/MeiooIcon";
import { QrCode, FileText, Link2, RefreshCw, Plus, CheckCircle2 } from "lucide-react";

type TipoFluxo = "menu" | "pix" | "boleto" | "link" | "cartao" | "pagar";
type TipoCobranca = "pix" | "boleto" | "link";
type StatusCobranca = "pendente" | "pago" | "cancelado" | "vencido";

interface CobrancaBancaria {
  id: number;
  cliente: string;
  historico: string | null;
  valor: number;
  tipo: TipoCobranca;
  status: StatusCobranca;
  vencimento: string | null;
  criado_em: string;
}

const tipoConfig: Record<TipoCobranca, { label: string; icon: React.ReactNode }> = {
  pix: { label: "Pix", icon: <QrCode size={13} className="text-primary" /> },
  boleto: { label: "Boleto", icon: <FileText size={13} className="text-primary" /> },
  link: { label: "Link", icon: <Link2 size={13} className="text-primary" /> },
};

const statusConfig: Record<StatusCobranca, { label: string; className: string }> = {
  pendente: { label: "Pendente", className: "bg-warning-bg text-warning" },
  pago: { label: "Pago", className: "bg-success-bg text-success" },
  cancelado: { label: "Cancelado", className: "bg-border text-muted" },
  vencido: { label: "Vencido", className: "bg-danger-bg text-danger" },
};

const TAB_LABELS = ["Todos", "Pendente", "Pago", "Cancelado", "Vencido"];

export default function CobrancasBancariasPage() {
  const [cobrancas, setCobrancas] = useState<CobrancaBancaria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [activeTab, setActiveTab] = useState("Todos");
  const [painelAberto, setPainelAberto] = useState(false);
  const [fluxo, setFluxo] = useState<TipoFluxo>("menu");
  const [painelMeiooAberto, setPainelMeiooAberto] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const fetchCobrancas = useCallback(async () => {
    setCarregando(true);
    try {
      const res = await fetch("/api/cobrancas");
      const data = await res.json();
      setCobrancas(data.cobrancas ?? []);
    } catch {
      setCobrancas([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    fetchCobrancas();
  }, [fetchCobrancas, refreshKey]);

  function fecharPainel() {
    setPainelAberto(false);
    setTimeout(() => setFluxo("menu"), 300);
  }

  function handleCobrancaGerada() {
    setToast("Cobrança registrada com sucesso!");
    setTimeout(() => setToast(null), 3500);
    setRefreshKey(k => k + 1);
  }

  const filtradas = activeTab === "Todos"
    ? cobrancas
    : cobrancas.filter(c => c.status === activeTab.toLowerCase());

  // Totalizadores
  const total = cobrancas.reduce((s, c) => s + c.valor, 0);
  const pendentes = cobrancas.filter(c => c.status === "pendente");
  const totalPendente = pendentes.reduce((s, c) => s + c.valor, 0);
  const pagas = cobrancas.filter(c => c.status === "pago");
  const totalPago = pagas.reduce((s, c) => s + c.valor, 0);

  const contarTab = (tab: string) =>
    tab === "Todos" ? cobrancas.length : cobrancas.filter(c => c.status === tab.toLowerCase()).length;

  function formatData(iso: string) {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "2-digit",
    });
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
              <span className="text-dark font-medium">Cobranças Bancárias</span>
            </div>

            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h1 className="text-xl font-bold text-dark leading-tight">Cobranças Bancárias</h1>
                <p className="text-xs text-muted mt-0.5">Cobranças geradas via Meioo — Pix, Boleto e Link de Pagamento</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRefreshKey(k => k + 1)}
                  className="h-8 px-3 flex items-center gap-1.5 rounded-lg border border-border bg-surface text-xs font-medium text-dark hover:bg-bg transition-colors"
                >
                  <RefreshCw size={13} className={`text-muted ${carregando ? "animate-spin" : ""}`} />
                </button>
                <button
                  onClick={() => { setFluxo("menu"); setPainelAberto(true); }}
                  className="h-8 px-4 flex items-center gap-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors shadow-sm"
                >
                  <Plus size={13} />
                  Nova cobrança
                  <MeiooIcon size={13} variant="badge" className="opacity-80" />
                </button>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div className="bg-surface rounded-lg border border-border p-4 shadow-card">
                <p className="text-[11px] text-muted font-medium mb-1">Total gerado</p>
                <p className="text-lg font-bold text-dark">
                  {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
                <p className="text-[11px] text-muted mt-0.5">{cobrancas.length} cobranças</p>
              </div>
              <div className="bg-surface rounded-lg border border-border p-4 shadow-card">
                <p className="text-[11px] text-muted font-medium mb-1">Pendentes</p>
                <p className="text-lg font-bold text-warning">
                  {totalPendente.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
                <p className="text-[11px] text-muted mt-0.5">{pendentes.length} cobranças</p>
              </div>
              <div className="bg-surface rounded-lg border border-border p-4 shadow-card">
                <p className="text-[11px] text-muted font-medium mb-1">Recebido</p>
                <p className="text-lg font-bold text-success">
                  {totalPago.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
                <p className="text-[11px] text-muted mt-0.5">{pagas.length} cobranças</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center border-b border-border mb-4 overflow-x-auto">
              {TAB_LABELS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs font-medium border-b-2 transition-colors -mb-px whitespace-nowrap
                      ${isActive ? "border-primary text-primary" : "border-transparent text-muted hover:text-dark"}`}>
                    {tab}
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold
                      ${isActive ? "bg-primary/10 text-primary" : "bg-bg text-muted"}`}>
                      {contarTab(tab)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Table */}
            <div className="bg-surface rounded-lg border border-border overflow-hidden shadow-card">
              {carregando ? (
                <div className="flex items-center justify-center py-16 gap-2 text-muted text-xs">
                  <RefreshCw size={14} className="animate-spin" />
                  Carregando cobranças...
                </div>
              ) : filtradas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
                  <div className="w-12 h-12 rounded-full bg-bg flex items-center justify-center">
                    <MeiooIcon size={24} variant="badge" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark">Nenhuma cobrança encontrada</p>
                    <p className="text-xs text-muted mt-1">
                      Vá em <strong>Contas a Receber</strong> e clique em{" "}
                      <strong>Cobrar</strong> para gerar cobranças via Meioo.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[480px]">
                    <thead>
                      <tr className="border-b border-border bg-bg/50">
                        <th className="text-left py-3 px-4 font-semibold text-muted uppercase tracking-wide text-[11px]">Cliente</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted uppercase tracking-wide text-[11px] hidden md:table-cell">Histórico</th>
                        <th className="text-center py-3 px-3 font-semibold text-muted uppercase tracking-wide text-[11px]">Tipo</th>
                        <th className="text-right py-3 px-4 font-semibold text-muted uppercase tracking-wide text-[11px]">Valor</th>
                        <th className="text-center py-3 px-3 font-semibold text-muted uppercase tracking-wide text-[11px]">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted uppercase tracking-wide text-[11px] hidden sm:table-cell">Vencimento</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted uppercase tracking-wide text-[11px] hidden sm:table-cell">Gerado em</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtradas.map((c, idx) => {
                        const tipo = tipoConfig[c.tipo];
                        const st = statusConfig[c.status];
                        return (
                          <tr key={c.id}
                            className={`border-b border-border last:border-0 hover:bg-bg/40 transition-colors ${idx % 2 === 0 ? "" : "bg-bg/20"}`}>
                            <td className="py-3 px-4 font-medium text-dark">{c.cliente}</td>
                            <td className="py-3 px-4 text-muted max-w-[180px] truncate hidden md:table-cell">
                              {c.historico ?? "—"}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <MeiooIcon size={12} variant="badge" className="shrink-0" />
                                {tipo.icon}
                                <span className="text-[11px] text-muted hidden sm:inline">{tipo.label}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-dark">
                              {c.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${st.className}`}>
                                {st.label}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-muted hidden sm:table-cell">
                              {c.vencimento ?? "—"}
                            </td>
                            <td className="py-3 px-4 text-muted hidden sm:table-cell">
                              {formatData(c.criado_em)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Meioo attribution */}
            <div className="flex items-center gap-2 mt-4 text-[11px] text-muted">
              <MeiooIcon size={14} variant="badge" />
              <span>Cobranças processadas via <strong className="text-dark">Meioo</strong> — Conta Digital Avante</span>
            </div>
          </div>
        </main>
      </div>

      <PainelCobranca
        aberto={painelAberto}
        fluxo={fluxo}
        onFechar={fecharPainel}
        onFluxo={setFluxo}
        onCobrancaGerada={handleCobrancaGerada}
      />

      <PainelMeioo
        aberto={painelMeiooAberto}
        onFechar={() => setPainelMeiooAberto(false)}
        onAbrirCobranca={(tipo) => { setFluxo(tipo); setPainelAberto(true); }}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 bg-dark text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">
          <CheckCircle2 size={16} className="text-success shrink-0" />
          {toast}
        </div>
      )}
    </div>
  );
}
