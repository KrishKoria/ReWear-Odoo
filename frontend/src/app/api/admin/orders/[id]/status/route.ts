import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { swaps } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await request.json();

    // Update order status
    await db
      .update(swaps)
      .set({
        status: status,
        updatedAt: new Date(),
        ...(status === "completed" && { completedAt: new Date() }),
      })
      .where(eq(swaps.id, id));

    return NextResponse.json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
