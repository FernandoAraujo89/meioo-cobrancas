"use client";

import { useState } from "react";
import { MeiooIcon } from "../MeiooIcon";
import { ArrowLeft, Copy, CheckCircle2, Share2, ExternalLink } from "lucide-react";

interface FluxoLinkProps {
  onVoltar: () => void;
}

export function FluxoLink({ onVoltar }: FluxoLinkProps) {
  const [step, setStep] = useState<"form" | "gerado">("form");
  const [valor, setValor] = useState("320,00");
  const [descricao, setDescricao] = useState("Pedido de venda nº 521");
  const [vencimento, setVencimento] = useState("09/09/2025");
  const [copied, setCopied] = useState(false);

  const linkGerado = "https://pague.meioo.com.br/c/avante/p8x2k";

  function handleCopiar() {
    navigator.clipboard.writeText(linkGerado);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (step === "gerado") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setStep("form")}
            className="text-muted hover:text-dark transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <h3 className="font-semibold text-dark text-sm">Link Gerado</h3>
          <div className="ml-auto">
            <MeiooIcon size={18} variant="badge" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ExternalLink size={22} className="text-primary" />
          </div>

          <div className="text-center">
            <p className="font-semibold text-dark">Link de pagamento pronto!</p>
            <p className="text-xs text-muted mt-1">
              Compartilhe com seu cliente
            </p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-dark">
              R$ {parseFloat(valor.replace(",", ".")).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted mt-1">{descricao}</p>
            <p className="text-xs text-muted">Vence em {vencimento}</p>
          </div>

          {/* Preview do link */}
          <div className="w-full bg-white border border-border rounded-xl overflow-hidden shadow-card">
            <div className="h-1.5 bg-primary" />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
                <span className="text-xs font-semibold text-dark">Avante Soluções</span>
                <MeiooIcon size={13} variant="badge" className="ml-auto" />
              </div>
              <p className="text-[11px] text-muted mb-2">{descricao}</p>
              <p className="text-lg font-bold text-dark mb-3">
                R$ {parseFloat(valor.replace(",", ".")).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-8 rounded-lg bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <path d="M14 14h.01M14 17h.01M17 14h.01M17 17h3M20 14v3" />
                  </svg>
                  Pix
                </div>
                <div className="h-8 rounded-lg bg-bg text-dark text-[10px] font-semibold flex items-center justify-center gap-1 border border-border">
                  Boleto
                </div>
              </div>
            </div>
          </div>

          {/* Link URL */}
          <div className="w-full bg-bg rounded-lg p-3 flex items-center gap-2">
            <span className="text-[11px] text-dark flex-1 truncate font-mono">
              {linkGerado}
            </span>
            <button
              onClick={handleCopiar}
              className={`h-7 px-2.5 rounded flex items-center gap-1.5 text-[11px] font-medium transition-all shrink-0
                ${copied ? "bg-success-bg text-success" : "bg-primary text-white hover:bg-primary-hover"}`}
            >
              {copied ? <CheckCircle2 size={11} /> : <Copy size={11} />}
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>

          <div className="flex gap-2 w-full">
            <button className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium bg-bg text-dark border border-border hover:border-primary hover:text-primary transition-all">
              <Share2 size={13} />
              Compartilhar
            </button>
            <button className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium bg-bg text-dark border border-border hover:border-primary hover:text-primary transition-all">
              <ExternalLink size={13} />
              Abrir link
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-muted bg-primary-subtle rounded-lg px-3 py-2 w-full">
            <MeiooIcon size={14} variant="badge" />
            <span>
              Link processado pela <strong className="text-dark">Meioo</strong> via conta Avante
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
            <ExternalLink size={14} className="text-primary" />
          </div>
          <h3 className="font-semibold text-dark text-sm">Link de Pagamento</h3>
        </div>
        <div className="ml-auto">
          <MeiooIcon size={18} variant="badge" />
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-1">
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
            Descrição
          </label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Pedido nº 521"
            className="w-full px-3 h-9 rounded-lg border border-border text-xs text-dark bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-muted"
          />
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
            Formas de pagamento aceitas
          </label>
          <div className="flex gap-2">
            {["Pix", "Boleto"].map((meio) => (
              <label
                key={meio}
                className="flex items-center gap-1.5 text-xs text-dark cursor-pointer"
              >
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-border accent-primary"
                />
                {meio}
              </label>
            ))}
          </div>
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
      </div>

      <div className="flex gap-2 mt-6 pt-4 border-t border-border">
        <button
          onClick={onVoltar}
          className="flex-1 h-9 rounded-lg border border-border text-xs font-medium text-muted hover:text-dark transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={() => setStep("gerado")}
          className="flex-1 h-9 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors flex items-center justify-center gap-1.5"
        >
          <ExternalLink size={13} />
          Gerar Link
        </button>
      </div>
    </div>
  );
}
