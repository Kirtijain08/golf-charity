import prisma from "../../lib/prisma";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const { userId, proof } = await req.json();

  const user = await prisma.user.update({
    where: { id: userId },
    data: { proof },
  });

  return NextResponse.json(user);
}