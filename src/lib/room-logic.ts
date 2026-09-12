import { customAlphabet } from "nanoid";
import type { CreateRoomInput, Participant, PublicRoom, Room } from "./types";
import { buildSecretSantaAssignments } from "./derangement";

const roomCode = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);
const tokenId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 24);
const participantId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 12);

export function generateRoomCode() {
  return roomCode();
}

export function generateAdminToken() {
  return tokenId();
}

export function generateParticipantId() {
  return participantId();
}

export function parseNames(raw: string): string[] {
  const seen = new Set<string>();
  return raw
    .split(/[\n,;]+/)
    .map((n) => n.trim())
    .filter(Boolean)
    .filter((name) => {
      const key = name.toLocaleLowerCase("es");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function buildRoom(input: CreateRoomInput): Room {
  let names = [...input.names];

  if (input.adminParticipates) {
    const adminName = (input.adminName ?? "").trim();
    if (!adminName) {
      throw new Error("Indica el nombre del administrador para participar.");
    }
    const exists = names.some(
      (n) => n.toLocaleLowerCase("es") === adminName.toLocaleLowerCase("es"),
    );
    if (!exists) {
      names = [adminName, ...names];
    }
  }

  if (names.length < 2) {
    throw new Error("Añade al menos 2 participantes.");
  }

  const participants: Participant[] = names.map((name) => {
    const isAdmin =
      input.adminParticipates &&
      name.toLocaleLowerCase("es") ===
        (input.adminName ?? "").trim().toLocaleLowerCase("es");

    return {
      id: generateParticipantId(),
      name,
      status: "waiting" as const,
      isAdmin: isAdmin || undefined,
    };
  });

  // Si hay varios con el mismo nombre normalizado (no debería), marca solo el primero
  if (input.adminParticipates) {
    let marked = false;
    for (const p of participants) {
      if (
        !marked &&
        p.name.toLocaleLowerCase("es") ===
          (input.adminName ?? "").trim().toLocaleLowerCase("es")
      ) {
        p.isAdmin = true;
        marked = true;
      } else {
        delete p.isAdmin;
      }
    }
  }

  return {
    code: generateRoomCode(),
    adminToken: generateAdminToken(),
    adminParticipates: input.adminParticipates,
    status: "lobby",
    participants,
    createdAt: Date.now(),
  };
}

export function applyDraw(room: Room): Room {
  if (room.status === "drawn") {
    throw new Error("El sorteo ya se realizó.");
  }

  const allReady = room.participants.every((p) => p.status === "ready");
  if (!allReady) {
    throw new Error("Todos los participantes deben confirmar antes del sorteo.");
  }

  const assignments = buildSecretSantaAssignments(room.participants);

  return {
    ...room,
    status: "drawn",
    participants: room.participants.map((p) => ({
      ...p,
      assignment: assignments[p.id],
    })),
  };
}

export function confirmParticipant(
  room: Room,
  participantId: string,
): Room {
  if (room.status === "drawn") {
    throw new Error("El sorteo ya terminó; no se pueden cambiar confirmaciones.");
  }

  const exists = room.participants.some((p) => p.id === participantId);
  if (!exists) {
    throw new Error("Participante no encontrado.");
  }

  return {
    ...room,
    participants: room.participants.map((p) =>
      p.id === participantId ? { ...p, status: "ready" as const } : p,
    ),
  };
}

export function toPublicRoom(
  room: Room,
  options: {
    adminToken?: string | null;
    viewerParticipantId?: string | null;
  } = {},
): PublicRoom {
  const isAdmin = Boolean(
    options.adminToken && options.adminToken === room.adminToken,
  );
  const readyCount = room.participants.filter((p) => p.status === "ready").length;
  const totalCount = room.participants.length;

  return {
    code: room.code,
    adminParticipates: room.adminParticipates,
    status: room.status,
    createdAt: room.createdAt,
    isAdmin,
    readyCount,
    totalCount,
    allReady: readyCount === totalCount && totalCount > 0,
    participants: room.participants.map((p) => {
      const showAssignment =
        room.status === "drawn" && p.id === options.viewerParticipantId;

      return {
        id: p.id,
        name: p.name,
        status: p.status,
        isAdmin: p.isAdmin,
        ...(showAssignment && p.assignment
          ? { assignment: p.assignment }
          : {}),
      };
    }),
  };
}
