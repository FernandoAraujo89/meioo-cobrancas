"use client";

import { useState } from "react";
import { MeiooIcon } from "../MeiooIcon";
import { ArrowLeft, Download, Share2, Printer, CheckCircle2 } from "lucide-react";

interface FluxoBoletoProps {
  onVoltar: () => void;
}

export function FluxoBoleto({ onVoltar }: FluxoBoletoProps) {
  const [step, setStep] = useState<"form" | "emitido">("form");
  const [pagador, setPagador] = useState("Armando Bagunça");
  const [valor, setValor] = useState("149,00");
  const [vencimento, setVencimento] = useState("09/09/2025");
  const [descricao, setDescricao] = useState("Bol. ao pedido de venda nº 446");

  if (step === "emitido") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setStep("form")}
            className="text-muted hover:text-dark transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <h3 className="font-semibold text-dark text-sm">Boleto Emitido</h3>
          <div className="ml-auto">
            <MeiooIcon size={18} variant="badge" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-success-bg flex items-center justify-center">
            <CheckCircle2 size={24} className="text-success" />
          </div>

          <div className="text-center">
            <p className="font-semibold text-dark">Boleto gerado com sucesso!</p>
            <p className="text-xs text-muted mt-1">
              Enviado para {pagador}
            </p>
          </div>

          {/* Preview do boleto */}
          <div className="w-full bg-white border border-border rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-xs"
                style={{ background: "#2c6eff" }}
              >
                A
              </div>
              <div>
                <p className="text-xs font-semibold text-dark">Avante Soluções Ltda</p>
                <p className="text-[10px] text-muted">CNPJ: 23.456.789/0001-12</p>
              </div>
              <div className="ml-auto">
                <MeiooIcon size={16} variant="badge" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[10px] text-muted">Pagador</span>
                <span className="text-[10px] font-medium text-dark">{pagador}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] text-muted">Vencimento</span>
                <span className="text-[10px] font-medium text-dark">{vencimento}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] text-muted">Valor</span>
                <span className="text-[10px] font-bold text-dark">
                  R$ {parseFloat(valor.replace(",", ".")).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Código de barras simulado */}
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex gap-px h-8 items-end">
                {Array.from({ length: 60 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-dark flex-1"
                    style={{ height: `${20 + Math.random() * 80}%` }}
                  />
                ))}
              </div>
              <p className="text-[9px] text-muted text-center mt-1 font-mono tracking-wider">
                1234 5678 9012 3456 7890 1234 5678 9012 3456 7890 1
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-full">
            <button className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium bg-bg text-dark border border-border hover:border-primary hover:text-primary transition-all">
              <Download size={13} />
              Baixar PDF
            </button>
            <button className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium bg-bg text-dark border border-border hover:border-primary hover:text-primary transition-all">
              <Share2 size={13} />
              Compartilhar
            </button>
            <button className="h-9 w-9 flex items-center justify-center rounded-lg text-xs font-medium bg-bg text-dark border border-border hover:border-primary hover:text-primary transition-all">
              <Printer size={13} />
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-muted bg-primary-subtle rounded-lg px-3 py-2 w-full">
            <MeiooIcon size={14} variant="badge" />
            <span>
              Boleto emitido pela <strong className="text-dark">Meioo</strong> via conta Avante
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={onVoltar}
          className="text-muted hover:text-dark transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2c6eff" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h3 className="font-semibold text-dark text-sm">Emitir Boleto</h3>
        </div>
        <div className="ml-auto">
          <MeiooIcon size={18} variant="badge" />
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <div>
          <label className="block text-[11px] font-semibold text-muted uppercase tracking-wide mb-1.5">
            Pagador
          </label>
          <input
            type="text"
            value={pagador}
            onChange={(e) => setPagador(e.target.value)}
            className="w-full px-3 h-9 rounded-lg border border-border text-xs text-dark bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-muted uppercase tracking-wide mb-1.5">
            Valor
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs font-medium">
              R$
            </span>
            <input
              type="text"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="w-full pl-8 pr-3 h-9 rounded-lg border border-border text-sm font-semibold text-dark bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-muted uppercase tracking-wide mb-1.5">
            Vencimento
          </label>
          <input
            type="text"
            value={vencimento}
            onChange={(e) => setVencimento(e.target.value)}
            className="w-full px-3 h-9 rounded-lg border border-border text-xs text-dark bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-muted uppercase tracking-wide mb-1.5">
            Descrição
          </label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full px-3 h-9 rounded-lg border border-border text-xs text-dark bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-muted uppercase tracking-wide mb-1.5">
            Conta bancária
          </label>
          <div className="flex items-center gap-2 px-3 h-9 rounded-lg border border-border bg-white">
            <MeiooIcon size={14} variant="badge" />
            <span className="text-xs text-dark font-medium">Olist Conta Do</span>
          </div>
        </div>

        <div className="flex items-start gap-2 bg-warning-bg rounded-lg p-3">
          <span className="text-warning mt-0.5 shrink-0">⚠</span>
          <p className="text-[11px] text-warning leading-relaxed">
            Boletos vencidos há mais de 30 dias não podem ser pagos. Verifique o vencimento.
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-6 pt-4 border-t border-border">
        <button
          onClick={onVoltar}
          className="flex-1 h-9 rounded-lg border border-border text-xs font-medium text-muted hover:text-dark transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={() => setStep("emitido")}
          className="flex-1 h-9 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
        >
          Emitir Boleto
        </button>
      </div>
    </div>
  );
}
