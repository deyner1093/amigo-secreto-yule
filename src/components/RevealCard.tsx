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
    <section className="flex flex-col items-center gap-4">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-yule-gold/70">
          Revelación privada
        </p>
        <h2 className="font-display mt-1 text-2xl text-yule-cream">
          Hola, {yourName}
        </h2>
        <p className="mt-1 text-sm text-yule-mist">
          {opened
            ? "Guarda el secreto… ¡y elige un buen regalo!"
            : "Toca el sobre navideño para revelar tu amigo secreto."}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setOpened(true)}
        aria-label={
          opened
            ? `Tu amigo secreto es ${secretFriend}`
            : "Abrir sobre y revelar amigo secreto"
        }
        className="reveal-envelope group relative w-full max-w-sm overflow-hidden rounded-[28px] border border-yule-gold/40 bg-gradient-to-b from-yule-crimson to-yule-crimson-deep p-1 shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition active:scale-[0.98]"
      >
        <div className="relative flex min-h-[280px] flex-col items-center justify-center rounded-[24px] bg-gradient-to-br from-[#1a3a2a] via-[#0f2419] to-[#08140f] px-6 py-10">
          <div
            className={`absolute inset-x-0 top-0 h-24 origin-top bg-gradient-to-b from-yule-crimson to-yule-crimson-deep transition-transform duration-700 ${
              opened ? "-translate-y-full rotate-[-8deg] opacity-0" : ""
            }`}
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
          />

          <div
            className={`absolute inset-x-6 top-10 h-px bg-gradient-to-r from-transparent via-yule-gold to-transparent transition-opacity ${
              opened ? "opacity-0" : "opacity-80"
            }`}
          />

          {!opened ? (
            <div className="relative z-10 flex flex-col items-center gap-3 text-center">
              <span className="font-display text-5xl text-yule-gold drop-shadow">
                ✶
              </span>
              <span className="font-display text-xl text-yule-cream">
                Sobre de Yule
              </span>
              <span className="rounded-full border border-yule-gold/40 px-4 py-2 text-xs uppercase tracking-widest text-yule-gold">
                Toca para abrir
              </span>
            </div>
          ) : (
            <div className="reveal-shine relative z-10 flex flex-col items-center gap-2 text-center animate-in">
              <p className="text-xs uppercase tracking-[0.3em] text-yule-gold/80">
                Tu amigo secreto es
              </p>
              <p className="font-display text-4xl leading-tight text-yule-gold">
                {secretFriend}
              </p>
              <p className="mt-2 max-w-[16rem] text-sm text-yule-mist">
                Nadie más en esta pantalla ve este nombre. ¡Feliz Yule!
              </p>
            </div>
          )}
        </div>
      </button>
    </section>
  );
}
