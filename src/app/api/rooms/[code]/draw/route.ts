import { NextResponse } from "next/server";
import { applyDraw, toPublicRoom } from "@/lib/room-logic";
import { getRoom, saveRoom } from "@/lib/store";

type Params = { params: Promise<{ code: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { code } = await params;
    const room = await getRoom(code);

    if (!room) {
      return NextResponse.json({ error: "Sala no encontrada." }, { status: 404 });
    }

    const body = (await request.json()) as { adminToken?: string };
    if (!body.adminToken || body.adminToken !== room.adminToken) {
      return NextResponse.json(
        { error: "No autorizado. Solo el administrador puede sortear." },
        { status: 403 },
      );
    }

    const updated = applyDraw(room);
    await saveRoom(updated);

    const adminParticipant = updated.participants.find((p) => p.isAdmin);

    return NextResponse.json({
      room: toPublicRoom(updated, {
        adminToken: body.adminToken,
        viewerParticipantId: adminParticipant?.id,
      }),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo realizar el sorteo.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
