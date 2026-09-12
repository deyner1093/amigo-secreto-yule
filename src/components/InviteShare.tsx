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
    `Amigo Secreto para Yule\n\nSala ${roomCode}:\n${inviteUrl}`,
  );
  const whatsappHref = `https://api.whatsapp.com/send?text=${whatsappText}`;

  return (
    <section className="surface-card flex flex-col gap-3">
      <div>
        <p className="text-[0.8125rem] font-medium text-yule-mist">
          Invitación · {roomCode}
        </p>
        <p className="mt-1 break-all text-sm text-yule-cream">{inviteUrl}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => void copyLink()}
          className="btn-secondary"
        >
          {copied ? "Copiado" : "Copiar"}
        </button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
        >
          WhatsApp
        </a>
      </div>
    </section>
  );
}
