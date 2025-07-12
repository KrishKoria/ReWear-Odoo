import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { swaps, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Get all swaps with user information
    const allSwaps = await db
      .select({
        id: swaps.id,
        status: swaps.status,
        pointsOffered: swaps.pointsOffered,
        createdAt: swaps.createdAt,
        requesterId: swaps.requesterId,
        ownerId: swaps.ownerId,
        requesterName: user.name,
        requesterEmail: user.email,
      })
      .from(swaps)
      .leftJoin(user, eq(swaps.requesterId, user.id));

    return NextResponse.json({
      orders: allSwaps.map((swap) => ({
        id: swap.id,
        userId: swap.requesterId,
        userName: swap.requesterName,
        userEmail: swap.requesterEmail,
        status: swap.status,
        totalPoints: swap.pointsOffered || 0,
        createdAt: swap.createdAt,
        items: [], // You can expand this to include actual items
      })),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
