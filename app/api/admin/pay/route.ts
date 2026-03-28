export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || !body.userId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { userId } = body;

    await prisma.user.update({
      where: { id: userId },
      data: {
        paymentStatus: "paid",
      },
    });

    return NextResponse.json({ message: "Payment marked as paid" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}