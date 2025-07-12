import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { items, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Get all items with user information
    const allItems = await db
      .select({
        id: items.id,
        title: items.title,
        description: items.description,
        pointValue: items.pointValue,
        status: items.status,
        images: items.images,
        createdAt: items.createdAt,
        userId: items.userId,
        userName: user.name,
      })
      .from(items)
      .leftJoin(user, eq(items.userId, user.id));

    return NextResponse.json({
      listings: allItems.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        userId: item.userId,
        userName: item.userName,
        pointValue: item.pointValue,
        status: item.status,
        createdAt: item.createdAt,
        images: item.images,
      })),
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}
