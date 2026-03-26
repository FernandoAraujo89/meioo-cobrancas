"use client";

import { useEffect } from "react";
import { X, QrCode, FileText, ExternalLink } from "lucide-react";
import { MeiooIcon } from "../MeiooIcon";
import { FluxoPix } from "./FluxoPix";
import { FluxoBoleto } from "./FluxoBoleto";
import { FluxoLink } from "./FluxoLink";
import { FluxoCartao } from "./FluxoCartao";
import { FluxoPagar } from "./FluxoPagar";

type TipoFluxo = "menu" | "pix" | "boleto" | "link" | "cartao" | "pagar";

interface PainelCobrancaProps {
  aberto: boolean;
  fluxo: TipoFluxo;
  onFechar: () => void;
  onFluxo: (tipo: TipoFluxo) => void;
}

const opcoes = [
  {
    tipo: "pix" as const,
    icon: QrCode,
    titulo: "Gerar Pix",
    descricao: "Gere um QR Code Pix para receber pagamentos automaticamente.",
    badge: "OLIST CONTA DIGITAL",
  },
  {
    tipo: "boleto" as const,
    icon: FileText,
    titulo: "Emitir Boleto",
    descricao: "Gere um boleto bancário que pode ser pago por qualquer banco.",
    badge: "OLIST CONTA DIGITAL",
  },
  {
    tipo: "link" as const,
    icon: ExternalLink,
    titulo: "Link de Pagamento",
    descricao: "Crie um link para seu cliente escolher a forma de pagamento.",
    badge: "OLIST CONTA DIGITAL",
  },
];

export function PainelCobranca({
  aberto,
  fluxo,
  onFechar,
  onFluxo,
}: PainelCobrancaProps) {
  // Fechar com ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFechar();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onFechar]);

  return (
    <>
      {/* Overlay */}
      {aberto && (
        <div
          className="fixed inset-0 bg-dark/30 z-40 transition-opacity"
          onClick={onFechar}
        />
      )}

      {/* Painel lateral direito */}
      <div
        className={`fixed top-0 right-0 h-full w-[360px] bg-surface z-50 flex flex-col transition-transform duration-300 ease-in-out
          ${aberto ? "translate-x-0" : "translate-x-full"}`}
        style={{ boxShadow: "-4px 0 32px rgba(40,46,63,0.12)" }}
      >
        {/* Header do painel */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-dark text-sm">
              {fluxo === "menu" ? "Incluir cobrança" :
               fluxo === "pagar" ? "Pagar via Pix" : ""}
            </h2>
            {(fluxo === "menu" || fluxo === "pagar") && <MeiooIcon size={16} variant="badge" />}
          </div>
          <button
            onClick={onFechar}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-bg text-muted hover:text-dark transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-5">
          {fluxo === "menu" && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-muted mb-1">
                Escolha como quer receber esta cobrança:
              </p>
              {opcoes.map((op) => {
                const Icon = op.icon;
                return (
                  <button
                    key={op.tipo}
                    onClick={() => onFluxo(op.tipo)}
                    className="group w-full text-left p-4 rounded-xl border border-border bg-white hover:border-primary hover:shadow-panel transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Icon size={16} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-sm text-dark">
                            {op.titulo}
                          </span>
                        </div>
                        <p className="text-xs text-muted leading-relaxed">
                          {op.descricao}
                        </p>
                        <span className="inline-flex items-center gap-1 mt-2 text-[10px] text-primary font-semibold uppercase tracking-wide">
                          <MeiooIcon size={11} variant="badge" />
                          VIA MEIOO
                        </span>
                      </div>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-muted group-hover:text-primary transition-colors shrink-0 mt-1"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </button>
                );
              })}

              <div className="mt-2 p-3 rounded-xl bg-bg border border-border">
                <p className="text-[11px] text-muted leading-relaxed">
                  <strong className="text-dark">Incluir manualmente</strong> — Cadastre uma
                  cobrança sem usar a conta digital Meioo.
                </p>
                <button className="mt-2 text-[11px] text-primary font-medium hover:underline">
                  Incluir sem conta digital →
                </button>
              </div>
            </div>
          )}

          {fluxo === "pix" && <FluxoPix onVoltar={() => onFluxo("menu")} />}
          {fluxo === "boleto" && <FluxoBoleto onVoltar={() => onFluxo("menu")} />}
          {fluxo === "link" && <FluxoLink onVoltar={() => onFluxo("menu")} />}
          {fluxo === "cartao" && <FluxoCartao onVoltar={() => onFluxo("menu")} />}
          {fluxo === "pagar" && <FluxoPagar onVoltar={() => onFluxo("menu")} />}
        </div>
      </div>
    </>
  );
}
