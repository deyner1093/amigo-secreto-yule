"use client";

import type { PublicRoom } from "@/lib/types";

export function ParticipantsGallery({ room }: { room: PublicRoom }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="px-1 font-display text-xl text-yule-cream">Todos</h2>

      <div className="grid grid-cols-2 gap-3">
        {room.participants.map((p) => (
          <article
            key={p.id}
            className="flex min-h-[112px] flex-col justify-between rounded-[1.4rem] border border-white/50 bg-[rgba(255,252,248,0.75)] p-3.5 shadow-[0_12px_28px_rgba(64,45,36,0.06)] backdrop-blur"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#e2b4c0,#9a4f63)] text-sm font-semibold text-[#fff7f9]">
              {p.name.trim().charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="truncate text-sm font-semibold text-yule-cream">
                {p.name}
              </p>
              <p className="text-xs text-yule-mist">
                {p.status === "ready" ? "Listo" : "Esperando"}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
