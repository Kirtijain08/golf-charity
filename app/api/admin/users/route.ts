import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await req.json();

  await prisma.user.update({
    where: { id: userId },
    data: { paymentStatus: "paid" },
  });

  return NextResponse.json({ success: true });
}