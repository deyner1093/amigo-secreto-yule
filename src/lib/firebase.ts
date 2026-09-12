import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  type Firestore,
} from "firebase/firestore";
import type { Room } from "./types";

function getFirebaseConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  if (!apiKey || !projectId || !appId) {
    return null;
  }

  return {
    apiKey,
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
      `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
      `${projectId}.appspot.com`,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId,
  };
}

export function isFirebaseConfigured() {
  return getFirebaseConfig() !== null;
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export function getDb(): Firestore | null {
  const config = getFirebaseConfig();
  if (!config) return null;

  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(config);
    db = getFirestore(app);
  }

  return db;
}

export async function firebaseGetRoom(code: string): Promise<Room | null> {
  const firestore = getDb();
  if (!firestore) return null;

  const snap = await getDoc(doc(firestore, "rooms", code.toUpperCase()));
  if (!snap.exists()) return null;
  return snap.data() as Room;
}

export async function firebaseSaveRoom(room: Room): Promise<void> {
  const firestore = getDb();
  if (!firestore) {
    throw new Error("Firebase no está configurado.");
  }
  await setDoc(doc(firestore, "rooms", room.code), room);
}

export async function firebaseUpdateRoom(
  code: string,
  data: Partial<Room>,
): Promise<void> {
  const firestore = getDb();
  if (!firestore) {
    throw new Error("Firebase no está configurado.");
  }
  await updateDoc(doc(firestore, "rooms", code.toUpperCase()), data);
}
