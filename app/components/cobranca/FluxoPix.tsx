"use client";

import { useState } from "react";
import { MeiooIcon } from "../MeiooIcon";
import { Copy, CheckCircle2, Share2, ArrowLeft } from "lucide-react";

interface FluxoPixProps {
  onVoltar: () => void;
}

export function FluxoPix({ onVoltar }: FluxoPixProps) {
  const [step, setStep] = useState<"form" | "qrcode">("form");
  const [valor, setValor] = useState("149,00");
  const [descricao, setDescricao] = useState("");
  const [vencimento, setVencimento] = useState("09/09/2025");
  const [copied, setCopied] = useState(false);
  const [gerado, setGerado] = useState(false);

  const pixCode =
    "00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540514.005802BR5925AVANTE SOLUCOES LTDA6014Belo Horizonte62070503***63041234";

  function handleCopiar() {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (step === "qrcode") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setStep("form")}
            className="text-muted hover:text-dark transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <h3 className="font-semibold text-dark text-sm">QR Code Pix</h3>
          <div className="ml-auto">
            <MeiooIcon size={18} variant="badge" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 flex-1">
          {/* QR Code simulado */}
          <div className="bg-white border-2 border-border rounded-xl p-4 shadow-card">
            <div
              className="grid gap-0.5"
              style={{
                width: 180,
                height: 180,
                display: "grid",
                gridTemplateColumns: "repeat(18, 1fr)",
                gridTemplateRows: "repeat(18, 1fr)",
              }}
            >
              {Array.from({ length: 324 }).map((_, i) => (
                <div
                  key={i}
                  className={
                    Math.random() > 0.5 || i < 63 || i > 261
                      ? "bg-dark"
                      : "bg-white"
                  }
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-xl font-bold text-dark">
              R${" "}
              {parseFloat(valor.replace(",", ".")).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-muted mt-0.5">
              Vence em {vencimento}
            </p>
          </div>

          <div className="w-full bg-bg rounded-lg p-3">
            <p className="text-[10px] text-muted mb-1.5 font-medium uppercase tracking-wide">
              Código Pix Copia e Cola
            </p>
            <p className="text-[11px] text-dark break-all leading-relaxed font-mono">
              {pixCode.substring(0, 60)}...
            </p>
          </div>

          <div className="flex gap-2 w-full">
            <button
              onClick={handleCopiar}
              className={`flex-1 h-9 flex items-center justify-center gap-2 rounded-lg text-xs font-medium transition-all border
                ${copied ? "bg-success-bg text-success border-success/30" : "bg-bg text-dark border-border hover:border-primary hover:text-primary"}`}
            >
              {copied ? (
                <>
                  <CheckCircle2 size={13} />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy size={13} />
                  Copiar código
                </>
              )}
            </button>
            <button className="flex-1 h-9 flex items-center justify-center gap-2 rounded-lg text-xs font-medium bg-bg text-dark border border-border hover:border-primary hover:text-primary transition-all">
              <Share2 size={13} />
              Compartilhar
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-muted bg-primary-subtle rounded-lg px-3 py-2 w-full">
            <MeiooIcon size={14} variant="badge" />
            <span>
              Pix processado pela <strong className="text-dark">Meioo</strong> via conta Avante
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
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <path d="M14 14h.01M14 17h.01M17 14h.01M17 17h3M20 14v3" />
            </svg>
          </div>
          <h3 className="font-semibold text-dark text-sm">Gerar Pix</h3>
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
            Descrição (opcional)
          </label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Pedido nº 446"
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
            Conta bancária
          </label>
          <div className="flex items-center gap-2 px-3 h-9 rounded-lg border border-border bg-white">
            <MeiooIcon size={14} variant="badge" />
            <span className="text-xs text-dark font-medium">Conta Meioo</span>
          </div>
        </div>

        <p className="text-[11px] text-muted leading-relaxed">
          Este pagamento contém taxas, saiba mais sobre as{" "}
          <span className="text-primary cursor-pointer hover:underline">
            tarifas da conta digital
          </span>
          .
        </p>
      </div>

      <div className="flex gap-2 mt-6 pt-4 border-t border-border">
        <button
          onClick={onVoltar}
          className="flex-1 h-9 rounded-lg border border-border text-xs font-medium text-muted hover:text-dark transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={() => { setGerado(true); setStep("qrcode"); }}
          className="flex-1 h-9 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors flex items-center justify-center gap-1.5"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <path d="M14 14h.01M14 17h.01M17 14h.01M17 17h3M20 14v3" />
          </svg>
          Gerar QR Code
        </button>
      </div>
    </div>
  );
}
