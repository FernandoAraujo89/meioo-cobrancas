"use client";

import { MeiooIcon } from "../MeiooIcon";
import { Eye, MoreHorizontal, QrCode, FileText, Link2 } from "lucide-react";

interface Cobranca {
  id: string;
  cliente: string;
  historico: string;
  vencimento: string;
  valor: number;
  saldo: number;
  status: "em_aberto" | "vencido" | "recebido" | "cancelado";
  meio?: "pix" | "boleto" | "link";
}

const mockData: Cobranca[] = [
  {
    id: "1",
    cliente: "Armando Bagunça",
    historico: "Bol. ao pedido de venda nº 446",
    vencimento: "25/08/2025",
    valor: 149.0,
    saldo: 149.0,
    status: "vencido",
    meio: "boleto",
  },
  {
    id: "2",
    cliente: "GUST SERVIÇOS DIGISMO LTDA",
    historico: "Conta importada automaticamente do banco",
    vencimento: "24/08/2025",
    valor: 100.0,
    saldo: 0.0,
    status: "recebido",
    meio: "pix",
  },
  {
    id: "3",
    cliente: "Lorena Calaca Ferreira",
    historico: "Conta importada automaticamente do banco",
    vencimento: "31/08/2025",
    valor: 1.02,
    saldo: 0.51,
    status: "em_aberto",
    meio: "pix",
  },
  {
    id: "4",
    cliente: "Jhonathan Ballerino",
    historico: "Pedido de venda nº 521",
    vencimento: "25/08/2025",
    valor: 320.0,
    saldo: 320.0,
    status: "em_aberto",
    meio: "link",
  },
  {
    id: "5",
    cliente: "Rafa Tomaz Cherne",
    historico: "Bol. ao pedido de venda nº 388",
    vencimento: "25/08/2025",
    valor: 10.0,
    saldo: 10.0,
    status: "em_aberto",
    meio: "boleto",
  },
  {
    id: "6",
    cliente: "Maria Silva Pereira",
    historico: "Link de pagamento gerado",
    vencimento: "28/08/2025",
    valor: 500.0,
    saldo: 500.0,
    status: "em_aberto",
    meio: "link",
  },
  {
    id: "7",
    cliente: "Tech Soluções ME",
    historico: "Pix recorrente mensal",
    vencimento: "01/09/2025",
    valor: 1200.0,
    saldo: 1200.0,
    status: "em_aberto",
    meio: "pix",
  },
];

const statusConfig = {
  em_aberto: { label: "Em aberto", className: "bg-warning-bg text-warning" },
  vencido: { label: "Vencido", className: "bg-danger-bg text-danger" },
  recebido: { label: "Recebido", className: "bg-success-bg text-success" },
  cancelado: { label: "Cancelado", className: "bg-border text-muted" },
};

const meiooMeioIcon = {
  pix: <QrCode size={13} className="text-primary" />,
  boleto: <FileText size={13} className="text-primary" />,
  link: <Link2 size={13} className="text-primary" />,
};

const meiooMeioLabel = {
  pix: "Pix",
  boleto: "Boleto",
  link: "Link",
};

const filtroParaStatus: Record<string, string[]> = {
  "Em aberto":  ["em_aberto"],
  "A vencer":   ["vencido"],
  "Pendente":   ["pendente"],
  "Recebido":   ["recebido"],
  "Cancelado":  ["cancelado"],
  "Todos":      [],
};

export function contarPorFiltro(filtro: string): number {
  const statuses = filtroParaStatus[filtro];
  if (!statuses || statuses.length === 0) return mockData.length;
  return mockData.filter(r => statuses.includes(r.status)).length;
}

interface ContasReceberTableProps {
  filtro?: string;
  onAcao?: (id: string, tipo: "pix" | "boleto" | "link") => void;
}

export function ContasReceberTable({ filtro = "Todos", onAcao }: ContasReceberTableProps) {
  const statuses = filtroParaStatus[filtro] ?? [];
  const rows = statuses.length === 0 ? mockData : mockData.filter(r => statuses.includes(r.status));

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden shadow-card">
      {rows.length === 0 && (
        <p className="text-xs text-muted text-center py-10">Nenhuma cobrança nesta categoria.</p>
      )}
      {rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[520px]">
            <thead>
              <tr className="border-b border-border bg-bg/50">
                <th className="text-left py-3 px-4 font-semibold text-muted uppercase tracking-wide text-[11px] hidden sm:table-cell">
                  <input type="checkbox" className="rounded border-border" />
                </th>
                <th className="text-left py-3 px-3 sm:px-4 font-semibold text-muted uppercase tracking-wide text-[11px]">
                  Cliente
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted uppercase tracking-wide text-[11px] hidden md:table-cell">
                  Histórico
                </th>
                <th className="text-left py-3 px-3 sm:px-4 font-semibold text-muted uppercase tracking-wide text-[11px]">
                  Vencimento
                </th>
                <th className="text-right py-3 px-3 sm:px-4 font-semibold text-muted uppercase tracking-wide text-[11px]">
                  Valor
                </th>
                <th className="text-right py-3 px-4 font-semibold text-muted uppercase tracking-wide text-[11px] hidden sm:table-cell">
                  Saldo
                </th>
                <th className="text-center py-3 px-3 sm:px-4 font-semibold text-muted uppercase tracking-wide text-[11px]">
                  Status
                </th>
                <th className="text-left py-3 px-3 sm:px-4 font-semibold text-muted uppercase tracking-wide text-[11px]">
                  Meio
                </th>
                <th className="py-3 px-3 sm:px-4" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const st = statusConfig[row.status];
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-border last:border-0 hover:bg-bg/40 transition-colors ${idx % 2 === 0 ? "" : "bg-bg/20"}`}
                  >
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <input type="checkbox" className="rounded border-border" />
                    </td>
                    <td className="py-3 px-3 sm:px-4 font-medium text-dark">
                      {row.cliente}
                    </td>
                    <td className="py-3 px-4 text-muted max-w-[200px] truncate hidden md:table-cell">
                      {row.historico}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-dark">{row.vencimento}</td>
                    <td className="py-3 px-3 sm:px-4 text-right font-medium text-dark">
                      {row.valor.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td className="py-3 px-4 text-right text-dark hidden sm:table-cell">
                      {row.saldo.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${st.className}`}
                      >
                        {st.label}
                      </span>
                    </td>
                    <td className="py-3 px-3 sm:px-4">
                      {row.meio ? (
                        <div className="flex items-center gap-1">
                          <MeiooIcon size={14} variant="badge" className="shrink-0" />
                          <span className="shrink-0">{meiooMeioIcon[row.meio]}</span>
                          <span className="text-[11px] text-muted hidden sm:inline">{meiooMeioLabel[row.meio]}</span>
                        </div>
                      ) : (
                        <span className="text-muted text-[11px]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 sm:px-4">
                      <div className="flex items-center justify-end gap-1">
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
      )}
    </div>
  );
}
