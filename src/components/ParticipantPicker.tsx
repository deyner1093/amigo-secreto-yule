"use client";

import { useState } from "react";
import type { PublicRoom } from "@/lib/types";

export function ParticipantPicker({
  room,
  onConfirmed,
}: {
  room: PublicRoom;
  onConfirmed: (participantId: string, room: PublicRoom) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    if (!selectedId) return;
    setLoading(true);
    setError(null);
    try {
      // Tras el sorteo solo necesitamos saber quién mira (sin mutar estado).
      if (room.status === "drawn") {
        localStorage.setItem(`yule-participant-${room.code}`, selectedId);
        const res = await fetch(
          `/api/rooms/${room.code}?participantId=${encodeURIComponent(selectedId)}`,
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "No se pudo cargar.");
        onConfirmed(selectedId, data.room as PublicRoom);
        return;
      }

      const res = await fetch(`/api/rooms/${room.code}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: selectedId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo confirmar.");
      localStorage.setItem(`yule-participant-${room.code}`, selectedId);
      onConfirmed(selectedId, data.room as PublicRoom);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-2xl text-yule-gold">¿Quién eres?</h2>
        <p className="mt-1 text-sm text-yule-mist">
          Toca tu nombre para confirmar. Solo tú verás tu amigo secreto.
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {room.participants.map((p) => {
          const selected = selectedId === p.id;
          const alreadyReady = p.status === "ready";
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setSelectedId(p.id)}
                className={`flex min-h-14 w-full items-center justify-between rounded-2xl border px-4 text-left text-base transition active:scale-[0.98] ${
                  selected
                    ? "border-yule-gold bg-yule-gold/15 text-yule-cream shadow-[0_0_0_1px_rgba(212,175,55,0.35)]"
                    : "border-yule-pine/50 bg-yule-forest/40 text-yule-cream"
                }`}
              >
                <span className="font-medium">{p.name}</span>
                {alreadyReady && room.status === "lobby" ? (
                  <span className="text-xs text-emerald-300">Ya listo</span>
                ) : selected ? (
                  <span className="text-xs text-yule-gold">Seleccionado</span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      {error ? (
        <p className="rounded-xl bg-yule-crimson/20 px-3 py-2 text-sm text-yule-crimson-light">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        disabled={!selectedId || loading}
        onClick={() => void confirm()}
        className="btn-primary"
      >
        {loading ? "Un momento…" : room.status === "drawn" ? "Ver mi sobre" : "Confirmar — estoy listo"}
      </button>
    </div>
  );
}
