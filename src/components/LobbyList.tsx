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
      <div className="flex items-end justify-between gap-2 px-1">
        <h2 className="font-display text-xl text-yule-cream">Participantes</h2>
        <p className="text-sm text-yule-mist">
          {room.readyCount}/{room.totalCount}
        </p>
      </div>

      <ul className="list-shell">
        {room.participants.map((p, index) => {
          const ready = p.status === "ready";
          const isYou = p.id === highlightId;
          return (
            <li
              key={p.id}
              className={`flex min-h-14 items-center justify-between gap-3 px-4 py-3 ${
                index > 0 ? "border-t border-[var(--line)]" : ""
              } ${isYou ? "bg-[rgba(180,92,85,0.08)]" : ""}`}
            >
              <span className="truncate text-[1.05rem] text-yule-cream">
                {p.name}
                {isYou ? (
                  <span className="ml-1.5 text-sm text-yule-mist">tú</span>
                ) : null}
              </span>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  ready ? "badge-ready" : "badge-wait"
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
