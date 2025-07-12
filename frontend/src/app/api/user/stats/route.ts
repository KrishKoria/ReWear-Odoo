import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { items, swaps, pointTransactions } from "@/db/schema";
import { eq, count, sum, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's items count
    const itemsCount = await db
      .select({ count: count() })
      .from(items)
      .where(eq(items.userId, session.user.id));

    // Get user's swaps count
    const swapsCount = await db
      .select({ count: count() })
      .from(swaps)
      .where(eq(swaps.requesterId, session.user.id));

    // Get user's point balance
    const pointBalance = await db
      .select({ total: sum(pointTransactions.amount) })
      .from(pointTransactions)
      .where(eq(pointTransactions.userId, session.user.id));

    // Get user's items by status
    const availableItems = await db
      .select({ count: count() })
      .from(items)
      .where(
        and(eq(items.userId, session.user.id), eq(items.status, "available"))
      );

    const swappedItems = await db
      .select({ count: count() })
      .from(items)
      .where(
        and(eq(items.userId, session.user.id), eq(items.status, "swapped"))
      );

    const stats = {
      totalItems: itemsCount[0]?.count || 0,
      availableItems: availableItems[0]?.count || 0,
      swappedItems: swappedItems[0]?.count || 0,
      totalSwaps: swapsCount[0]?.count || 0,
      pointBalance: pointBalance[0]?.total || 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}
