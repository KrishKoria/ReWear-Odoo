import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { isActive } = await request.json();

    // Update user status by setting emailVerified
    await db
      .update(user)
      .set({ emailVerified: isActive })
      .where(eq(user.id, id));

    return NextResponse.json({ message: "User status updated successfully" });
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json(
      { error: "Failed to update user status" },
      { status: 500 }
    );
  }
}
