"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_KEY = "yule-admin";

export function CreateRoomForm() {
  const router = useRouter();
  const [namesText, setNamesText] = useState("");
  const [adminParticipates, setAdminParticipates] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewCount = useMemo(() => {
    return namesText
      .split(/[\n,;]+/)
      .map((n) => n.trim())
      .filter(Boolean).length;
  }, [namesText]);

  async function handleCreate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namesText,
          adminParticipates,
          adminName: adminParticipates ? adminName : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear la sala.");

      const payload = {
        code: data.room.code as string,
        adminToken: data.adminToken as string,
      };
      localStorage.setItem(ADMIN_KEY, JSON.stringify(payload));
      if (data.adminParticipantId) {
        localStorage.setItem(
          `yule-participant-${payload.code}`,
          data.adminParticipantId as string,
        );
      }
      router.push(`/sala/${payload.code}?admin=${payload.adminToken}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <label className="flex flex-col gap-2">
        <span className="px-0.5 text-[0.8125rem] font-medium text-yule-mist">
          Participantes
        </span>
        <textarea
          value={namesText}
          onChange={(e) => setNamesText(e.target.value)}
          placeholder={"Ana\nBruno\nCarla\nDiego"}
          rows={6}
          className="field min-h-[150px] resize-y leading-relaxed"
        />
        {previewCount > 0 ? (
          <span className="px-0.5 text-xs text-yule-mist">
            {previewCount} {previewCount === 1 ? "persona" : "personas"}
          </span>
        ) : null}
      </label>

      <div className="rounded-[0.875rem] bg-[var(--ios-fill)] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.9375rem] font-medium text-yule-cream">
            Yo también juego
          </p>
          <button
            type="button"
            role="switch"
            aria-checked={adminParticipates}
            aria-label="Yo también juego"
            onClick={() => setAdminParticipates((v) => !v)}
            className="ios-switch"
          >
            <span className="ios-switch-knob" />
          </button>
        </div>

        {adminParticipates ? (
          <label className="mt-3 flex flex-col gap-2 border-t border-black/5 pt-3">
            <span className="text-[0.8125rem] font-medium text-yule-mist">
              Tu nombre
            </span>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="María"
              className="field bg-white"
            />
          </label>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-[0.875rem] bg-red-50 px-3 py-2 text-sm text-yule-crimson">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        disabled={loading}
        onClick={() => void handleCreate()}
        className="btn-primary"
      >
        {loading ? "Creando…" : "Crear sala"}
      </button>
    </div>
  );
}

export function readStoredAdmin(): { code: string; adminToken: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { code: string; adminToken: string };
  } catch {
    return null;
  }
}
