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
      <div className="flex items-end justify-between gap-2 px-0.5">
        <h2 className="text-[1.0625rem] font-semibold text-yule-cream">
          Participantes
        </h2>
        <p className="text-sm text-yule-mist">
          {room.readyCount}/{room.totalCount}
        </p>
      </div>

      <ul className="overflow-hidden rounded-[1.125rem] bg-white">
        {room.participants.map((p, index) => {
          const ready = p.status === "ready";
          const isYou = p.id === highlightId;
          return (
            <li
              key={p.id}
              className={`flex min-h-14 items-center justify-between gap-3 px-4 py-3 ${
                index > 0 ? "border-t border-black/[0.06]" : ""
              } ${isYou ? "bg-blue-50/70" : ""}`}
            >
              <span className="truncate text-[1.0625rem] text-yule-cream">
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
