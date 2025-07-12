import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pointTransactions, items, swaps } from "@/db/schema";
import { eq, desc, sum } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const type = url.searchParams.get("type"); // 'balance' or 'transactions'

    if (type === "balance") {
      // Get user's point balance
      const balanceResult = await db
        .select({ total: sum(pointTransactions.amount) })
        .from(pointTransactions)
        .where(eq(pointTransactions.userId, session.user.id));

      const balance = balanceResult[0]?.total || 0;

      return NextResponse.json({ balance });
    } else {
      // Get user's transaction history
      const transactions = await db
        .select()
        .from(pointTransactions)
        .where(eq(pointTransactions.userId, session.user.id))
        .orderBy(desc(pointTransactions.createdAt));

      return NextResponse.json(transactions);
    }
  } catch (error) {
    console.error("Error fetching points:", error);
    return NextResponse.json(
      { error: "Failed to fetch points" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, type, description, relatedItemId } = body;

    if (!amount || !type || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transaction = await db
      .insert(pointTransactions)
      .values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        amount,
        type,
        description,
        relatedItemId,
      })
      .returning();

    return NextResponse.json(transaction[0], { status: 201 });
  } catch (error) {
    console.error("Error creating point transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
