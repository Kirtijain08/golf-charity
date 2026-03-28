import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { value, userId } = await req.json();

    // ✅ Check subscription
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { scores: true },
    });

    if (!user || user.subscriptionStatus !== "active") {
      return NextResponse.json(
        { error: "Subscription required" },
        { status: 403 }
      );
    }

    // 🎯 If already 5 scores → delete oldest
    if (user.scores.length >= 5) {
      const oldest = user.scores.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )[0];

      await prisma.score.delete({
        where: { id: oldest.id },
      });
    }

    // ➕ Add new score
    await prisma.score.create({
      data: {
        value,
        userId,
      },
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}