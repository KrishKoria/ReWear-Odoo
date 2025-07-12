import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { swaps } from "@/db/schema/swaps";
import { items } from "@/db/schema/items";
import { desc, eq, or } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const limit = parseInt(url.searchParams.get("limit") || "5");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const recentSwaps = await db
      .select()
      .from(swaps)
      .where(or(eq(swaps.requesterId, userId), eq(swaps.ownerId, userId)))
      .orderBy(desc(swaps.createdAt))
      .limit(limit);

    // Map swaps to activity format
    const activity = recentSwaps.map((swap) => ({
      type: "Swap",
      description: swap.offeredItemId
        ? `Swapped your item (${swap.offeredItemId}) for (${swap.requestedItemId})`
        : `Requested item (${swap.requestedItemId}) from another user`,
      points: swap.pointsOffered || 0,
      createdAt: swap.createdAt,
    }));

    // Optionally, add recent uploads as activity
    const recentUploads = await db
      .select()
      .from(items)
      .where(eq(items.userId, userId))
      .orderBy(desc(items.createdAt))
      .limit(limit);

    activity.push(
      ...recentUploads.map((item) => ({
        type: "Upload",
        description: `Uploaded item: ${item.title}`,
        points: item.pointValue || 0,
        createdAt: item.createdAt,
      }))
    );

    // Sort all activity by createdAt descending and limit
    const sortedActivity = activity
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);

    return NextResponse.json({ activity: sortedActivity });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
