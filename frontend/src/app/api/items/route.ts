import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { items } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, asc, desc, eq, like } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const condition = url.searchParams.get("condition") || "";
    const size = url.searchParams.get("size") || "";
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "12");

    const conditions = [];

    if (search) {
      conditions.push(like(items.title, `%${search}%`));
    }

    if (category) {
      conditions.push(eq(items.categoryId, category));
    }

    if (condition) {
      const validConditions = ["excellent", "good", "fair", "poor"];
      if (validConditions.includes(condition)) {
        conditions.push(
          eq(
            items.condition,
            condition as "excellent" | "good" | "fair" | "poor"
          )
        );
      }
    }

    if (size) {
      const validSizes = ["xs", "s", "m", "l", "xl", "xxl", "xxxl", "one-size"];
      if (validSizes.includes(size as any)) {
        conditions.push(eq(items.size, size as any));
      }
    }

    conditions.push(eq(items.status, "available"));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumns: Record<string, any> = {
      id: items.id,
      title: items.title,
      createdAt: items.createdAt,
      pointValue: items.pointValue,
    };
    const sortColumn = sortColumns[sortBy] || items.createdAt;

    const itemsQuery = db
      .select()
      .from(items)
      .where(whereClause)
      .orderBy(sortOrder === "desc" ? desc(sortColumn) : asc(sortColumn))
      .limit(limit)
      .offset((page - 1) * limit);

    const itemsResult = await itemsQuery;

    const totalQuery = db
      .select({ count: items.id })
      .from(items)
      .where(whereClause);

    const totalResult = await totalQuery;
    const total = totalResult.length;

    return NextResponse.json({
      items: itemsResult,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
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
    const {
      title,
      description,
      condition,
      size,
      brand,
      color,
      pointValue,
      images,
      categoryId,
    } = body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !condition ||
      !size ||
      !pointValue ||
      !categoryId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newItem = await db
      .insert(items)
      .values({
        id: crypto.randomUUID(),
        title,
        description,
        condition,
        size,
        brand,
        color,
        pointValue,
        images: images || [],
        categoryId,
        userId: session.user.id,
        status: "available",
      })
      .returning();

    return NextResponse.json(newItem[0], { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}
