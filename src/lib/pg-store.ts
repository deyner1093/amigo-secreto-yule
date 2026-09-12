import { neon } from "@neondatabase/serverless";
import type { Room } from "./types";

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

export function isPostgresConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

let ensured = false;

async function ensureTable() {
  const sql = getSql();
  if (!sql || ensured) return;
  await sql`
    CREATE TABLE IF NOT EXISTS rooms (
      code TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  ensured = true;
}

export async function pgGetRoom(code: string): Promise<Room | null> {
  const sql = getSql();
  if (!sql) return null;
  await ensureTable();

  const rows = await sql`
    SELECT data FROM rooms WHERE code = ${code.toUpperCase()} LIMIT 1
  `;

  if (!rows.length) return null;
  return rows[0]!.data as Room;
}

export async function pgSaveRoom(room: Room): Promise<void> {
  const sql = getSql();
  if (!sql) {
    throw new Error("DATABASE_URL no está configurada.");
  }
  await ensureTable();

  const payload = JSON.stringify(room);
  await sql`
    INSERT INTO rooms (code, data, updated_at)
    VALUES (${room.code}, CAST(${payload} AS jsonb), NOW())
    ON CONFLICT (code)
    DO UPDATE SET data = CAST(${payload} AS jsonb), updated_at = NOW()
  `;
}
