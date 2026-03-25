"use client";

import { useEffect, useState } from "react";
import {
  X,
  Eye,
  EyeOff,
  QrCode,
  CreditCard,
  DollarSign,
  MoreHorizontal,
  Plus,
  ChevronRight,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import { MEIOO_ICON_PATH, MEIOO_ICON_VB } from "./MeiooIcon";

/* ─── Meioo Design Tokens (from Figma vmGGJxD54dhMFVXMDQKM2S + style SVG) ── */
const M = {
  // Dark section
  black:      "#000000",
  darkCard:   "#1D1F23",
  dividerDk:  "#2d3339",
  primary:    "#66FD7A",   // green from style SVG
  primaryDim: "#69fd7a",
  white:      "#fefefe",
  offWhite:   "#e3e2e2",
  muted:      "#969696",
  dim:        "#5f5f5f",
  // Light section (transactions)
  lightBg:    "#ffffff",
  lightText:  "#1a1a1a",
  lightSub:   "#888888",
  lightBorder:"#f0f0f0",
  greenBadge: "#E2F7E4",
  greenText:  "#1a8c2d",
  redBadge:   "#FDE8E8",
  redText:    "#c0392b",
  grayBadge:  "#f0f0f0",
  blueLink:   "#2c6eff",
  // Spacing
  sp4: 4, sp8: 8, sp12: 12, sp16: 16, sp20: 20, sp24: 24, sp32: 32,
} as const;

interface PainelMeiooProps {
  aberto: boolean;
  onFechar: () => void;
  onAbrirCobranca: (tipo: "pix" | "boleto" | "link") => void;
}

const transacoes = [
  {
    grupo: "HOJE",
    items: [
      { nome: "Educa Livros Ltda.",       detalhe: "Pix",  valor: +12500.0,  data: "18 Março", tipo: "entrada" },
      { nome: "TechAula Equipamentos",    detalhe: "Pix",  valor: +7800.0,   data: "18 Março", tipo: "entrada" },
    ],
  },
  {
    grupo: "ESTA SEMANA",
    items: [
      { nome: "Cantina Escolar Sabores",  detalhe: "Pix",  valor: -9200.0,   data: "18 Março", tipo: "saida" },
      { nome: "Limpeza",                  detalhe: "Pix",  valor: +3450.0,   data: "18 Março", tipo: "entrada" },
    ],
  },
];

const acoes = [
  { icon: QrCode,         label: "Pix",    tipo: "pix" as const },
  { icon: CreditCard,     label: "Cartão", tipo: null },
  { icon: DollarSign,     label: "Pagar",  tipo: null },
  { icon: MoreHorizontal, label: "Mais",   tipo: null },
];

export function PainelMeioo({ aberto, onFechar, onAbrirCobranca }: PainelMeiooProps) {
  const [saldoVisivel, setSaldoVisivel] = useState(true);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onFechar(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onFechar]);

  return (
    <>
      {/* Overlay */}
      {aberto && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.64)" }}
          onClick={onFechar}
        />
      )}

      {/* Painel */}
      <div
        className="fixed top-0 left-0 h-full z-50 flex flex-col overflow-hidden"
        style={{
          width: 320,
          background: M.black,
          boxShadow: "8px 0 48px rgba(0,0,0,0.72)",
          transform: aberto ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 300ms cubic-bezier(0.4,0,0.2,1)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* ═══════════════ DARK SECTION (top) ═══════════════ */}
        <div style={{ background: M.black, padding: `${M.sp24}px ${M.sp20}px ${M.sp20}px`, flexShrink: 0 }}>

          {/* Top bar: Meioo logo + close */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: M.sp24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: M.sp8 }}>
              <div style={{
                width: 28, height: 20, borderRadius: 4,
                background: M.primary,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg viewBox={MEIOO_ICON_VB} width={21} height={15} fill="none" aria-hidden>
                  <path d={MEIOO_ICON_PATH} fill={M.black} />
                </svg>
              </div>
              <span style={{ color: M.white, fontWeight: 700, fontSize: 15, letterSpacing: -0.3 }}>
                Meioo
              </span>
            </div>

            <button
              onClick={onFechar}
              style={{
                width: 30, height: 30, borderRadius: 8,
                background: "transparent", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: M.muted,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = M.darkCard)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <X size={16} />
            </button>
          </div>

          {/* Saldo */}
          <div style={{ marginBottom: M.sp24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: M.sp8, marginBottom: M.sp8 }}>
              <span style={{
                color: M.muted, fontSize: 11, fontWeight: 600,
                letterSpacing: "0.08em", textTransform: "uppercase",
              }}>
                Seu saldo
              </span>
              <button
                onClick={() => setSaldoVisivel(v => !v)}
                style={{ background: "none", border: "none", cursor: "pointer", color: M.dim, padding: 0, display: "flex" }}
              >
                {saldoVisivel ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>
            <div style={{
              color: M.white, fontSize: 32, fontWeight: 800,
              letterSpacing: -1.5, lineHeight: 1,
            }}>
              {saldoVisivel ? "R$12.650,00" : "R$ ••••••"}
            </div>
          </div>

          {/* Cartões */}
          <div style={{ marginBottom: M.sp24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: M.sp12 }}>
              <span style={{
                color: M.muted, fontSize: 11, fontWeight: 600,
                letterSpacing: "0.08em", textTransform: "uppercase",
              }}>
                Cartões
              </span>
              <button style={{
                width: 22, height: 22, borderRadius: 6,
                border: `1px solid ${M.dividerDk}`, background: "transparent",
                color: M.muted, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Plus size={12} />
              </button>
            </div>
            <div style={{ display: "flex", gap: M.sp8 }}>
              {/* Green Meioo card */}
              <div style={{
                width: 64, height: 40, borderRadius: 4,
                background: M.primary,
                display: "flex", alignItems: "flex-end", justifyContent: "flex-start",
                padding: 5,
              }}>
                <svg viewBox={MEIOO_ICON_VB} width={14} height={10} fill="none" aria-hidden>
                  <path d={MEIOO_ICON_PATH} fill={M.black} />
                </svg>
              </div>
              {/* Gray card */}
              <div style={{
                width: 64, height: 40, borderRadius: 4,
                background: "#DFDFDF",
                display: "flex", alignItems: "flex-end", justifyContent: "flex-start",
                padding: 5,
              }}>
                <div style={{ width: 20, height: 3, borderRadius: 1, background: "#bbb" }} />
              </div>
            </div>
          </div>

          {/* Action pills — Pix, Cartão, Pagar, Mais */}
          <div style={{ display: "flex", gap: M.sp8, justifyContent: "flex-start" }}>
            {acoes.map(({ icon: Icon, label, tipo }) => (
              <button
                key={label}
                onClick={() => {
                  if (tipo) { onFechar(); onAbrirCobranca(tipo); }
                }}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  background: "transparent", border: "none", cursor: tipo ? "pointer" : "default",
                  padding: 0,
                }}
              >
                <div
                  style={{
                    width: 48, height: 34, borderRadius: 17,
                    background: M.darkCard,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 150ms",
                  }}
                  onMouseEnter={e => { if (tipo) e.currentTarget.style.background = "#2a2e35"; }}
                  onMouseLeave={e => { if (tipo) e.currentTarget.style.background = M.darkCard; }}
                >
                  <Icon size={15} color={M.white} />
                </div>
                <span style={{ color: M.offWhite, fontSize: 10, fontWeight: 500 }}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════════ LIGHT SECTION (transactions) ═══════════════ */}
        <div style={{
          flex: 1, overflowY: "auto",
          background: M.lightBg,
          borderRadius: "16px 16px 0 0",
          padding: `${M.sp24}px ${M.sp20}px`,
        }}>
          {/* Header */}
          <div style={{ marginBottom: M.sp4 }}>
            <span style={{ color: M.lightText, fontSize: 16, fontWeight: 700 }}>
              Transações
            </span>
          </div>
          <p style={{ color: M.lightSub, fontSize: 11, marginBottom: M.sp20, lineHeight: 1.4 }}>
            Confira as últimas transações realizadas hoje:
          </p>

          {/* Grouped transactions */}
          {transacoes.map((grupo) => (
            <div key={grupo.grupo} style={{ marginBottom: M.sp20 }}>
              <div style={{
                color: M.lightSub, fontSize: 10, fontWeight: 600,
                letterSpacing: "0.08em", textTransform: "uppercase",
                marginBottom: M.sp12,
              }}>
                {grupo.grupo}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: M.sp8 }}>
                {grupo.items.map((t, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex", alignItems: "center", gap: M.sp12,
                      padding: `${M.sp12}px ${M.sp16}px`,
                      borderRadius: 12,
                      background: M.lightBg,
                      border: `1px solid ${M.lightBorder}`,
                      cursor: "pointer",
                      transition: "box-shadow 150ms",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)")}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
                  >
                    {/* Direction icon */}
                    <div style={{
                      width: 36, height: 36, borderRadius: 18,
                      background: t.tipo === "entrada" ? M.greenBadge : M.grayBadge,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      {t.tipo === "entrada"
                        ? <ArrowDownLeft size={16} color={M.greenText} />
                        : <ArrowUpRight size={16} color={M.lightSub} />
                      }
                    </div>

                    {/* Nome + tipo (cresce) */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        color: M.lightText,
                        fontSize: 12, fontWeight: 600,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {t.nome}
                      </div>
                      <div style={{ color: M.lightSub, fontSize: 10, marginTop: 2 }}>
                        {t.detalhe}
                      </div>
                    </div>

                    {/* Valor + data (alinhados à direita) */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{
                        color: t.tipo === "entrada" ? M.blueLink : M.lightText,
                        fontSize: 13, fontWeight: 700, whiteSpace: "nowrap",
                      }}>
                        {t.tipo === "entrada" ? "+" : "-"}R${Math.abs(t.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>
                      <div style={{ color: M.lightSub, fontSize: 10, marginTop: 2, whiteSpace: "nowrap" }}>
                        {t.data}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Link to all transactions */}
          <button style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "none", border: "none", cursor: "pointer",
            color: M.blueLink, fontSize: 12, fontWeight: 600,
            padding: `${M.sp8}px 0`,
          }}>
            <span style={{ fontSize: 16 }}>≡</span>
            Ir para Transações
          </button>
        </div>

        {/* ── Footer ── */}
        <div style={{
          background: M.lightBg,
          borderTop: `1px solid ${M.lightBorder}`,
          padding: `${M.sp12}px ${M.sp20}px`,
          display: "flex", alignItems: "center", justifyContent: "center", gap: M.sp8,
          flexShrink: 0,
        }}>
          <div style={{
            width: 18, height: 13, borderRadius: 3,
            background: M.primary,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg viewBox={MEIOO_ICON_VB} width={14} height={10} fill="none" aria-hidden>
              <path d={MEIOO_ICON_PATH} fill={M.black} />
            </svg>
          </div>
          <span style={{ color: M.lightSub, fontSize: 10 }}>
            Conta digital operada pela{" "}
            <span style={{ color: M.lightText, fontWeight: 600 }}>Meioo</span>
          </span>
        </div>
      </div>
    </>
  );
}
