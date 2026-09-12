"use client";

import type { PublicRoom } from "@/lib/types";

export function LobbyList({
  room,
  highlightId,
}: {
  room: PublicRoom;
  highlightId?: string | null;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-2">
        <h2 className="font-display text-xl text-yule-gold">Lobby en vivo</h2>
        <p className="text-sm text-yule-mist">
          <span className="font-semibold text-yule-cream">
            {room.readyCount}
          </span>{" "}
          de {room.totalCount} listas
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {room.participants.map((p) => {
          const ready = p.status === "ready";
          const isYou = p.id === highlightId;
          return (
            <li
              key={p.id}
              className={`flex min-h-12 items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition ${
                isYou
                  ? "border-yule-gold/70 bg-yule-gold/10"
                  : "border-yule-pine/40 bg-yule-forest/30"
              }`}
            >
              <span className="truncate text-base text-yule-cream">
                {p.name}
                {p.isAdmin ? (
                  <span className="ml-2 text-xs text-yule-gold/80">Admin</span>
                ) : null}
                {isYou ? (
                  <span className="ml-2 text-xs text-yule-mist">(tú)</span>
                ) : null}
              </span>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  ready
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-white/10 text-yule-mist"
                }`}
              >
                {ready ? "Listo" : "Esperando"}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
