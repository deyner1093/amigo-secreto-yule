export type ParticipantStatus = "waiting" | "ready";

export type RoomStatus = "lobby" | "drawn";

export interface Participant {
  id: string;
  name: string;
  status: ParticipantStatus;
  /** Solo se rellena tras el sorteo; en respuestas públicas se omite salvo para el dueño. */
  assignment?: string;
  isAdmin?: boolean;
}

export interface Room {
  code: string;
  adminToken: string;
  adminParticipates: boolean;
  status: RoomStatus;
  participants: Participant[];
  createdAt: number;
}

export type PublicRoom = Omit<Room, "adminToken" | "participants"> & {
  isAdmin: boolean;
  participants: Array<
    Omit<Participant, "assignment"> & {
      assignment?: string;
    }
  >;
  readyCount: number;
  totalCount: number;
  allReady: boolean;
};

export interface CreateRoomInput {
  names: string[];
  adminParticipates: boolean;
  adminName?: string;
}
