import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, charityId } = await req.json();

  const user = await prisma.user.update({
    where: { id: userId },
    data: { charityId },
  });

  return NextResponse.json(user);
}