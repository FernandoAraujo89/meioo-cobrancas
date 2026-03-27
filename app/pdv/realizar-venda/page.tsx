"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AvanteHeader } from "@/app/components/AvanteHeader";
import { AvanteSidebar } from "@/app/components/AvanteSidebar";
import { PainelMeioo } from "@/app/components/PainelMeioo";
import { MeiooIcon } from "@/app/components/MeiooIcon";
import {
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  QrCode,
  FileText,
  Link2,
  ChevronDown,
} from "lucide-react";

/* ────────────────────────────────────── types */
interface ItemVenda {
  id: string;
  codigo: string;
  nome: string;
  qtde: number;
  valorUnit: number;
  desconto: number;
}

interface Pagamento {
  id: string;
  forma: string;
  valor: number;
  meioo: boolean;
  meiooTipo?: "pix" | "boleto" | "link";
}

/* ────────────────────────────────────── mock data */
const PRODUTOS_MOCK = [
  { codigo: "001", nome: "Camiseta Básica", valorUnit: 49.9 },
  { codigo: "002", nome: "Calça Jeans", valorUnit: 159.9 },
  { codigo: "003", nome: "Tênis Esportivo", valorUnit: 249.0 },
  { codigo: "004", nome: "Mochila Executiva", valorUnit: 189.9 },
  { codigo: "005", nome: "Caneca Personalizada", valorUnit: 35.0 },
  { codigo: "006", nome: "Fone Bluetooth", valorUnit: 99.9 },
  { codigo: "007", nome: "Camisa Social", valorUnit: 119.9 },
];

const FORMAS_PAGAMENTO = [
  { value: "dinheiro",    label: "Dinheiro",             meioo: false },
  { value: "debito",      label: "Cartão de Débito",      meioo: false },
  { value: "credito",     label: "Cartão de Crédito",     meioo: false },
  { value: "pix_meioo",   label: "Pix",                   meioo: true,  meiooTipo: "pix"    as const },
  { value: "boleto_meioo",label: "Boleto",                meioo: true,  meiooTipo: "boleto" as const },
  { value: "link_meioo",  label: "Link de Pagamento",     meioo: true,  meiooTipo: "link"   as const },
];

