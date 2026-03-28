import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password, name, type } = await req.json();

  try {
    // 👉 SIGNUP
    if (type === "signup") {
      const user = await prisma.user.create({
        data: {
          email,
          password,
          name,
        },
      });

      return NextResponse.json(user);
    }

    // 👉 LOGIN
    if (type === "login") {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || user.password !== password) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      return NextResponse.json(user);
    }

  } catch (err) {
    return NextResponse.json(
      { error: "Auth failed" },
      { status: 500 }
    );
  }
}