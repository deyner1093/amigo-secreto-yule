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
    <section className="surface-card flex flex-col items-center gap-5 px-5 py-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-yule-gold/40 bg-yule-gold/10">
        <span className="waiting-pulse font-display text-3xl text-yule-gold">
          ✶
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.28em] text-yule-gold/70">
          Estás listo
        </p>
        <h2 className="font-display text-2xl text-yule-cream">
          Hola, {yourName}
        </h2>
        <p className="mx-auto max-w-[18rem] text-sm leading-relaxed text-yule-mist">
          Esperando a que todas las personas confirmen y el administrador
          realice el sorteo. No cierres esta pantalla.
        </p>
      </div>

      <div className="w-full space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-yule-mist">Personas listas</span>
          <span className="font-semibold text-yule-cream">
            {room.readyCount} de {room.totalCount}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-yule-night/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-yule-holly to-yule-gold transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <ul className="w-full space-y-2 text-left">
        {room.participants.map((p) => {
          const ready = p.status === "ready";
          const isYou = p.id === yourId;
          return (
            <li
              key={p.id}
              className={`flex min-h-12 items-center justify-between rounded-2xl border px-4 py-3 ${
                isYou
                  ? "border-yule-gold/60 bg-yule-gold/10"
                  : "border-yule-pine/40 bg-yule-night/40"
              }`}
            >
              <span className="truncate text-sm text-yule-cream">
                {p.name}
                {isYou ? (
                  <span className="ml-2 text-xs text-yule-mist">(tú)</span>
                ) : null}
              </span>
              <span
                className={`text-xs font-semibold ${
                  ready ? "text-emerald-300" : "text-yule-mist"
                }`}
              >
                {ready ? "Listo" : "Esperando"}
              </span>
            </li>
          );
        })}
      </ul>

      {room.allReady ? (
        <p className="text-sm font-medium text-yule-gold">
          ¡Todos listos! El administrador puede sortear en cualquier momento…
        </p>
      ) : (
        <p className="text-xs text-yule-mist/80">
          Esta pantalla se actualiza sola.
        </p>
      )}
    </section>
  );
}
