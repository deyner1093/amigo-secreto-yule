"use client";

import { useEffect, useMemo, useState } from "react";
import { InviteShare } from "@/components/InviteShare";
import { LobbyList } from "@/components/LobbyList";
import { ParticipantPicker } from "@/components/ParticipantPicker";
import { ParticipantsGallery } from "@/components/ParticipantsGallery";
import { RevealCard } from "@/components/RevealCard";
import { WaitingForDraw } from "@/components/WaitingForDraw";
import { useRoom } from "@/hooks/useRoom";
import type { PublicRoom } from "@/lib/types";

type Tab = "lobby" | "mine" | "people";

export function RoomApp({
  code,
  initialAdminToken,
}: {
  code: string;
  initialAdminToken?: string | null;
}) {
  const [adminToken, setAdminToken] = useState<string | null>(
    initialAdminToken ?? null,
  );
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("lobby");
  const [drawing, setDrawing] = useState(false);
  const [drawError, setDrawError] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState("");

  useEffect(() => {
    setInviteUrl(`${window.location.origin}/sala/${code}`);

    if (!adminToken) {
      try {
        const raw = localStorage.getItem("yule-admin");
        if (raw) {
          const stored = JSON.parse(raw) as {
            code: string;
            adminToken: string;
          };
          if (stored.code === code) setAdminToken(stored.adminToken);
        }
      } catch {
        /* ignore */
      }
    }

    const storedPid = localStorage.getItem(`yule-participant-${code}`);
    if (storedPid) setParticipantId(storedPid);
  }, [code, adminToken]);

  const { room, setRoom, error, loading, refresh } = useRoom(code, {
    adminToken,
    participantId,
  });

  useEffect(() => {
    if (room?.status === "drawn") {
      setTab("mine");
    }
  }, [room?.status]);

  useEffect(() => {
    if (!room?.isAdmin || !room.adminParticipates || participantId) return;
    const admin = room.participants.find((p) => p.isAdmin);
    if (!admin) return;
    localStorage.setItem(`yule-participant-${code}`, admin.id);
    setParticipantId(admin.id);
  }, [room, participantId, code]);

  const me = useMemo(
    () => room?.participants.find((p) => p.id === participantId) ?? null,
    [room, participantId],
  );

  const isAdmin = Boolean(room?.isAdmin);

  async function runDraw() {
    if (!adminToken) return;
    setDrawing(true);
    setDrawError(null);
    try {
      const res = await fetch(`/api/rooms/${code}/draw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo sortear.");
      setRoom(data.room as PublicRoom);
      setTab("mine");
      await refresh();
    } catch (err) {
      setDrawError(err instanceof Error ? err.message : "Error al sortear.");
    } finally {
      setDrawing(false);
    }
  }

  if (loading && !room) {
    return (
      <div className="py-16 text-center text-yule-mist">Cargando sala…</div>
    );
  }

  if (error && !room) {
    return (
      <div className="surface-card text-center">
        <p className="text-yule-crimson-light">{error}</p>
        <a href="/" className="btn-secondary mt-4 inline-flex">
          Crear nueva sala
        </a>
      </div>
    );
  }

  if (!room) return null;

  const showPickerForGuest =
    !isAdmin && !participantId && room.status === "lobby";
  const showGuestWaiting = !isAdmin && Boolean(me) && room.status === "lobby";

  return (
    <div className="flex flex-col gap-5 pb-28">
      <header className="text-center">
        <p className="text-sm font-medium text-yule-mist">Sala {room.code}</p>
        <h1 className="font-display mt-1 text-[2rem] text-yule-cream">
          {room.status === "drawn"
            ? "Sorteo listo"
            : showGuestWaiting
              ? "Esperando"
              : "Lobby"}
        </h1>
        {isAdmin && me ? (
          <p className="mt-1 text-sm text-yule-mist">{me.name}</p>
        ) : null}
      </header>

      {isAdmin && inviteUrl ? (
        <InviteShare inviteUrl={inviteUrl} roomCode={room.code} />
      ) : null}

      {showPickerForGuest ? (
        <ParticipantPicker
          room={room}
          onConfirmed={(id, next) => {
            setParticipantId(id);
            setRoom(next);
          }}
        />
      ) : showGuestWaiting && me ? (
        <WaitingForDraw
          room={room}
          yourName={me.name}
          yourId={participantId}
        />
      ) : !isAdmin && room.status === "drawn" ? (
        me?.assignment ? (
          <RevealCard yourName={me.name} secretFriend={me.assignment} />
        ) : (
          <div className="surface-card text-center text-sm text-yule-mist">
            <p className="mb-3">El sorteo ya se hizo. Elige quién eres.</p>
            <ParticipantPicker
              room={room}
              onConfirmed={(id, next) => {
                setParticipantId(id);
                setRoom(next);
              }}
            />
          </div>
        )
      ) : (
        <>
          <nav className="segmented">
            {(
              [
                ["lobby", "Lobby"],
                ["mine", "Mi sobre"],
                ["people", "Gente"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                data-active={tab === id}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </nav>

          {tab === "lobby" ? (
            <LobbyList room={room} highlightId={participantId} />
          ) : null}

          {tab === "mine" ? (
            room.status === "drawn" && me?.assignment ? (
              <RevealCard yourName={me.name} secretFriend={me.assignment} />
            ) : (
              <div className="surface-card text-center text-sm text-yule-mist">
                {isAdmin && me
                  ? `Hola ${me.name}. Tu sobre aparecerá tras el sorteo.`
                  : "Tu sobre aparecerá tras el sorteo."}
              </div>
            )
          ) : null}

          {tab === "people" ? <ParticipantsGallery room={room} /> : null}
        </>
      )}

      {isAdmin && room.status === "lobby" ? (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--line)] bg-[rgba(236,233,239,0.88)] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
          <div className="mx-auto w-full max-w-md">
            {drawError ? (
              <p className="mb-2 text-center text-sm text-yule-crimson">
                {drawError}
              </p>
            ) : null}
            <button
              type="button"
              disabled={!room.allReady || drawing}
              onClick={() => void runDraw()}
              className="btn-primary w-full"
            >
              {drawing
                ? "Sorteando…"
                : room.allReady
                  ? "Realizar sorteo"
                  : `Esperando (${room.readyCount}/${room.totalCount})`}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
