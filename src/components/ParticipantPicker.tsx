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
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <h2 className="font-display text-[1.75rem] text-yule-cream">
          ¿Quién eres?
        </h2>
        <p className="mt-1 text-sm text-yule-mist">Elige tu nombre</p>
      </div>

      <ul className="overflow-hidden rounded-[1.125rem] bg-white">
        {room.participants.map((p, index) => {
          const selected = selectedId === p.id;
          const alreadyReady = p.status === "ready";
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setSelectedId(p.id)}
                className={`flex min-h-14 w-full items-center justify-between px-4 text-left text-[1.0625rem] transition active:bg-black/[0.03] ${
                  index > 0 ? "border-t border-black/[0.06]" : ""
                } ${selected ? "bg-blue-50" : ""}`}
              >
                <span className="font-medium text-yule-cream">{p.name}</span>
                {selected ? (
                  <span className="text-[#007aff]">✓</span>
                ) : alreadyReady && room.status === "lobby" ? (
                  <span className="text-xs font-semibold text-[#248a3d]">
                    Listo
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      {error ? (
        <p className="rounded-[0.875rem] bg-red-50 px-3 py-2 text-sm text-yule-crimson">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        disabled={!selectedId || loading}
        onClick={() => void confirm()}
        className="btn-primary"
      >
        {loading
          ? "Un momento…"
          : room.status === "drawn"
            ? "Ver mi sobre"
            : "Confirmar"}
      </button>
    </div>
  );
}
