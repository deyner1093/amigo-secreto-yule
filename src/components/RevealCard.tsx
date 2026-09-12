"use client";

import { useState } from "react";

export function RevealCard({
  yourName,
  secretFriend,
}: {
  yourName: string;
  secretFriend: string;
}) {
  const [opened, setOpened] = useState(false);

  return (
    <section className="flex flex-col items-center gap-5">
      <div className="text-center">
        <h2 className="font-display text-[2rem] text-yule-cream">
          Hola, {yourName}
        </h2>
        <p className="mt-1 text-sm text-yule-mist">
          {opened ? "Solo tú ves este nombre." : "Toca para revelar."}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setOpened(true)}
        aria-label={
          opened
            ? `Tu amigo secreto es ${secretFriend}`
            : "Revelar amigo secreto"
        }
        className="relative w-full overflow-hidden rounded-[1.85rem] border border-white/50 bg-[linear-gradient(160deg,#ffffff_0%,#f3e8ee_100%)] p-8 shadow-[0_20px_50px_rgba(34,31,39,0.1)] transition active:scale-[0.985]"
      >
        <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[rgba(154,79,99,0.12)] blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-[rgba(196,138,152,0.2)] blur-2xl" />

        <div className="relative flex min-h-[220px] flex-col items-center justify-center">
          {!opened ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="hero-mark text-xl">✶</span>
              <span className="font-display text-2xl text-yule-cream">
                Tu amigo secreto
              </span>
              <span className="text-sm text-yule-mist">Toca para abrir</span>
            </div>
          ) : (
            <div className="animate-in flex flex-col items-center gap-2 text-center">
              <p className="text-sm text-yule-mist">Tu amigo secreto es</p>
              <p className="font-display text-[2.6rem] leading-tight text-[var(--ember-deep)]">
                {secretFriend}
              </p>
            </div>
          )}
        </div>
      </button>
    </section>
  );
}
