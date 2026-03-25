"use client";

import { useState } from "react";
import { MeiooIcon } from "../MeiooIcon";
import { ArrowLeft, CheckCircle2, Share2, Copy, Wifi } from "lucide-react";

interface FluxoCartaoProps {
  onVoltar: () => void;
}

const maquininhas = [
  { id: "1", nome: "Caixa Principal", modelo: "Stone S920", status: "online" },
  { id: "2", nome: "Balcão 2", modelo: "PagSeguro Moderninha", status: "online" },
  { id: "3", nome: "Caixa 3", modelo: "Cielo LIO", status: "offline" },
];

type Modo = "link" | "maquininha";

export function FluxoCartao({ onVoltar }: FluxoCartaoProps) {
  const [step, setStep] = useState<"form" | "gerado" | "enviado">("form");
  const [modo, setModo] = useState<Modo>("link");
  const [valor, setValor] = useState("320,00");
  const [descricao, setDescricao] = useState("");
  const [parcelas, setParcelas] = useState("1");
  const [vencimento, setVencimento] = useState("09/09/2025");
  const [copied, setCopied] = useState(false);
  const [maquininhaId, setMaquininhaId] = useState("1");

  const linkGerado = "https://pague.meioo.com.br/c/avante/cartao-k9m3x";
  const maquininhaSelecionada = maquininhas.find(m => m.id === maquininhaId);

  function handleCopiar() {
    navigator.clipboard.writeText(linkGerado);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Sucesso: enviado para maquininha ──────────────────────────────────────
  if (step === "enviado") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setStep("form")} className="text-muted hover:text-dark transition-colors">
            <ArrowLeft size={16} />
          </button>
          <h3 className="font-semibold text-dark text-sm">Cobrança Enviada</h3>
          <div className="ml-auto"><MeiooIcon size={18} variant="badge" /></div>
        </div>

        <div className="flex flex-col items-center gap-5 flex-1 pt-4">
          <div className="w-14 h-14 rounded-full bg-success-bg flex items-center justify-center">
            <CheckCircle2 size={28} className="text-success" />
          </div>

          <div className="text-center">
            <p className="font-bold text-dark text-base">Cobrança enviada!</p>
            <p className="text-xs text-muted mt-1">A maquininha está aguardando o pagamento</p>
          </div>

          <div className="w-full bg-bg rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-[11px] text-muted">Valor</span>
              <span className="text-[11px] font-bold text-dark">
                R$ {parseFloat(valor.replace(",", ".") || "0").toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            {parseInt(parcelas) > 1 && (
              <div className="flex justify-between">
                <span className="text-[11px] text-muted">Parcelamento</span>
                <span className="text-[11px] font-medium text-dark">
                  {parcelas}x de R$ {(parseFloat(valor.replace(",", ".") || "0") / parseInt(parcelas)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
            {descricao && (
              <div className="flex justify-between">
                <span className="text-[11px] text-muted">Descrição</span>
                <span className="text-[11px] font-medium text-dark">{descricao}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-3 items-center">
              <span className="text-[11px] text-muted">Maquininha</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                <span className="text-[11px] font-medium text-dark">{maquininhaSelecionada?.nome}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-muted">Modelo</span>
              <span className="text-[11px] text-muted">{maquininhaSelecionada?.modelo}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-muted bg-primary-subtle rounded-lg px-3 py-2 w-full">
            <MeiooIcon size={14} variant="badge" />
            <span>Cartão processado pela <strong className="text-dark">Meioo</strong> via conta Avante</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Sucesso: link gerado ──────────────────────────────────────────────────
  if (step === "gerado") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setStep("form")} className="text-muted hover:text-dark transition-colors">
            <ArrowLeft size={16} />
          </button>
          <h3 className="font-semibold text-dark text-sm">Link de Cartão Gerado</h3>
          <div className="ml-auto"><MeiooIcon size={18} variant="badge" /></div>
        </div>

        <div className="flex flex-col items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-success-bg flex items-center justify-center">
            <CheckCircle2 size={24} className="text-success" />
          </div>

          <div className="text-center">
            <p className="font-semibold text-dark">Link de cartão pronto!</p>
            <p className="text-xs text-muted mt-1">Compartilhe com seu cliente</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-dark">
              R$ {parseFloat(valor.replace(",", ".")).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            {parseInt(parcelas) > 1 && (
              <p className="text-xs text-muted mt-1">em {parcelas}x de R$ {(parseFloat(valor.replace(",", ".")) / parseInt(parcelas)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
            )}
            {descricao && <p className="text-xs text-muted">{descricao}</p>}
          </div>

          {/* Card preview */}
          <div className="w-full bg-white border border-border rounded-xl overflow-hidden shadow-card">
            <div className="h-1.5 bg-primary" />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold">A</div>
                <span className="text-xs font-semibold text-dark">Avante Soluções</span>
                <MeiooIcon size={13} variant="badge" className="ml-auto" />
              </div>
              <p className="text-lg font-bold text-dark mb-3">
                R$ {parseFloat(valor.replace(",", ".")).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
              <div className="h-8 rounded-lg bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                Pagar com Cartão
              </div>
            </div>
          </div>

          <div className="w-full bg-bg rounded-lg p-3 flex items-center gap-2">
            <span className="text-[11px] text-dark flex-1 truncate font-mono">{linkGerado}</span>
            <button
              onClick={handleCopiar}
              className={`h-7 px-2.5 rounded flex items-center gap-1.5 text-[11px] font-medium transition-all shrink-0
                ${copied ? "bg-success-bg text-success" : "bg-primary text-white hover:bg-primary-hover"}`}
            >
              <Copy size={11} />{copied ? "Copiado" : "Copiar"}
            </button>
          </div>

          <button className="w-full h-9 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium bg-bg text-dark border border-border hover:border-primary hover:text-primary transition-all">
            <Share2 size={13} />Compartilhar
          </button>

          <div className="flex items-center gap-2 text-[11px] text-muted bg-primary-subtle rounded-lg px-3 py-2 w-full">
            <MeiooIcon size={14} variant="badge" />
            <span>Cartão processado pela <strong className="text-dark">Meioo</strong> via conta Avante</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Formulário ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onVoltar} className="text-muted hover:text-dark transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2c6eff" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <h3 className="font-semibold text-dark text-sm">Cobrar no Cartão</h3>
        </div>
        <div className="ml-auto"><MeiooIcon size={18} variant="badge" /></div>
      </div>

      {/* Modo selector */}
      <div className="flex rounded-lg border border-border bg-bg p-1 gap-1 mb-4">
        <button
          onClick={() => setModo("link")}
          className={`flex-1 h-7 rounded text-xs font-medium transition-all flex items-center justify-center gap-1.5
            ${modo === "link" ? "bg-white text-primary shadow-sm border border-border" : "text-muted hover:text-dark"}`}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          Link de Pagamento
        </button>
        <button
          onClick={() => setModo("maquininha")}
          className={`flex-1 h-7 rounded text-xs font-medium transition-all flex items-center justify-center gap-1.5
            ${modo === "maquininha" ? "bg-white text-primary shadow-sm border border-border" : "text-muted hover:text-dark"}`}
        >
          <Wifi size={11} />
          Maquininha
        </button>
      </div>

      <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
        <div>
          <label className="block text-[11px] font-semibold text-muted uppercase tracking-wide mb-1.5">Valor</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs font-medium">R$</span>
            <input
              type="text" value={valor} onChange={(e) => setValor(e.target.value)}
              className="w-full pl-8 pr-3 h-9 rounded-lg border border-border text-sm font-semibold text-dark bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-muted uppercase tracking-wide mb-1.5">Descrição (opcional)</label>
          <input
            type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Pedido nº 521"
            className="w-full px-3 h-9 rounded-lg border border-border text-xs text-dark bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-muted"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-muted uppercase tracking-wide mb-1.5">Parcelamento</label>
          <select
            value={parcelas} onChange={(e) => setParcelas(e.target.value)}
            className="w-full px-3 h-9 rounded-lg border border-border text-xs text-dark bg-white focus:outline-none focus:border-primary"
          >
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
              <option key={n} value={n}>
                {n}x {n > 1 ? `de R$ ${(parseFloat(valor.replace(",",".") || "0") / n).toLocaleString("pt-BR",{minimumFractionDigits:2})}` : "(à vista)"}
              </option>
            ))}
          </select>
        </div>

        {modo === "link" && (
          <div>
            <label className="block text-[11px] font-semibold text-muted uppercase tracking-wide mb-1.5">Vencimento</label>
            <input
              type="text" value={vencimento} onChange={(e) => setVencimento(e.target.value)}
              className="w-full px-3 h-9 rounded-lg border border-border text-xs text-dark bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
        )}

        {modo === "maquininha" && (
          <div>
            <label className="block text-[11px] font-semibold text-muted uppercase tracking-wide mb-1.5">Maquininha</label>
            <div className="flex flex-col gap-2">
              {maquininhas.map(m => (
                <button
                  key={m.id}
                  onClick={() => m.status === "online" && setMaquininhaId(m.id)}
                  disabled={m.status === "offline"}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all
                    ${m.status === "offline" ? "opacity-40 cursor-not-allowed border-border bg-bg" :
                      maquininhaId === m.id ? "border-primary bg-primary/5" : "border-border bg-white hover:border-primary/50"}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0
                    ${maquininhaId === m.id && m.status === "online" ? "bg-primary/10" : "bg-bg"}`}>
                    <Wifi size={13} className={maquininhaId === m.id && m.status === "online" ? "text-primary" : "text-muted"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-dark">{m.nome}</p>
                    <p className="text-[10px] text-muted">{m.modelo}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`w-1.5 h-1.5 rounded-full ${m.status === "online" ? "bg-success" : "bg-muted"}`} />
                    <span className="text-[10px] text-muted capitalize">{m.status}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-[11px] font-semibold text-muted uppercase tracking-wide mb-1.5">Conta bancária</label>
          <div className="flex items-center gap-2 px-3 h-9 rounded-lg border border-border bg-white">
            <MeiooIcon size={14} variant="badge" />
            <span className="text-xs text-dark font-medium">Conta Digital Meioo</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-6 pt-4 border-t border-border">
        <button onClick={onVoltar} className="flex-1 h-9 rounded-lg border border-border text-xs font-medium text-muted hover:text-dark transition-colors">
          Cancelar
        </button>
        {modo === "link" ? (
          <button
            onClick={() => setStep("gerado")}
            className="flex-1 h-9 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors flex items-center justify-center gap-1.5"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            Gerar Link de Cartão
          </button>
        ) : (
          <button
            onClick={() => setStep("enviado")}
            className="flex-1 h-9 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors flex items-center justify-center gap-1.5"
          >
            <Wifi size={13} />
            Enviar para Maquininha
          </button>
        )}
      </div>
    </div>
  );
}
