import { NextResponse } from "next/server";
import { toPublicRoom } from "@/lib/room-logic";
import { getRoom } from "@/lib/store";

type Params = { params: Promise<{ code: string }> };

export async function GET(request: Request, { params }: Params) {
  const { code } = await params;
  const room = await getRoom(code);

  if (!room) {
    return NextResponse.json({ error: "Sala no encontrada." }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const adminToken = searchParams.get("adminToken");
  const viewerParticipantId = searchParams.get("participantId");

  return NextResponse.json({
    room: toPublicRoom(room, { adminToken, viewerParticipantId }),
  });
}
