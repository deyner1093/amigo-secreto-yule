"use client";

import type { PublicRoom } from "@/lib/types";

export function WaitingForDraw({
  room,
  yourName,
  yourId,
}: {
  room: PublicRoom;
  yourName: string;
  yourId?: string | null;
}) {
  const progress =
    room.totalCount > 0 ? (room.readyCount / room.totalCount) * 100 : 0;

  return (
    <section className="flex flex-col items-center gap-5 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
        <span className="waiting-pulse text-2xl text-[#007aff]">●</span>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-[#248a3d]">Listo</p>
        <h2 className="font-display text-[1.75rem] text-yule-cream">
          Hola, {yourName}
        </h2>
        <p className="mx-auto max-w-[17rem] text-sm leading-relaxed text-yule-mist">
          Esperando el sorteo. Puedes dejar esta pantalla abierta.
        </p>
      </div>

      <div className="w-full space-y-2 rounded-[1.125rem] bg-white p-4 text-left">
        <div className="flex items-center justify-between text-sm">
          <span className="text-yule-mist">Progreso</span>
          <span className="font-semibold text-yule-cream">
            {room.readyCount} de {room.totalCount}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--ios-fill)]">
          <div
            className="h-full rounded-full bg-[#007aff] transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <ul className="w-full overflow-hidden rounded-[1.125rem] bg-white text-left">
        {room.participants.map((p, index) => {
          const ready = p.status === "ready";
          const isYou = p.id === yourId;
          return (
            <li
              key={p.id}
              className={`flex min-h-12 items-center justify-between px-4 py-3 ${
                index > 0 ? "border-t border-black/[0.06]" : ""
              } ${isYou ? "bg-blue-50/70" : ""}`}
            >
              <span className="truncate text-[0.9375rem] text-yule-cream">
                {p.name}
                {isYou ? (
                  <span className="ml-1.5 text-xs text-yule-mist">tú</span>
                ) : null}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  ready ? "badge-ready" : "badge-wait"
                }`}
              >
                {ready ? "Listo" : "Esperando"}
              </span>
            </li>
          );
        })}
      </ul>

      {room.allReady ? (
        <p className="text-sm font-medium text-[#007aff]">
          Todos listos. Pronto llega el sorteo…
        </p>
      ) : null}
    </section>
  );
}
