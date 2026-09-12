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
        <h2 className="font-display text-[1.75rem] text-yule-cream">
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
        className="relative w-full overflow-hidden rounded-[1.5rem] bg-white p-8 shadow-sm transition active:scale-[0.98]"
      >
        <div className="flex min-h-[220px] flex-col items-center justify-center">
          {!opened ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ios-fill)] text-2xl text-[#007aff]">
                ✶
              </span>
              <span className="text-[1.125rem] font-semibold text-yule-cream">
                Tu amigo secreto
              </span>
              <span className="text-sm text-yule-mist">Toca para abrir</span>
            </div>
          ) : (
            <div className="animate-in flex flex-col items-center gap-2 text-center">
              <p className="text-sm text-yule-mist">Tu amigo secreto es</p>
              <p className="font-display text-[2.5rem] leading-tight text-yule-cream">
                {secretFriend}
              </p>
            </div>
          )}
        </div>
      </button>
    </section>
  );
}
