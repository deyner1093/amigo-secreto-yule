"use client";

import type { PublicRoom } from "@/lib/types";

export function ParticipantsGallery({ room }: { room: PublicRoom }) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="font-display text-xl text-yule-gold">Participantes</h2>
        <p className="text-sm text-yule-mist">
          Galería de la sala — sin revelar parejas.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {room.participants.map((p) => (
          <article
            key={p.id}
            className="flex min-h-[110px] flex-col justify-between rounded-2xl border border-yule-pine/50 bg-gradient-to-br from-yule-forest/60 to-yule-night/80 p-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yule-gold/15 font-display text-lg text-yule-gold">
              {p.name.trim().charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="truncate text-sm font-semibold text-yule-cream">
                {p.name}
              </p>
              <p className="text-xs text-yule-mist">
                {p.isAdmin ? "Administrador · " : ""}
                {p.status === "ready" ? "Listo" : "Esperando"}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
