"use client";

import { initializeApp, getApps } from "firebase/app";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import type { PublicRoom, Room } from "./types";
import { toPublicRoom } from "./room-logic";

function clientConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  if (!apiKey || !projectId || !appId) return null;
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

export function isClientFirebaseEnabled() {
  return clientConfig() !== null;
}

export function subscribeRoom(
  code: string,
  options: {
    adminToken?: string | null;
    participantId?: string | null;
  },
  onData: (room: PublicRoom) => void,
  onError?: (error: Error) => void,
): (() => void) | null {
  const config = clientConfig();
  if (!config) return null;

  const app = getApps().length ? getApps()[0]! : initializeApp(config);
  const db = getFirestore(app);

  return onSnapshot(
    doc(db, "rooms", code.toUpperCase()),
    (snap) => {
      if (!snap.exists()) {
        onError?.(new Error("Sala no encontrada."));
        return;
      }
      const room = snap.data() as Room;
      onData(
        toPublicRoom(room, {
          adminToken: options.adminToken,
          viewerParticipantId: options.participantId,
        }),
      );
    },
    (err) => onError?.(err),
  );
}
