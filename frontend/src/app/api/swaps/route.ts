import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { swaps, items, pointTransactions } from "@/db/schema";
import { eq, or, and, desc } from "drizzle-orm";
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
    const type = url.searchParams.get("type"); // 'sent' or 'received'

    let whereClause;
    if (type === "sent") {
      whereClause = eq(swaps.requesterId, session.user.id);
    } else if (type === "received") {
      whereClause = eq(swaps.ownerId, session.user.id);
    } else {
      // Get all swaps for the user
      whereClause = or(
        eq(swaps.requesterId, session.user.id),
        eq(swaps.ownerId, session.user.id)
      );
    }

    const userSwaps = await db
      .select()
      .from(swaps)
      .where(whereClause)
      .orderBy(desc(swaps.createdAt));

    return NextResponse.json(userSwaps);
  } catch (error) {
    console.error("Error fetching swaps:", error);
    return NextResponse.json(
      { error: "Failed to fetch swaps" },
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
    const { requestedItemId, offeredItemId, message, pointsOffered } = body;

    if (!requestedItemId) {
      return NextResponse.json(
        { error: "Requested item ID is required" },
        { status: 400 }
      );
    }

    // Get the requested item to find the owner
    const requestedItem = await db
      .select()
      .from(items)
      .where(eq(items.id, requestedItemId))
      .limit(1);

    if (!requestedItem.length) {
      return NextResponse.json(
        { error: "Requested item not found" },
        { status: 404 }
      );
    }

    if (requestedItem[0].status !== "available") {
      return NextResponse.json(
        { error: "Item is not available for swap" },
        { status: 400 }
      );
    }

    // Can't swap with yourself
    if (requestedItem[0].userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot swap with yourself" },
        { status: 400 }
      );
    }

    // Validate offered item if provided
    if (offeredItemId) {
      const offeredItem = await db
        .select()
        .from(items)
        .where(eq(items.id, offeredItemId))
        .limit(1);

      if (!offeredItem.length) {
        return NextResponse.json(
          { error: "Offered item not found" },
          { status: 404 }
        );
      }

      if (offeredItem[0].userId !== session.user.id) {
        return NextResponse.json(
          { error: "You can only offer your own items" },
          { status: 403 }
        );
      }

      if (offeredItem[0].status !== "available") {
        return NextResponse.json(
          { error: "Offered item is not available" },
          { status: 400 }
        );
      }
    }

    const newSwap = await db
      .insert(swaps)
      .values({
        id: crypto.randomUUID(),
        requesterId: session.user.id,
        ownerId: requestedItem[0].userId,
        requestedItemId,
        offeredItemId,
        message,
        pointsOffered: pointsOffered || 0,
        status: "pending",
      })
      .returning();

    return NextResponse.json(newSwap[0], { status: 201 });
  } catch (error) {
    console.error("Error creating swap:", error);
    return NextResponse.json(
      { error: "Failed to create swap" },
      { status: 500 }
    );
  }
}
