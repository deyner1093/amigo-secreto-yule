"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  isClientFirebaseEnabled,
  subscribeRoom,
} from "@/lib/firebase-client";
import type { PublicRoom } from "@/lib/types";

async function fetchRoom(
  code: string,
  adminToken?: string | null,
  participantId?: string | null,
): Promise<PublicRoom> {
  const params = new URLSearchParams();
  if (adminToken) params.set("adminToken", adminToken);
  if (participantId) params.set("participantId", participantId);

  const qs = params.toString();
  const res = await fetch(
    `/api/rooms/${encodeURIComponent(code)}${qs ? `?${qs}` : ""}`,
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al cargar la sala.");
  return data.room as PublicRoom;
}

export function useRoom(
  code: string,
  options: {
    adminToken?: string | null;
    participantId?: string | null;
    pollMs?: number;
  } = {},
) {
  const [room, setRoom] = useState<PublicRoom | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const refresh = useCallback(async () => {
    try {
      const next = await fetchRoom(
        code,
        optionsRef.current.adminToken,
        optionsRef.current.participantId,
      );
      setRoom(next);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de red.");
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    let cancelled = false;
    let unsub: (() => void) | null = null;
    let interval: ReturnType<typeof setInterval> | undefined;

    async function boot() {
      setLoading(true);
      try {
        const next = await fetchRoom(
          code,
          options.adminToken,
          options.participantId,
        );
        if (!cancelled) {
          setRoom(next);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error de red.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }

      if (cancelled) return;

      if (isClientFirebaseEnabled()) {
        unsub = subscribeRoom(
          code,
          {
            adminToken: options.adminToken,
            participantId: options.participantId,
          },
          (next) => {
            if (!cancelled) {
              setRoom(next);
              setError(null);
            }
          },
          (err) => {
            if (!cancelled) setError(err.message);
          },
        );
      } else {
        interval = setInterval(() => {
          void refresh();
        }, options.pollMs ?? 2000);
      }
    }

    void boot();

    return () => {
      cancelled = true;
      unsub?.();
      if (interval) clearInterval(interval);
    };
  }, [
    code,
    options.adminToken,
    options.participantId,
    options.pollMs,
    refresh,
  ]);

  return { room, setRoom, error, loading, refresh };
}
