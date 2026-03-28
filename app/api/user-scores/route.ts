import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json([], { status: 200 }); // ✅ safe fallback
    }

    const scores = await prisma.score.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }, // ⚠️ make sure field exists
    });

    // ✅ return only values (your UI expects number[])
    const formatted = scores.map((s) => s.value);

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("USER SCORES ERROR:", error);

    return NextResponse.json([], { status: 200 }); // ✅ NEVER break frontend
  }
}