/* ────────────────────────────────────── component */
export default function RealizarVendaPage() {
  const router = useRouter();
  const [painelMeiooAberto, setPainelMeiooAberto] = useState(false);
  const [mobileTab, setMobileTab] = useState<"produtos" | "pagamento">("produtos");

  /* produto form */
  const [busca, setBusca] = useState("");
  const [codigoProd, setCodigoProd] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [valorUnitInput, setValorUnitInput] = useState("");
  const [sugestoes, setSugestoes] = useState<typeof PRODUTOS_MOCK>([]);

  /* itens */
  const [itens, setItens] = useState<ItemVenda[]>([]);

  /* cliente */
  const [cliente, setCliente] = useState("");
  const [docTipo, setDocTipo] = useState<"cpf" | "cnpj">("cpf");
  const [documento, setDocumento] = useState("");

  /* pagamento */
  const [formaPagamento, setFormaPagamento] = useState("dinheiro");
  const [valorPagoInput, setValorPagoInput] = useState("");
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [ajuste, setAjuste] = useState<"desconto" | "acrescimo">("desconto");
  const [tipoDesconto, setTipoDesconto] = useState("Valor R$");
  const [valorDesconto, setValorDesconto] = useState("0,00");

  /* state */
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  /* ── calcs */
  const subtotal = itens.reduce((s, i) => s + i.qtde * i.valorUnit - i.desconto, 0);
  const descontoTotal = itens.reduce((s, i) => s + i.desconto, 0);
  const total = subtotal;
  const totalPago = pagamentos.reduce((s, p) => s + p.valor, 0);
  const restante = Math.max(0, total - totalPago);
  const troco = Math.max(0, totalPago - total);
  const valorTotalItem =
    (parseFloat(quantidade) || 1) *
    (parseFloat(valorUnitInput.replace(",", ".")) || 0);

  function showToast(msg: string, type: "ok" | "err" = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  /* ── busca produtos */
  function handleBusca(value: string) {
    setBusca(value);
    if (value.length < 2) { setSugestoes([]); return; }
    setSugestoes(
      PRODUTOS_MOCK.filter(
        p =>
          p.nome.toLowerCase().includes(value.toLowerCase()) ||
          p.codigo.includes(value),
      ).slice(0, 5),
    );
  }

  function selecionarProduto(p: (typeof PRODUTOS_MOCK)[0]) {
    setCodigoProd(p.codigo);
    setBusca(p.nome);
    setValorUnitInput(p.valorUnit.toFixed(2).replace(".", ","));
    setSugestoes([]);
  }

  /* ── inserir item */
  function handleInserir() {
    const vUnit = parseFloat(valorUnitInput.replace(",", ".")) || 0;
    const nome = busca || `Produto ${codigoProd}`;
    const qtd = parseFloat(quantidade) || 1;
    if (vUnit === 0 || !nome) { showToast("Informe produto e valor!", "err"); return; }

    setItens(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        codigo: codigoProd || "---",
        nome,
        qtde: qtd,
        valorUnit: vUnit,
        desconto: 0,
      },
    ]);
    setBusca(""); setCodigoProd(""); setQuantidade("1"); setValorUnitInput("");
    setSugestoes([]);
  }

  function handleRemoverItem(id: string) {
    setItens(prev => prev.filter(i => i.id !== id));
  }

  /* ── adicionar pagamento */
  function handleAdicionarPagamento() {
    const valor = parseFloat(valorPagoInput.replace(",", ".")) || 0;
    if (valor <= 0) { showToast("Informe o valor pago!", "err"); return; }
    const forma = FORMAS_PAGAMENTO.find(f => f.value === formaPagamento)!;
    setPagamentos(prev => [
      ...prev,
      { id: Date.now().toString(), forma: forma.label, valor, meioo: forma.meioo, meiooTipo: forma.meiooTipo },
    ]);
    setValorPagoInput("");
  }

  function handleRemoverPagamento(id: string) {
    setPagamentos(prev => prev.filter(p => p.id !== id));
  }

  /* ── finalizar venda */
  async function handleFinalizar() {
    if (itens.length === 0) { showToast("Adicione pelo menos um produto!", "err"); return; }
    if (restante > 0.009) { showToast("Pagamento insuficiente!", "err"); return; }

    setCarregando(true);
    try {
      const meiooPayments = pagamentos.filter(p => p.meioo);
      for (const p of meiooPayments) {
        await fetch("/api/cobrancas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cliente: cliente || "Cliente PDV",
            historico: `Venda PDV — ${itens.map(i => i.nome).join(", ")}`,
            valor: p.valor,
            tipo: p.meiooTipo ?? "pix",
            vencimento: null,
          }),
        });
      }
      setSucesso(true);
    } catch {
      showToast("Erro ao finalizar venda. Tente novamente.", "err");
    } finally {
      setCarregando(false);
    }
  }

  function handleNovaVenda() {
    setItens([]); setPagamentos([]); setCliente(""); setDocumento("");
    setBusca(""); setCodigoProd(""); setQuantidade("1"); setValorPagoInput("");
    setSucesso(false);
  }

  const formaAtual = FORMAS_PAGAMENTO.find(f => f.value === formaPagamento);

  /* ════════════════════════════════════ SUCCESS SCREEN */
  if (sucesso) {
    const meiooCount = pagamentos.filter(p => p.meioo).length;
    return (
      <div className="flex flex-col h-[100dvh] overflow-hidden">
        <AvanteHeader />
        <div className="flex flex-1 overflow-hidden">
          <AvanteSidebar onAbrirMeioo={() => setPainelMeiooAberto(true)} />
          <main className="flex-1 flex items-center justify-center bg-bg p-6">
            <div className="bg-surface rounded-2xl border border-border shadow-panel p-8 max-w-sm w-full text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-success" />
              </div>
              <h2 className="text-xl font-bold text-dark mb-1">Venda finalizada!</h2>
              <p className="text-xs text-muted mb-3">
                {itens.length} {itens.length === 1 ? "item" : "itens"} vendido{itens.length !== 1 ? "s" : ""}
              </p>
              <div className="bg-bg rounded-xl p-4 mb-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Total</span>
                  <span className="font-bold text-dark">
                    {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
                {troco > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Troco</span>
                    <span className="font-bold text-success">
                      {troco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                  </div>
                )}
                {pagamentos.map(p => (
                  <div key={p.id} className="flex justify-between text-xs text-muted">
                    <span>{p.forma}</span>
                    <span>{p.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                  </div>
                ))}
              </div>

              {meiooCount > 0 && (
                <div className="flex items-center justify-center gap-2 mb-4 bg-primary/5 border border-primary/10 rounded-xl p-3">
                  <MeiooIcon size={16} variant="badge" />
                  <span className="text-xs text-primary font-medium">
                    {meiooCount === 1 ? "Cobrança gerada" : `${meiooCount} cobranças geradas`} via Meioo
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleNovaVenda}
                  className="flex-1 h-10 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
                >
                  Nova venda
                </button>
                {meiooCount > 0 && (
                  <button
                    onClick={() => router.push("/financeiro/cobrancas-bancarias")}
                    className="flex-1 h-10 rounded-xl border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
                  >
                    Ver cobranças
                  </button>
                )}
              </div>
            </div>
          </main>
        </div>
        <PainelMeioo aberto={painelMeiooAberto} onFechar={() => setPainelMeiooAberto(false)} />
      </div>
    );
  }

  /* ════════════════════════════════════ MAIN PDV */
  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <AvanteHeader />

      <div className="flex flex-1 overflow-hidden">
        <AvanteSidebar onAbrirMeioo={() => setPainelMeiooAberto(true)} />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile tabs */}
          <div className="sm:hidden flex shrink-0 border-b border-border bg-surface">
            {(["produtos", "pagamento"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setMobileTab(tab)}
                className={`flex-1 py-2.5 text-xs font-semibold transition-colors border-b-2 -mb-px capitalize
                  ${mobileTab === tab ? "text-primary border-primary" : "text-muted border-transparent"}`}
              >
                {tab === "produtos" ? "Produtos" : "Pagamento"}
              </button>
            ))}
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* ══ LEFT: PRODUCTS */}
            <div className={`flex flex-col flex-1 border-r border-border overflow-hidden bg-surface
              ${mobileTab === "pagamento" ? "hidden sm:flex" : "flex"}`}>

              {/* Search */}
              <div className="p-2 border-b border-border shrink-0 relative">
                <div className="relative">
                  <input
                    value={busca}
                    onChange={e => handleBusca(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleInserir()}
                    placeholder="Busque por produtos"
                    className="w-full pr-9 pl-3 h-9 rounded border border-border bg-bg text-xs text-dark placeholder:text-muted focus:outline-none focus:border-primary"
                  />
                  <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-primary" />
                </div>
                {/* Sugestões */}
                {sugestoes.length > 0 && (
                  <div className="absolute left-2 right-2 top-full mt-1 bg-surface border border-border rounded-lg shadow-dropdown z-50 overflow-hidden">
                    {sugestoes.map(p => (
                      <button
                        key={p.codigo}
                        onClick={() => selecionarProduto(p)}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-bg text-xs text-left border-b border-border last:border-0"
                      >
                        <div>
                          <span className="font-medium text-dark">{p.nome}</span>
                          <span className="text-muted ml-2">#{p.codigo}</span>
                        </div>
                        <span className="text-primary font-semibold">
                          {p.valorUnit.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input row */}
              <div className="flex items-end gap-1.5 p-2 border-b border-border bg-bg/40 shrink-0 flex-wrap">
                <div className="flex flex-col gap-0.5">
                  <label className="text-[10px] text-muted font-medium">Código</label>
                  <input
                    value={codigoProd}
                    onChange={e => setCodigoProd(e.target.value)}
                    className="w-16 h-8 px-2 rounded border border-border bg-surface text-xs text-dark focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-[10px] text-muted font-medium">Quantidade</label>
                  <input
                    value={quantidade}
                    onChange={e => setQuantidade(e.target.value)}
                    type="number"
                    min="1"
                    className="w-20 h-8 px-2 rounded border border-border bg-surface text-xs text-dark focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-[10px] text-muted font-medium">Valor Unit.</label>
                  <input
                    value={valorUnitInput}
                    onChange={e => setValorUnitInput(e.target.value)}
                    placeholder="0,00"
                    className="w-24 h-8 px-2 rounded border border-border bg-surface text-xs text-dark focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-[10px] text-muted font-medium">Valor total</label>
                  <div className="w-28 h-8 px-2 flex items-center rounded border border-primary/30 bg-primary/5 text-xs text-primary font-bold">
                    {valorTotalItem.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </div>
                </div>
                <button
                  onClick={handleInserir}
                  className="h-8 px-4 rounded bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
                >
                  Inserir
                </button>
              </div>

              {/* Items table */}
              <div className="flex-1 overflow-y-auto">
                {itens.length === 0 ? (
                  <p className="text-xs text-muted text-center py-10">Nenhum produto informado</p>
                ) : (
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border bg-bg/50">
                        <th className="text-left py-2.5 px-3 font-semibold text-muted text-[10px] uppercase tracking-wide">Item</th>
                        <th className="text-center py-2.5 px-2 font-semibold text-muted text-[10px] uppercase tracking-wide">Qtde</th>
                        <th className="text-right py-2.5 px-2 font-semibold text-muted text-[10px] uppercase tracking-wide hidden sm:table-cell">Valor unit.</th>
                        <th className="text-right py-2.5 px-2 font-semibold text-muted text-[10px] uppercase tracking-wide hidden sm:table-cell">Desconto</th>
                        <th className="text-right py-2.5 px-2 font-semibold text-muted text-[10px] uppercase tracking-wide">Valor total</th>
                        <th className="py-2.5 px-2 w-8" />
                      </tr>
                    </thead>
                    <tbody>
                      {itens.map((item, idx) => (
                        <tr
                          key={item.id}
                          className={`border-b border-border last:border-0 hover:bg-bg/40 transition-colors ${idx % 2 ? "bg-bg/20" : ""}`}
                        >
                          <td className="py-2.5 px-3">
                            <div className="font-medium text-dark">{item.nome}</div>
                            <div className="text-[10px] text-muted">{item.codigo}</div>
                          </td>
                          <td className="py-2.5 px-2 text-center text-dark">{item.qtde.toFixed(4)}</td>
                          <td className="py-2.5 px-2 text-right text-dark hidden sm:table-cell">
                            {item.valorUnit.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </td>
                          <td className="py-2.5 px-2 text-right text-muted hidden sm:table-cell">
                            {item.desconto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </td>
                          <td className="py-2.5 px-2 text-right font-semibold text-dark">
                            {(item.qtde * item.valorUnit - item.desconto).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <button
                              onClick={() => handleRemoverItem(item.id)}
                              className="text-muted hover:text-danger transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Summary footer */}
              <div className="border-t border-border shrink-0">
                <div className="grid grid-cols-3 border-b border-border text-center">
                  {[
                    { label: "Itens",    val: String(itens.length) },
                    { label: "SubTotal", val: subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) },
                    { label: "Desconto", val: descontoTotal.toFixed(2) },
                  ].map((c, i) => (
                    <div key={c.label} className={`p-3 ${i < 2 ? "border-r border-border" : ""}`}>
                      <div className="text-[10px] text-muted font-medium">{c.label}</div>
                      <div className="text-sm font-bold text-primary mt-0.5">{c.val}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#e8f5e9] p-3 text-center">
                  <div className="text-[10px] font-bold text-dark/50 uppercase tracking-wider mb-0.5">Total</div>
                  <div className="text-2xl font-extrabold text-[#1b5e20]">
                    {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </div>
                </div>
              </div>
            </div>

            {/* ══ RIGHT: PAYMENT */}
            <div className={`flex flex-col w-full sm:w-[400px] lg:w-[440px] shrink-0 overflow-hidden bg-surface
              ${mobileTab === "produtos" ? "hidden sm:flex" : "flex"}`}>

              {/* Customer info */}
              <div className="p-3 border-b border-border shrink-0">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="text-[10px] text-muted font-medium block mb-1">Código</label>
                    <input className="w-full h-8 px-2 rounded border border-border text-xs text-dark focus:outline-none focus:border-primary bg-surface" placeholder="Cód" />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted font-medium block mb-1">Cliente</label>
                    <div className="flex gap-1">
                      <input
                        value={cliente}
                        onChange={e => setCliente(e.target.value)}
                        placeholder="Nome do cliente"
                        className="flex-1 min-w-0 h-8 px-2 rounded border border-border text-xs text-dark focus:outline-none focus:border-primary bg-surface"
                      />
                      <button className="w-8 h-8 shrink-0 flex items-center justify-center rounded border border-border bg-surface hover:bg-bg text-muted">
                        <Search size={11} />
                      </button>
                      <button className="w-8 h-8 shrink-0 flex items-center justify-center rounded border border-border bg-surface hover:bg-bg text-muted">
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-muted font-medium block mb-1">Tipo de documento</label>
                    <div className="flex items-center gap-3 h-8">
                      {(["cpf", "cnpj"] as const).map(t => (
                        <label key={t} className="flex items-center gap-1 text-xs text-dark cursor-pointer">
                          <input
                            type="radio"
                            checked={docTipo === t}
                            onChange={() => setDocTipo(t)}
                            className="accent-primary"
                          />
                          {t.toUpperCase()}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-muted font-medium block mb-1">Documento</label>
                    <input
                      value={documento}
                      onChange={e => setDocumento(e.target.value)}
                      placeholder={docTipo === "cpf" ? "000.000.000-00" : "00.000.000/0000-00"}
                      className="w-full h-8 px-2 rounded border border-border text-xs text-dark focus:outline-none focus:border-primary bg-surface"
                    />
                  </div>
                </div>
              </div>

              {/* Payment area */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                <p className="text-xs font-bold text-dark">Pagamento</p>

                {/* Form */}
                <div className="flex gap-1.5">
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] text-muted font-medium block mb-1">Forma de Pagamento</label>
                    <div className="relative">
                      <select
                        value={formaPagamento}
                        onChange={e => setFormaPagamento(e.target.value)}
                        className="w-full h-8 pl-2 pr-7 rounded border border-border bg-surface text-xs text-dark focus:outline-none focus:border-primary appearance-none"
                      >
                        <optgroup label="Convencional">
                          <option value="dinheiro">Dinheiro</option>
                          <option value="debito">Cartão de Débito</option>
                          <option value="credito">Cartão de Crédito</option>
                        </optgroup>
                        <optgroup label="Via Meioo">
                          <option value="pix_meioo">Pix</option>
                          <option value="boleto_meioo">Boleto</option>
                          <option value="link_meioo">Link de Pagamento</option>
                        </optgroup>
                      </select>
                      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                    </div>
                    {formaAtual?.meioo && (
                      <div className="flex items-center gap-1 mt-1">
                        <MeiooIcon size={11} variant="badge" />
                        {formaAtual.meiooTipo === "pix"    && <QrCode  size={11} className="text-primary" />}
                        {formaAtual.meiooTipo === "boleto" && <FileText size={11} className="text-primary" />}
                        {formaAtual.meiooTipo === "link"   && <Link2   size={11} className="text-primary" />}
                        <span className="text-[10px] text-primary font-semibold">via Meioo</span>
                      </div>
                    )}
                  </div>
                  <div className="w-24 shrink-0">
                    <label className="text-[10px] text-muted font-medium block mb-1">Valor Pago</label>
                    <input
                      value={valorPagoInput}
                      onChange={e => setValorPagoInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleAdicionarPagamento()}
                      placeholder="0,00"
                      className="w-full h-8 px-2 rounded border border-border bg-surface text-xs text-dark focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-col justify-end shrink-0">
                    <button
                      onClick={handleAdicionarPagamento}
                      className="h-8 px-3 rounded bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>

                {/* Payments list */}
                <div className="rounded border border-border overflow-hidden min-h-[52px]">
                  {pagamentos.length === 0 ? (
                    <p className="text-[11px] text-muted text-center py-4">Nenhum pagamento informado</p>
                  ) : (
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border bg-bg/50">
                          <th className="text-left py-2 px-3 font-semibold text-muted text-[10px] uppercase">Tipo Pagamento</th>
                          <th className="text-right py-2 px-3 font-semibold text-muted text-[10px] uppercase">Valor Pago</th>
                          <th className="py-2 px-2 w-6" />
                        </tr>
                      </thead>
                      <tbody>
                        {pagamentos.map(p => (
                          <tr key={p.id} className="border-b border-border last:border-0">
                            <td className="py-2 px-3">
                              <div className="flex items-center gap-1.5">
                                {p.meioo && <MeiooIcon size={11} variant="badge" />}
                                {p.meioo && p.meiooTipo === "pix"    && <QrCode  size={11} className="text-primary" />}
                                {p.meioo && p.meiooTipo === "boleto" && <FileText size={11} className="text-primary" />}
                                {p.meioo && p.meiooTipo === "link"   && <Link2   size={11} className="text-primary" />}
                                <span className="text-dark">{p.forma}</span>
                              </div>
                            </td>
                            <td className="py-2 px-3 text-right font-medium text-dark">
                              {p.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </td>
                            <td className="py-2 px-2 text-center">
                              <button onClick={() => handleRemoverPagamento(p.id)} className="text-muted hover:text-danger transition-colors">
                                <X size={12} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Ajuste de valor */}
                <div className="rounded border border-border bg-bg/30 p-3">
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Ajuste de valor</p>
                  <div className="flex items-center gap-4 mb-2.5">
                    {(["desconto", "acrescimo"] as const).map(a => (
                      <label key={a} className="flex items-center gap-1.5 text-xs text-dark cursor-pointer">
                        <input type="radio" checked={ajuste === a} onChange={() => setAjuste(a)} className="accent-primary" />
                        {a === "desconto" ? "Desconto" : "Acréscimo"}
                      </label>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-muted font-medium block mb-1">Tipo de desconto</label>
                      <div className="relative">
                        <select
                          value={tipoDesconto}
                          onChange={e => setTipoDesconto(e.target.value)}
                          className="w-full h-8 pl-2 pr-6 rounded border border-border bg-surface text-xs text-dark focus:outline-none appearance-none"
                        >
                          <option>Valor R$</option>
                          <option>Percentual %</option>
                        </select>
                        <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-muted font-medium block mb-1">Valor do desconto</label>
                      <div className="flex items-center gap-1">
                        <input
                          value={valorDesconto}
                          onChange={e => setValorDesconto(e.target.value)}
                          className="flex-1 min-w-0 h-8 px-2 rounded border border-border bg-surface text-xs text-dark focus:outline-none focus:border-primary"
                        />
                        <button className="w-8 h-8 shrink-0 flex items-center justify-center rounded border border-border bg-surface hover:bg-bg text-primary">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resumo */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded border border-border bg-bg/30 p-3 text-center">
                    <div className="text-[10px] font-medium text-muted">Pago</div>
                    <div className="text-sm font-bold text-primary mt-0.5">
                      {totalPago.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </div>
                  </div>
                  <div className="rounded border border-border bg-bg/30 p-3 text-center">
                    <div className="text-[10px] font-medium text-muted">Restante</div>
                    <div className={`text-sm font-bold mt-0.5 ${restante > 0.009 ? "text-danger" : "text-success"}`}>
                      {restante.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </div>
                  </div>
                </div>
                <div className="rounded border border-success/20 bg-[#e8f5e9] p-3 text-center">
                  <div className="text-[10px] font-medium text-muted">Troco</div>
                  <div className="text-xl font-extrabold text-[#1b5e20] mt-0.5">
                    {troco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="border-t border-border shrink-0" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
                <div className="grid grid-cols-5 border-b border-border">
                  {[
                    { label: "NFC-e",           sub: "F1",  action: handleFinalizar },
                    { label: "PV",              sub: "F2",  action: handleFinalizar },
                    { label: "NF-e",            sub: "F4",  action: handleFinalizar },
                    { label: "Consultar",       sub: "F8",  action: undefined },
                    { label: "Cancelar Item",   sub: "F7",  action: undefined },
                  ].map(btn => (
                    <button
                      key={btn.label}
                      onClick={btn.action}
                      disabled={carregando}
                      className="py-2 px-1 text-center bg-primary text-white border-r border-primary-hover last:border-0 hover:bg-primary-hover transition-colors disabled:opacity-60 active:bg-primary-hover"
                    >
                      <div className="text-[10px] font-semibold leading-tight">{btn.label}</div>
                      <div className="text-primary-light text-[9px]">({btn.sub})</div>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-5">
                  {[
                    { label: "Cancelar Venda",      sub: "F9",  action: handleNovaVenda },
                    { label: "Financeiro",           sub: "",    action: undefined },
                    { label: "Finalizados",          sub: "",    action: undefined },
                    { label: "Tela Cheia",           sub: "F11", action: undefined },
                    { label: "Sair",                 sub: "ESC", action: () => router.back() },
                  ].map(btn => (
                    <button
                      key={btn.label}
                      onClick={btn.action}
                      className="py-2 px-1 text-center bg-dark text-white border-r border-dark/60 last:border-0 hover:bg-dark/80 transition-colors"
                    >
                      <div className="text-[10px] font-medium leading-tight">{btn.label}</div>
                      {btn.sub && <div className="text-white/40 text-[9px]">({btn.sub})</div>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PainelMeioo
        aberto={painelMeiooAberto}
        onFechar={() => setPainelMeiooAberto(false)}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 bg-dark text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">
          {toast.type === "ok"
            ? <CheckCircle2 size={15} className="text-success shrink-0" />
            : <X size={15} className="text-danger shrink-0" />
          }
          {toast.msg}
        </div>
      )}
    </div>
  );
}
