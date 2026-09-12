import { NextResponse } from "next/server";
import { confirmParticipant, toPublicRoom } from "@/lib/room-logic";
import { getRoom, saveRoom } from "@/lib/store";

type Params = { params: Promise<{ code: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { code } = await params;
    const room = await getRoom(code);

    if (!room) {
      return NextResponse.json({ error: "Sala no encontrada." }, { status: 404 });
    }

    const body = (await request.json()) as { participantId?: string };
    if (!body.participantId) {
      return NextResponse.json(
        { error: "Falta participantId." },
        { status: 400 },
      );
    }

    const updated = confirmParticipant(room, body.participantId);
    await saveRoom(updated);

    return NextResponse.json({
      room: toPublicRoom(updated, {
        viewerParticipantId: body.participantId,
      }),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo confirmar.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
