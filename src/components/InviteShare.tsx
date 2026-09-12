"use client";

import { useState } from "react";

export function InviteShare({
  inviteUrl,
  roomCode,
}: {
  inviteUrl: string;
  roomCode: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = inviteUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const whatsappText = encodeURIComponent(
    `🎄 ¡Amigo Secreto para Yule!\n\nÚnete a la sala ${roomCode} y confirma tu nombre:\n${inviteUrl}`,
  );
  const whatsappHref = `https://api.whatsapp.com/send?text=${whatsappText}`;

  return (
    <section className="surface-card flex flex-col gap-3">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-yule-gold/70">
          Link de invitación
        </p>
        <p className="mt-1 break-all text-sm text-yule-cream/90">{inviteUrl}</p>
        <p className="mt-2 text-xs text-yule-mist">
          Código de sala:{" "}
          <span className="font-semibold text-yule-gold">{roomCode}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button type="button" onClick={() => void copyLink()} className="btn-secondary">
          {copied ? "¡Copiado!" : "Copiar Link"}
        </button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
        >
          Compartir en WhatsApp
        </a>
      </div>
    </section>
  );
}
