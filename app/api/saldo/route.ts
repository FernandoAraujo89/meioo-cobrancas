import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  const [row] = await sql`SELECT saldo FROM meioo_saldo ORDER BY id LIMIT 1`;
  const transacoes = await sql`SELECT nome, detalhe, valor::float, tipo, data FROM meioo_transacoes ORDER BY criado_em DESC LIMIT 10`;
  return NextResponse.json({ saldo: Number(row.saldo), transacoes });
}
