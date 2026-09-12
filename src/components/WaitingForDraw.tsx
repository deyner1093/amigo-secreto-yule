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
      <div className="hero-mark waiting-pulse text-xl" aria-hidden>
        ✶
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-semibold text-[var(--ready)]">Estás listo</p>
        <h2 className="font-display text-[2rem] text-yule-cream">
          Hola, {yourName}
        </h2>
        <p className="mx-auto max-w-[17rem] text-sm leading-relaxed text-yule-mist">
          Esperando el sorteo. Puedes dejar esta pantalla abierta.
        </p>
      </div>

      <div className="surface-card w-full space-y-2 text-left">
        <div className="flex items-center justify-between text-sm">
          <span className="text-yule-mist">Progreso</span>
          <span className="font-semibold text-yule-cream">
            {room.readyCount} de {room.totalCount}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(42,36,31,0.08)]">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#d4a29a,var(--ember))] transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <ul className="list-shell w-full text-left">
        {room.participants.map((p, index) => {
          const ready = p.status === "ready";
          const isYou = p.id === yourId;
          return (
            <li
              key={p.id}
              className={`flex min-h-12 items-center justify-between px-4 py-3 ${
                index > 0 ? "border-t border-[var(--line)]" : ""
              } ${isYou ? "bg-[rgba(180,92,85,0.08)]" : ""}`}
            >
              <span className="truncate text-[0.95rem] text-yule-cream">
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
        <p className="text-sm font-medium text-[var(--ember)]">
          Todos listos. Pronto llega el sorteo…
        </p>
      ) : null}
    </section>
  );
}
