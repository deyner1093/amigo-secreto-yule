import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

const sql = neon(url);

const rows = await sql`SELECT 1 AS ok`;
console.log("ok", rows);
await sql`
  CREATE TABLE IF NOT EXISTS rooms (
    code TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;
console.log("table ready");
