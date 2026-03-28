import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, plan } = await req.json();

    let endDate = new Date();

    if (plan === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: "active",
        subscriptionPlan: plan,
        subscriptionEnd: endDate,
      },
    });

    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}