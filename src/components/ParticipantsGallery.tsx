"use client";

import type { PublicRoom } from "@/lib/types";

export function ParticipantsGallery({ room }: { room: PublicRoom }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="px-0.5 text-[1.0625rem] font-semibold text-yule-cream">
        Todos
      </h2>

      <div className="grid grid-cols-2 gap-2.5">
        {room.participants.map((p) => (
          <article
            key={p.id}
            className="flex min-h-[108px] flex-col justify-between rounded-[1.125rem] bg-white p-3.5 shadow-sm"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ios-fill)] text-sm font-semibold text-[#007aff]">
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
