import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// 🎯 Generate 5 unique random numbers (1–45)
function generateDrawNumbers() {
  const numbers = new Set<number>();

  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }

  return Array.from(numbers);
}

export async function GET() {
  try {
    // ✅ 1. Generate draw numbers
    const drawNumbers = generateDrawNumbers();

    // ✅ 2. Get users with scores
    const users = await prisma.user.findMany({
      include: { scores: true },
    });

    // ✅ 3. Get or create jackpot FIRST
    let jackpot = await prisma.jackpot.findFirst();

    if (!jackpot) {
      jackpot = await prisma.jackpot.create({
        data: { amount: 0 },
      });
    }

    // 💰 4. Prize pool calculation (DEFINE BEFORE USE)
    const totalUsers = users.length;
    const subscriptionAmount = 100;
    const totalPool = totalUsers * subscriptionAmount;

    const jackpotPool = totalPool * 0.4 + jackpot.amount;

    const prize = {
      tier5: jackpotPool,
      tier4: totalPool * 0.35,
      tier3: totalPool * 0.25,
    };

    // 🎯 Winner buckets
    let tier3: string[] = [];
    let tier4: string[] = [];
    let tier5: string[] = [];

    // ✅ 5. Match logic
    for (const user of users) {
      const userScores = user.scores.map((s) => s.value);

      let matchCount = 0;

      for (const num of drawNumbers) {
        if (userScores.includes(num)) {
          matchCount++;
        }
      }

      if (matchCount === 5) tier5.push(user.id);
      else if (matchCount === 4) tier4.push(user.id);
      else if (matchCount === 3) tier3.push(user.id);
    }

    // ✅ 6. Calculate prize per winner
    const tier5PrizeEach = tier5.length ? prize.tier5 / tier5.length : 0;
    const tier4PrizeEach = tier4.length ? prize.tier4 / tier4.length : 0;
    const tier3PrizeEach = tier3.length ? prize.tier3 / tier3.length : 0;

    // ✅ 7. Update winners in DB
    for (const userId of tier5) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          isWinner: true,
          winningAmount: tier5PrizeEach,
        },
      });
    }

    for (const userId of tier4) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          isWinner: true,
          winningAmount: tier4PrizeEach,
        },
      });
    }

    for (const userId of tier3) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          isWinner: true,
          winningAmount: tier3PrizeEach,
        },
      });
    }

    // 🔄 8. Jackpot logic
    if (tier5.length === 0) {
      await prisma.jackpot.update({
        where: { id: jackpot.id },
        data: { amount: jackpotPool },
      });
    } else {
      await prisma.jackpot.update({
        where: { id: jackpot.id },
        data: { amount: 0 },
      });
    }

    // 💾 9. Save draw (SQLite fix)
    await prisma.draw.create({
      data: {
        numbers: JSON.stringify(drawNumbers),
        totalPool,
      },
    });

    // ✅ 10. Response
    return NextResponse.json({
      drawNumbers,
      totalPool,
      winners: {
        tier5: {
          winners: tier5,
          prizeEach: tier5PrizeEach,
        },
        tier4: {
          winners: tier4,
          prizeEach: tier4PrizeEach,
        },
        tier3: {
          winners: tier3,
          prizeEach: tier3PrizeEach,
        },
      },
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Draw failed" },
      { status: 500 }
    );
  }
}