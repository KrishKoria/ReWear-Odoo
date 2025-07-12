import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { swaps, items, pointTransactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const swapId = params.id;
    const body = await request.json();
    const { action } = body; // 'accept', 'decline', or 'cancel'

    // Get the swap
    const swap = await db
      .select()
      .from(swaps)
      .where(eq(swaps.id, swapId))
      .limit(1);

    if (!swap.length) {
      return NextResponse.json({ error: "Swap not found" }, { status: 404 });
    }

    const swapData = swap[0];

    // Check permissions
    if (action === "accept" || action === "decline") {
      // Only the owner can accept or decline
      if (swapData.ownerId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } else if (action === "cancel") {
      // Only the requester can cancel
      if (swapData.requesterId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    let updateData: any = {
      updatedAt: new Date(),
    };

    if (action === "accept") {
      updateData.status = "accepted";
      updateData.completedAt = new Date();

      // Update item statuses
      await db
        .update(items)
        .set({ status: "swapped" })
        .where(eq(items.id, swapData.requestedItemId));

      if (swapData.offeredItemId) {
        await db
          .update(items)
          .set({ status: "swapped" })
          .where(eq(items.id, swapData.offeredItemId));
      }

      // Create point transactions if points were offered
      if (swapData.pointsOffered && swapData.pointsOffered > 0) {
        // Deduct points from requester
        await db.insert(pointTransactions).values({
          id: crypto.randomUUID(),
          userId: swapData.requesterId,
          amount: -swapData.pointsOffered,
          type: "swap",
          description: `Points spent on swap for item`,
          relatedSwapId: swapId,
        });

        // Add points to owner
        await db.insert(pointTransactions).values({
          id: crypto.randomUUID(),
          userId: swapData.ownerId,
          amount: swapData.pointsOffered,
          type: "swap",
          description: `Points earned from swap`,
          relatedSwapId: swapId,
        });
      }
    } else if (action === "decline") {
      updateData.status = "declined";
    } else if (action === "cancel") {
      updateData.status = "cancelled";
    }

    const updatedSwap = await db
      .update(swaps)
      .set(updateData)
      .where(eq(swaps.id, swapId))
      .returning();

    return NextResponse.json(updatedSwap[0]);
  } catch (error) {
    console.error("Error updating swap:", error);
    return NextResponse.json(
      { error: "Failed to update swap" },
      { status: 500 }
    );
  }
}
