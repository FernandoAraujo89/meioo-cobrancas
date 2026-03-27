import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const rows = await sql`
      SELECT
        id,
        cliente,
        historico,
        valor::float,
        tipo,
        status,
        vencimento,
        criado_em
      FROM cobrancas_bancarias
      ORDER BY criado_em DESC
    `;
    return NextResponse.json({ cobrancas: rows });
  } catch (err) {
    console.error("GET /api/cobrancas", err);
    return NextResponse.json({ error: "Erro ao buscar cobranças" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { cliente, historico, valor, tipo, vencimento } = await req.json();

    if (!cliente || !valor || !tipo) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const [nova] = await sql`
      INSERT INTO cobrancas_bancarias (cliente, historico, valor, tipo, vencimento)
      VALUES (${cliente}, ${historico ?? null}, ${valor}, ${tipo}, ${vencimento ?? null})
      RETURNING id, cliente, historico, valor::float, tipo, status, vencimento, criado_em
    `;

    return NextResponse.json({ cobranca: nova }, { status: 201 });
  } catch (err) {
    console.error("POST /api/cobrancas", err);
    return NextResponse.json({ error: "Erro ao salvar cobrança" }, { status: 500 });
  }
}
