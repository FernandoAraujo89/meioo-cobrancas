"use client";

import { useState } from "react";
import { MeiooIcon } from "../MeiooIcon";
import { ArrowLeft, CheckCircle2, QrCode, Search } from "lucide-react";

interface FluxoPagarProps {
  onVoltar: () => void;
}

export function FluxoPagar({ onVoltar }: FluxoPagarProps) {
  const [step, setStep] = useState<"form" | "confirmar" | "pago">("form");
  const [tipoChave, setTipoChave] = useState<"cpf" | "email" | "telefone" | "aleatoria">("cpf");
  const [chave, setChave] = useState("");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");

  const tiposChave = [
    { value: "cpf",       label: "CPF/CNPJ" },
    { value: "email",     label: "E-mail" },
    { value: "telefone",  label: "Telefone" },
    { value: "aleatoria", label: "Chave aleatória" },
  ] as const;

  if (step === "pago") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => { setStep("form"); setChave(""); setValor(""); }} className="text-muted hover:text-dark transition-colors">
            <ArrowLeft size={16} />
          </button>
          <h3 className="font-semibold text-dark text-sm">Pagamento Enviado</h3>
          <div className="ml-auto"><MeiooIcon size={18} variant="badge" /></div>
        </div>

        <div className="flex flex-col items-center gap-5 flex-1 pt-4">
          <div className="w-14 h-14 rounded-full bg-success-bg flex items-center justify-center">
            <CheckCircle2 size={28} className="text-success" />
          </div>

          <div className="text-center">
            <p className="font-bold text-dark text-base">Pagamento realizado!</p>
            <p className="text-xs text-muted mt-1">Processado com sucesso via Meioo</p>
          </div>

          <div className="w-full bg-bg rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-[11px] text-muted">Valor enviado</span>
              <span className="text-[11px] font-bold text-dark">
                R$ {parseFloat(valor.replace(",", ".") || "0").toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[11px] text-muted">Chave Pix</span>
              <span className="text-[11px] font-medium text-dark truncate max-w-[60%] text-right">{chave}</span>
            </div>
            {descricao && (
              <div className="flex justify-between">
                <span className="text-[11px] text-muted">Descrição</span>
                <span className="text-[11px] font-medium text-dark">{descricao}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-3">
              <span className="text-[11px] text-muted">Comprovante</span>
              <span className="text-[11px] font-mono text-primary">E2024031800001234</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-muted bg-primary-subtle rounded-lg px-3 py-2 w-full">
            <MeiooIcon size={14} variant="badge" />
            <span>Pix enviado pela <strong className="text-dark">Meioo</strong> via conta Avante</span>
          </div>
        </div>
      </div>
    );
  }

  if (step === "confirmar") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setStep("form")} className="text-muted hover:text-dark transition-colors">
            <ArrowLeft size={16} />
          </button>
          <h3 className="font-semibold text-dark text-sm">Confirmar Pagamento</h3>
          <div className="ml-auto"><MeiooIcon size={18} variant="badge" /></div>
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <div className="bg-bg rounded-xl p-4 space-y-3">
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wide">Resumo do pagamento</p>
            <div className="flex justify-between">
              <span className="text-xs text-muted">Destinatário</span>
              <span className="text-xs font-medium text-dark truncate max-w-[60%] text-right">{chave}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted">Tipo de chave</span>
              <span className="text-xs font-medium text-dark">{tiposChave.find(t => t.value === tipoChave)?.label}</span>
            </div>
            {descricao && (
              <div className="flex justify-between">
                <span className="text-xs text-muted">Descrição</span>
                <span className="text-xs font-medium text-dark">{descricao}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-3">
              <span className="text-sm font-semibold text-dark">Total</span>
              <span className="text-sm font-bold text-dark">
                R$ {parseFloat(valor.replace(",", ".") || "0").toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-warning-bg rounded-lg p-3">
            <span className="text-warning mt-0.5 shrink-0">⚠</span>
            <p className="text-[11px] text-warning leading-relaxed">
              Verifique os dados antes de confirmar. Pagamentos Pix são irreversíveis.
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-6 pt-4 border-t border-border">
          <button onClick={() => setStep("form")} className="flex-1 h-9 rounded-lg border border-border text-xs font-medium text-muted hover:text-dark transition-colors">
            Voltar
          </button>
          <button
            onClick={() => setStep("pago")}
            className="flex-1 h-9 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors flex items-center justify-center gap-1.5"
          >
            <QrCode size={13} />
            Confirmar Pix
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onVoltar} className="text-muted hover:text-dark transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2c6eff" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
            </svg>
          </div>
          <h3 className="font-semibold text-dark text-sm">Pagar via Pix</h3>
        </div>
        <div className="ml-auto"><MeiooIcon size={18} variant="badge" /></div>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <div>
          <label className="block text-[11px] font-semibold text-muted uppercase tracking-wide mb-1.5">Tipo de chave Pix</label>
          <div className="grid grid-cols-2 gap-2">
            {tiposChave.map((t) => (
              <button
                key={t.value}
                onClick={() => setTipoChave(t.value)}
                className={`h-8 rounded-lg text-xs font-medium border transition-all
                  ${tipoChave === t.value
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-white border-border text-dark hover:border-primary/50"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-muted uppercase tracking-wide mb-1.5">
            Chave Pix do destinatário
          </label>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text" value={chave} onChange={(e) => setChave(e.target.value)}
              placeholder={
                tipoChave === "cpf" ? "000.000.000-00" :
                tipoChave === "email" ? "email@exemplo.com" :
                tipoChave === "telefone" ? "+55 (11) 99999-9999" :
                "Cole a chave aleatória aqui"
              }
              className="w-full pl-8 pr-3 h-9 rounded-lg border border-border text-xs text-dark bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-muted"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-muted uppercase tracking-wide mb-1.5">Valor</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs font-medium">R$</span>
            <input
              type="text" value={valor} onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
              className="w-full pl-8 pr-3 h-9 rounded-lg border border-border text-sm font-semibold text-dark bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-muted"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-muted uppercase tracking-wide mb-1.5">Descrição (opcional)</label>
          <input
            type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Pagamento fornecedor"
            className="w-full px-3 h-9 rounded-lg border border-border text-xs text-dark bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-muted"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-muted uppercase tracking-wide mb-1.5">Conta de origem</label>
          <div className="flex items-center gap-2 px-3 h-9 rounded-lg border border-border bg-white">
            <MeiooIcon size={14} variant="badge" />
            <span className="text-xs text-dark font-medium">Conta Digital Meioo</span>
            <span className="ml-auto text-[11px] text-success font-semibold">Saldo: R$12.650,00</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-6 pt-4 border-t border-border">
        <button onClick={onVoltar} className="flex-1 h-9 rounded-lg border border-border text-xs font-medium text-muted hover:text-dark transition-colors">
          Cancelar
        </button>
        <button
          onClick={() => setStep("confirmar")}
          disabled={!chave || !valor}
          className="flex-1 h-9 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
