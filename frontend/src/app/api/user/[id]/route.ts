import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema/auth-schema";
import { eq } from "drizzle-orm";
type Params = Promise<{ id: string }>;
export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const userId = id;
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  try {
    const foundUser = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);
    if (!foundUser || foundUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Only return safe fields
    const { id, name, email, createdAt } = foundUser[0];
    return NextResponse.json({ id, name, email, createdAt });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
