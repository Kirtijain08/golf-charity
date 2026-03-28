import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const user = await prisma.user.findUnique({
    where: { id: userId! },
  });

  return NextResponse.json(user);
}