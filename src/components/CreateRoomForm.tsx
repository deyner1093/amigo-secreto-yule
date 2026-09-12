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
      router.push(`/sala/${payload.code}?admin=${payload.adminToken}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-yule-gold/90">
          Lista de participantes
        </span>
        <textarea
          value={namesText}
          onChange={(e) => setNamesText(e.target.value)}
          placeholder={"Ana\nBruno\nCarla\nDiego"}
          rows={6}
          className="min-h-[160px] w-full resize-y rounded-2xl border border-yule-pine/60 bg-yule-night/70 px-4 py-3 text-base leading-relaxed text-yule-cream placeholder:text-yule-mist/50 outline-none ring-yule-gold/40 focus:ring-2"
        />
        <span className="text-xs text-yule-mist">
          Escribe o pega nombres (uno por línea, o separados por comas).{" "}
          {previewCount > 0 ? `${previewCount} detectados.` : null}
        </span>
      </label>

      <div className="rounded-2xl border border-yule-pine/50 bg-yule-forest/40 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-yule-cream">
              ¿El administrador también participa?
            </p>
            <p className="mt-0.5 text-xs text-yule-mist">
              Si eliges sí, podrás revelar tu propio amigo secreto.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={adminParticipates}
            onClick={() => setAdminParticipates((v) => !v)}
            className={`relative h-12 w-[88px] shrink-0 rounded-full transition-colors ${
              adminParticipates ? "bg-yule-holly" : "bg-yule-pine/80"
            }`}
          >
            <span
              className={`absolute top-1 left-1 flex h-10 w-10 items-center justify-center rounded-full bg-yule-cream text-xs font-bold text-yule-night shadow transition-transform ${
                adminParticipates ? "translate-x-9" : "translate-x-0"
              }`}
            >
              {adminParticipates ? "Sí" : "No"}
            </span>
          </button>
        </div>

        {adminParticipates ? (
          <label className="mt-4 flex flex-col gap-2">
            <span className="text-sm text-yule-gold/90">Tu nombre</span>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="Ej. María"
              className="h-12 w-full rounded-2xl border border-yule-pine/60 bg-yule-night/70 px-4 text-base text-yule-cream outline-none ring-yule-gold/40 focus:ring-2"
            />
          </label>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-xl bg-yule-crimson/20 px-3 py-2 text-sm text-yule-crimson-light">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        disabled={loading}
        onClick={() => void handleCreate()}
        className="btn-primary"
      >
        {loading ? "Creando sala…" : "Crear Sala y Generar Link"}
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
