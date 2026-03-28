export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    // ✅ Safe JSON parsing (prevents build crash)
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (!body?.userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // ✅ Update payment status
    await prisma.user.update({
      where: { id: body.userId },
      data: { paymentStatus: "paid" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN PAY ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}