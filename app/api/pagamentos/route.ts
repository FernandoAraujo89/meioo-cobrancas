import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { contaId } = await req.json();
  const sql = neon(process.env.DATABASE_URL!);

  // Buscar a conta
  const [conta] = await sql`SELECT * FROM contas_pagar WHERE id = ${contaId}`;
  if (!conta) return NextResponse.json({ error: "Conta não encontrada" }, { status: 404 });
  if (conta.status === "pago") return NextResponse.json({ error: "Conta já paga" }, { status: 400 });

  const valor = Number(conta.saldo_devedor);

  // Verificar saldo
  const [saldoRow] = await sql`SELECT id, saldo FROM meioo_saldo ORDER BY id LIMIT 1`;
  const saldoAtual = Number(saldoRow.saldo);
  if (saldoAtual < valor) return NextResponse.json({ error: "Saldo insuficiente" }, { status: 400 });

  // Debitar saldo
  const novoSaldo = saldoAtual - valor;
  await sql`UPDATE meioo_saldo SET saldo = ${novoSaldo}, atualizado_em = NOW() WHERE id = ${saldoRow.id}`;

  // Marcar conta como paga
  await sql`UPDATE contas_pagar SET status = 'pago', saldo_devedor = 0, pago_em = NOW() WHERE id = ${contaId}`;

  // Registrar transação
  const hoje = new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
  await sql`INSERT INTO meioo_transacoes (nome, detalhe, valor, tipo, data) VALUES (${conta.fornecedor}, ${conta.historico}, ${-valor}, 'saida', ${hoje})`;

  return NextResponse.json({ ok: true, novoSaldo, fornecedor: conta.fornecedor, valor });
}

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  const contas = await sql`SELECT id, fornecedor, historico, TO_CHAR(vencimento,'DD/MM/YYYY') as vencimento, valor::float, saldo_devedor::float, status, meio FROM contas_pagar ORDER BY id`;
  return NextResponse.json({ contas });
}
