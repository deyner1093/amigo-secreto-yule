import {
  firebaseGetRoom,
  firebaseSaveRoom,
  isFirebaseConfigured,
} from "./firebase";
import { localGetRoom, localSaveRoom } from "./local-store";
import {
  isPostgresConfigured,
  pgGetRoom,
  pgSaveRoom,
} from "./pg-store";
import type { Room } from "./types";

export async function getRoom(code: string): Promise<Room | null> {
  if (isPostgresConfigured()) {
    return pgGetRoom(code);
  }
  if (isFirebaseConfigured()) {
    return firebaseGetRoom(code);
  }
  return localGetRoom(code);
}

export async function saveRoom(room: Room): Promise<void> {
  if (isPostgresConfigured()) {
    await pgSaveRoom(room);
    return;
  }
  if (isFirebaseConfigured()) {
    await firebaseSaveRoom(room);
    return;
  }
  await localSaveRoom(room);
}

export function getStorageMode(): "postgres" | "firebase" | "local" {
  if (isPostgresConfigured()) return "postgres";
  if (isFirebaseConfigured()) return "firebase";
  return "local";
}
