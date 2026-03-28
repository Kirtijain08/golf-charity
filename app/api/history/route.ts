import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const draws = await prisma.draw.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(draws);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}