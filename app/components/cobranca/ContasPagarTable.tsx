"use client";

import { MeiooIcon } from "../MeiooIcon";
import { Eye, MoreHorizontal, QrCode, FileText, ArrowRightLeft } from "lucide-react";

interface ContaPagar {
  id: string;
  fornecedor: string;
  historico: string;
  vencimento: string;
  valor: number;
  saldo: number;
  status: "a_pagar" | "atrasado" | "pago" | "cancelado";
  meio?: "pix" | "boleto" | "ted";
}

const mockData: ContaPagar[] = [
  {
    id: "1",
    fornecedor: "Fornecedora ABC Ltda.",
    historico: "NF 0045 — Compra de mercadorias",
    vencimento: "20/08/2025",
    valor: 3200.0,
    saldo: 3200.0,
    status: "atrasado",
    meio: "boleto",
  },
  {
    id: "2",
    fornecedor: "Energia Elétrica CPFL",
    historico: "Fatura de energia — Agosto/2025",
    vencimento: "24/08/2025",
    valor: 890.5,
    saldo: 0.0,
    status: "pago",
    meio: "pix",
  },
  {
    id: "3",
    fornecedor: "Aluguel Comercial SP",
    historico: "Aluguel sala comercial — Agosto/2025",
    vencimento: "05/09/2025",
    valor: 4500.0,
    saldo: 4500.0,
    status: "a_pagar",
    meio: "ted",
  },
  {
    id: "4",
    fornecedor: "Distribuidora Tech ME",
    historico: "NF 1122 — Equipamentos TI",
    vencimento: "10/09/2025",
    valor: 1750.0,
    saldo: 1750.0,
    status: "a_pagar",
    meio: "boleto",
  },
  {
    id: "5",
    fornecedor: "Serviços Cloud AWS",
    historico: "Fatura cloud — Agosto/2025",
    vencimento: "15/09/2025",
    valor: 620.0,
    saldo: 620.0,
    status: "a_pagar",
    meio: "pix",
  },
  {
    id: "6",
    fornecedor: "Seguradora Bradesco",
    historico: "Prêmio seguro empresarial",
    vencimento: "18/09/2025",
    valor: 980.0,
    saldo: 980.0,
    status: "a_pagar",
    meio: "boleto",
  },
  {
    id: "7",
    fornecedor: "Telecom Vivo Empresas",
    historico: "Fatura telefonia — Agosto/2025",
    vencimento: "22/08/2025",
    valor: 340.0,
    saldo: 0.0,
    status: "pago",
    meio: "pix",
  },
];

const statusConfig = {
  a_pagar:  { label: "A pagar",   className: "bg-warning-bg text-warning" },
  atrasado: { label: "Atrasado",  className: "bg-danger-bg text-danger" },
  pago:     { label: "Pago",      className: "bg-success-bg text-success" },
  cancelado:{ label: "Cancelado", className: "bg-border text-muted" },
};

const meioIcon = {
  pix:    <QrCode size={13} className="text-primary" />,
  boleto: <FileText size={13} className="text-primary" />,
  ted:    <ArrowRightLeft size={13} className="text-primary" />,
};

const meioLabel = {
  pix:    "Pix",
  boleto: "Boleto",
  ted:    "TED",
};

interface ContasPagarTableProps {
  onPagar?: (id: string) => void;
}

export function ContasPagarTable({ onPagar }: ContasPagarTableProps) {
  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden shadow-card">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-bg/50">
            <th className="text-left py-3 px-4 font-semibold text-muted uppercase tracking-wide text-[11px]">
              <input type="checkbox" className="rounded border-border" />
            </th>
            <th className="text-left py-3 px-4 font-semibold text-muted uppercase tracking-wide text-[11px]">
              Fornecedor
            </th>
            <th className="text-left py-3 px-4 font-semibold text-muted uppercase tracking-wide text-[11px]">
              Histórico
            </th>
            <th className="text-left py-3 px-4 font-semibold text-muted uppercase tracking-wide text-[11px]">
              Vencimento
            </th>
            <th className="text-right py-3 px-4 font-semibold text-muted uppercase tracking-wide text-[11px]">
              Valor
            </th>
            <th className="text-right py-3 px-4 font-semibold text-muted uppercase tracking-wide text-[11px]">
              Saldo
            </th>
            <th className="text-center py-3 px-4 font-semibold text-muted uppercase tracking-wide text-[11px]">
              Status
            </th>
            <th className="text-left py-3 px-4 font-semibold text-muted uppercase tracking-wide text-[11px]">
              Meio
            </th>
            <th className="py-3 px-4" />
          </tr>
        </thead>
        <tbody>
          {mockData.map((row, idx) => {
            const st = statusConfig[row.status];
            const podeAtuar = row.status === "a_pagar" || row.status === "atrasado";
            return (
              <tr
                key={row.id}
                className={`border-b border-border last:border-0 hover:bg-bg/40 transition-colors ${idx % 2 === 0 ? "" : "bg-bg/20"}`}
              >
                <td className="py-3 px-4">
                  <input type="checkbox" className="rounded border-border" />
                </td>
                <td className="py-3 px-4 font-medium text-dark">
                  {row.fornecedor}
                </td>
                <td className="py-3 px-4 text-muted max-w-[200px] truncate">
                  {row.historico}
                </td>
                <td className={`py-3 px-4 font-medium ${row.status === "atrasado" ? "text-danger" : "text-dark"}`}>
                  {row.vencimento}
                </td>
                <td className="py-3 px-4 text-right font-medium text-dark">
                  {row.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </td>
                <td className="py-3 px-4 text-right text-dark">
                  {row.saldo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${st.className}`}>
                    {st.label}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {row.meio ? (
                    <div className="flex items-center gap-1.5">
                      <MeiooIcon size={14} variant="badge" className="shrink-0" />
                      <span className="shrink-0">{meioIcon[row.meio]}</span>
                      <span className="text-[11px] text-muted">{meioLabel[row.meio]}</span>
                    </div>
                  ) : (
                    <span className="text-muted text-[11px]">—</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    {podeAtuar && (
                      <button
                        onClick={() => onPagar?.(row.id)}
                        className="h-6 px-2 rounded text-[10px] font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        Pagar
                      </button>
                    )}
                    <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-bg text-muted hover:text-dark">
                      <Eye size={13} />
                    </button>
                    <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-bg text-muted hover:text-dark">
                      <MoreHorizontal size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
