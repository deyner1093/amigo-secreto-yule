import { promises as fs } from "fs";
import path from "path";
import type { Room } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "rooms.json");

type RoomMap = Record<string, Room>;

declare global {
  // eslint-disable-next-line no-var
  var __amigoSecretoRooms: RoomMap | undefined;
}

function memoryStore(): RoomMap {
  if (!globalThis.__amigoSecretoRooms) {
    globalThis.__amigoSecretoRooms = {};
  }
  return globalThis.__amigoSecretoRooms;
}

async function ensureFile(): Promise<RoomMap> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw) as RoomMap;
  } catch {
    return {};
  }
}

async function persist(rooms: RoomMap) {
  memoryStore();
  Object.assign(globalThis.__amigoSecretoRooms!, rooms);
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(rooms, null, 2), "utf8");
  } catch {
    // En entornos sin FS (algunos serverless) solo usamos memoria.
  }
}

export async function localGetRoom(code: string): Promise<Room | null> {
  const key = code.toUpperCase();
  const mem = memoryStore()[key];
  if (mem) return mem;

  const rooms = await ensureFile();
  Object.assign(memoryStore(), rooms);
  return rooms[key] ?? null;
}

export async function localSaveRoom(room: Room): Promise<void> {
  const rooms = { ...memoryStore(), ...(await ensureFile()) };
  rooms[room.code] = room;
  await persist(rooms);
}

export async function localUpdateRoom(room: Room): Promise<void> {
  await localSaveRoom(room);
}
