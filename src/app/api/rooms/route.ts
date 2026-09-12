import { NextResponse } from "next/server";
import { buildRoom, parseNames, toPublicRoom } from "@/lib/room-logic";
import { getStorageMode, saveRoom } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      namesText?: string;
      names?: string[];
      adminParticipates?: boolean;
      adminName?: string;
    };

    const names =
      body.names ??
      (typeof body.namesText === "string" ? parseNames(body.namesText) : []);

    const room = buildRoom({
      names,
      adminParticipates: Boolean(body.adminParticipates),
      adminName: body.adminName,
    });

    await saveRoom(room);

    return NextResponse.json({
      room: toPublicRoom(room, { adminToken: room.adminToken }),
      adminToken: room.adminToken,
      storage: getStorageMode(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo crear la sala.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
