"use client";

import { useEffect, useRef, useState } from "react";
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
import { MEIOO_ICON_BG_PATH, MEIOO_ICON_PATH, MEIOO_ICON_VB } from "./MeiooIcon";

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
  onAbrirCobranca?: (tipo: "pix" | "boleto" | "link" | "cartao" | "pagar" | "menu") => void;
  refreshKey?: number;
  saldoInicial?: number; // saldo imediato pós-pagamento, evita flash "Carregando..."
}

interface Transacao {
  nome: string; detalhe: string; valor: number; tipo: string; data: string;
}

const acoes = [
  { icon: QrCode,         label: "Pix",    tipo: "pix" as const },
  { icon: CreditCard,     label: "Cartão", tipo: "cartao" as const },
  { icon: DollarSign,     label: "Pagar",  tipo: "pagar" as const },
  { icon: MoreHorizontal, label: "Mais",   tipo: "menu" as const },
];

const MIN_WIDTH = 280;
const MAX_WIDTH = 640;

export function PainelMeioo({ aberto, onFechar, onAbrirCobranca, refreshKey = 0, saldoInicial }: PainelMeiooProps) {
  const [saldoVisivel, setSaldoVisivel] = useState(true);
  const [saldo, setSaldo] = useState<number | null>(null);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [panelWidth, setPanelWidth] = useState(320);
  const [isDesktop, setIsDesktop] = useState(false);
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  // Detect desktop (precise pointer = mouse) — runs only client-side
  useEffect(() => {
    setIsDesktop(window.matchMedia("(pointer: fine)").matches);
  }, []);

  // Aplica saldoInicial imediatamente ao abrir (evita flash "Carregando...")
  useEffect(() => {
    if (aberto && saldoInicial !== undefined) {
      setSaldo(saldoInicial);
    }
  }, [aberto, saldoInicial]);

  // Fetch saldo + transacoes da API sempre que abrir ou refreshKey mudar
  useEffect(() => {
    if (!aberto) return;
    fetch("/api/saldo")
      .then(r => r.json())
      .then(d => {
        setSaldo(d.saldo);
        setTransacoes(d.transacoes);
      });
  }, [aberto, refreshKey]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onFechar(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onFechar]);

  function handleResizeMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    isResizing.current = true;
    startX.current = e.clientX;
    startWidth.current = panelWidth;
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";

    function onMouseMove(ev: MouseEvent) {
      if (!isResizing.current) return;
      const delta = ev.clientX - startX.current;
      setPanelWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + delta)));
    }

    function onMouseUp() {
      isResizing.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

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
          width: panelWidth,
          background: M.black,
          boxShadow: "8px 0 48px rgba(0,0,0,0.72)",
          transform: aberto ? "translateX(0)" : "translateX(-100%)",
          transition: isResizing.current ? "none" : "transform 300ms cubic-bezier(0.4,0,0.2,1)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Resize handle — desktop only */}
        {isDesktop && (
          <div
            onMouseDown={handleResizeMouseDown}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: 6,
              height: "100%",
              cursor: "ew-resize",
              zIndex: 10,
              background: "transparent",
            }}
            title="Arraste para redimensionar"
          />
        )}
        {/* ═══════════════ DARK SECTION (top) ═══════════════ */}
        <div style={{ background: M.black, padding: `${M.sp24}px ${M.sp20}px ${M.sp20}px`, flexShrink: 0 }}>

          {/* Top bar: Meioo logo + close */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: M.sp24 }}>
            {/* Logo Meioo completa */}
            <svg width="78" height="12" viewBox="0 0 104 16" fill="none" aria-label="Meioo">
              <path d="M84.094 0.0581567C84.7342 0.00155687 85.9335 0.0365857 86.6209 0.0367007L91.3352 0.0380822L98.4689 0.0372186C99.7958 0.0348602 101.117 0.0277857 102.449 0.0365287C103.062 0.0405551 103.535 0.210068 103.852 0.786592C103.942 1.00942 103.997 1.35731 103.996 1.59003C103.993 5.58993 103.995 9.58994 104 13.5897C104.001 14.4146 103.678 14.7792 102.955 15.1039C102.217 15.1608 101.138 15.1283 100.368 15.1282L95.774 15.127L88.6036 15.1292C87.2789 15.1314 85.9415 15.1423 84.6249 15.1227C83.004 15.1087 83.054 13.8918 83.0627 12.6489C83.0868 8.95756 83.0523 5.26954 83.0684 1.5791C83.0719 0.765711 83.3733 0.377624 84.094 0.0581567ZM86.1486 12.4186L100.944 12.4226L100.949 2.73388L91.7131 2.72502C89.9363 2.72525 87.9059 2.67803 86.1457 2.74095L86.1486 12.4186Z" fill="white"/>
              <path d="M60.9881 0.0508032C63.8906 -0.0559541 67.3884 0.038552 70.33 0.0394723L75.7817 0.0364232C76.8263 0.0333746 77.864 0.0264735 78.9143 0.0348715C79.5194 0.0397031 80.0101 0.243612 80.3069 0.807367C80.392 0.968481 80.4305 1.44337 80.4311 1.63525C80.4426 4.22337 80.4374 6.81264 80.4259 9.40082C80.4023 10.8014 80.4742 12.2073 80.4432 13.607C80.4253 14.4043 80.0722 14.8209 79.371 15.1069C78.4547 15.1584 77.2917 15.128 76.3535 15.1279L71.0944 15.1261L65.0134 15.1287C63.8417 15.1315 62.6821 15.1389 61.5001 15.1259C60.8932 15.1192 60.36 14.9606 60.0592 14.3557C59.9729 14.1184 59.9171 13.7728 59.9177 13.5273C59.92 9.53679 59.9142 5.54582 59.9188 1.55553C59.9194 0.737364 60.2329 0.324657 60.9881 0.0508032ZM62.9835 12.4187L77.3762 12.4226L77.3843 2.7336L68.3749 2.72509C66.6366 2.72538 64.708 2.68482 62.9824 2.73809L62.9835 12.4187Z" fill="white"/>
              <path d="M29.0035 0.0407861C35.7985 -0.0333574 42.7297 0.0383115 49.5359 0.0388867C49.5495 0.923662 49.539 1.83593 49.5401 2.72301C43.794 2.85525 37.7754 2.58594 32.0307 2.74141L32.0319 6.32083L48.1112 6.32503C48.1324 7.17731 48.1162 8.07934 48.113 8.93593L42.0761 8.93818C38.7714 8.93703 35.3249 8.88756 32.0316 8.95106L32.0323 12.4185C37.8054 12.4906 43.7492 12.423 49.536 12.424C49.5493 13.3152 49.5388 14.2332 49.5396 15.1267L29.0016 15.1247L29.0035 0.0407861Z" fill="white"/>
              <path d="M22.0519 0.0374403L25.0061 0.0387639C25.0593 5.02306 25.0082 10.1333 25.0082 15.1261L21.9084 15.1242L21.9063 10.5428L21.9082 5.12769L13.7826 15.1268L11.1305 15.1291C10.2809 14.0134 9.2864 12.8266 8.40289 11.7263L3.11333 5.1389C3.05869 8.41807 3.10781 11.8352 3.10661 15.1253L0.00074779 15.1238L0 0.0412372C0.955295 0.0220254 1.9715 0.0399131 2.93174 0.0400857C3.92638 1.21839 5.0356 2.7123 5.99987 3.94053L12.4866 12.1893L22.0519 0.0374403Z" fill="white"/>
              <path d="M53.0912 0.0414954C54.0989 0.0209032 55.1723 0.0393668 56.1858 0.0389641L56.184 15.1241C55.1665 15.1395 54.1127 15.125 53.0923 15.1248L53.0912 0.0414954Z" fill="white"/>
            </svg>

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
              {saldoVisivel
                ? saldo !== null
                  ? `R$${saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                  : "Carregando..."
                : "R$ ••••••"}
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
                <svg viewBox={MEIOO_ICON_VB} width={14} height={14} fill="none" aria-hidden>
                  <path d={MEIOO_ICON_BG_PATH} fill={M.black} />
                  <path d={MEIOO_ICON_PATH} fill="white" />
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
                onClick={() => { onFechar(); onAbrirCobranca?.(tipo); }}
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
                  onMouseEnter={e => (e.currentTarget.style.background = "#2a2e35")}
                  onMouseLeave={e => (e.currentTarget.style.background = M.darkCard)}
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
          {transacoes.length === 0 && (
            <p style={{ color: M.lightSub, fontSize: 12, textAlign: "center", padding: "20px 0" }}>
              Nenhuma transação ainda.
            </p>
          )}
          {transacoes.length > 0 && [{ grupo: "RECENTES", items: transacoes }].map((grupo) => (
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
            <svg viewBox={MEIOO_ICON_VB} width={14} height={14} fill="none" aria-hidden>
              <path d={MEIOO_ICON_BG_PATH} fill={M.black} />
              <path d={MEIOO_ICON_PATH} fill="white" />
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
