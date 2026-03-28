import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    await prisma.user.update({
      where: { id: "cmn9473vp00012jdxphdu5qu8" },
      data: {
        subscriptionStatus: "active",
        subscriptionPlan: "monthly",
      },
    });

    return NextResponse.json({ message: "User subscribed ✅" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" });
  }
}