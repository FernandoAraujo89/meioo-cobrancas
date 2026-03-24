"use client";

import { useEffect, useState } from "react";
import { X, Eye, EyeOff, QrCode, FileText, ExternalLink, Bell, ChevronRight, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { MEIOO_ICON_PATH, MEIOO_ICON_VB } from "./MeiooIcon";

// ─── Meioo Design Tokens (from styleguide vmGGJxD54dhMFVXMDQKM2S) ───────────
const M = {
  // Colors
  bg:        "#181a1e",   // neutral-100 (darkest background)
  black:     "#000000",   // neutral-200
  surface:   "#0e0f12",   // slightly darker than bg for depth
  card:      "#21252c",   // card surface, above bg
  divider:   "#2d3339",   // Frame divider color
  primary:   "#69fd7a",   // PRIMARY GREEN — brand color
  white:     "#fefefe",   // text-100
  offWhite:  "#e3e2e2",   // text-200
  gray300:   "#cfcfcf",
  gray600:   "#cccccc",
  muted:     "#969696",   // neutral-1500
  dim:       "#5f5f5f",   // neutral-2800
  // Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 56
  sp4:  4,  sp8:  8,  sp12: 12, sp16: 16,
  sp20: 20, sp24: 24, sp32: 32,
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
      { nome: "Tech Soluções ME",        detalhe: "Pix recebido",       valor: +1200.0, hora: "09:41", tipo: "entrada" },
      { nome: "TechAvis Equipamentos",   detalhe: "Boleto liquidado",   valor: +1800.0, hora: "08:15", tipo: "entrada" },
    ],
  },
  {
    grupo: "ESTA SEMANA",
    items: [
      { nome: "Maria Silva Pereira",     detalhe: "Link de pagamento",  valor: +500.0,  hora: "Ontem, 14:22", tipo: "entrada" },
      { nome: "Centros Escolar Sabores", detalhe: "Estorno",            valor: -3200.0, hora: "Seg, 11:00",   tipo: "saida" },
      { nome: "Tarifa Meioo",            detalhe: "Boleto emitido",     valor: -3.5,    hora: "Sex, 09:30",   tipo: "saida" },
    ],
  },
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
        <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.64)" }} onClick={onFechar} />
      )}

      {/* Painel */}
      <div
        className="fixed top-0 left-0 h-full z-50 flex flex-col overflow-hidden"
        style={{
          width: 296,
          background: M.bg,
          boxShadow: `8px 0 48px rgba(0,0,0,0.72)`,
          transform: aberto ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 300ms cubic-bezier(0.4,0,0.2,1)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* ── Header ── */}
        <div style={{ padding: `${M.sp24}px ${M.sp20}px ${M.sp16}px` }}>

          {/* Top bar: logo + actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: M.sp20 }}>
            {/* Meioo logo */}
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
              <span style={{ color: M.white, fontWeight: 700, fontSize: 14, letterSpacing: -0.3 }}>
                Meioo
              </span>
            </div>

            {/* Icons */}
            <div style={{ display: "flex", gap: M.sp4 }}>
              <button
                style={{ width: 32, height: 32, borderRadius: 8, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: M.muted }}
                onMouseEnter={e => (e.currentTarget.style.background = M.divider)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <Bell size={15} />
              </button>
              <button
                onClick={onFechar}
                style={{ width: 32, height: 32, borderRadius: 8, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: M.muted }}
                onMouseEnter={e => (e.currentTarget.style.background = M.divider)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Saldo */}
          <div style={{ marginBottom: M.sp20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: M.sp8, marginBottom: M.sp4 }}>
              <span style={{ color: M.muted, fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Seu saldo
              </span>
              <button
                onClick={() => setSaldoVisivel(v => !v)}
                style={{ background: "none", border: "none", cursor: "pointer", color: M.dim, padding: 0, display: "flex" }}
              >
                {saldoVisivel ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
            </div>
            <div style={{ color: M.white, fontSize: 28, fontWeight: 800, letterSpacing: -1, lineHeight: 1 }}>
              {saldoVisivel ? "R$ 1.849,00" : "R$ ••••••"}
            </div>
          </div>

          {/* Ações rápidas */}
          <div>
            <div style={{ color: M.dim, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: M.sp12 }}>
              Cobrar
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: M.sp8 }}>
              {[
                { tipo: "pix" as const,    icon: QrCode,       label: "Pix" },
                { tipo: "boleto" as const, icon: FileText,     label: "Boleto" },
                { tipo: "link" as const,   icon: ExternalLink, label: "Link" },
              ].map(({ tipo, icon: Icon, label }) => (
                <button
                  key={tipo}
                  onClick={() => { onFechar(); onAbrirCobranca(tipo); }}
                  style={{
                    background: M.card,
                    border: `1px solid ${M.divider}`,
                    borderRadius: 12,
                    padding: `${M.sp12}px ${M.sp8}px`,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: M.sp8,
                    transition: "border-color 150ms, background 150ms",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = M.primary;
                    (e.currentTarget as HTMLElement).style.background = "#2a3029";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = M.divider;
                    (e.currentTarget as HTMLElement).style.background = M.card;
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: `${M.primary}18`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={15} color={M.primary} />
                  </div>
                  <span style={{ color: M.offWhite, fontSize: 11, fontWeight: 500 }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: M.divider, margin: `0 ${M.sp20}px` }} />

        {/* ── Transações ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: `${M.sp16}px ${M.sp20}px` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: M.sp16 }}>
            <span style={{ color: M.white, fontSize: 14, fontWeight: 700 }}>Transações</span>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: M.dim, fontSize: 11, display: "flex", alignItems: "center", gap: 2 }}>
              Ver todas <ChevronRight size={11} />
            </button>
          </div>

          {transacoes.map((grupo) => (
            <div key={grupo.grupo} style={{ marginBottom: M.sp16 }}>
              <div style={{ color: M.dim, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: M.sp8 }}>
                {grupo.grupo}
              </div>

              {grupo.items.map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: M.sp12,
                    padding: `${M.sp8}px ${M.sp4}px`,
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "background 100ms",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = M.divider)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Ícone de direção */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: t.tipo === "entrada" ? `${M.primary}18` : `${M.divider}`,
                    border: `1px solid ${t.tipo === "entrada" ? `${M.primary}30` : M.divider}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {t.tipo === "entrada"
                      ? <ArrowDownLeft size={15} color={M.primary} />
                      : <ArrowUpRight size={15} color={M.muted} />
                    }
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: M.offWhite, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {t.nome}
                    </div>
                    <div style={{ color: M.dim, fontSize: 10, marginTop: 2 }}>
                      {t.detalhe} · {t.hora}
                    </div>
                  </div>

                  {/* Valor */}
                  <span style={{
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                    color: t.tipo === "entrada" ? M.primary : M.muted,
                  }}>
                    {t.tipo === "entrada" ? "+" : ""}
                    {Math.abs(t.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <div style={{
          borderTop: `1px solid ${M.divider}`,
          padding: `${M.sp12}px ${M.sp20}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: M.sp8,
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
          <span style={{ color: M.dim, fontSize: 10 }}>
            Conta digital operada pela{" "}
            <span style={{ color: M.muted, fontWeight: 600 }}>Meioo</span>
          </span>
        </div>
      </div>
    </>
  );
}
