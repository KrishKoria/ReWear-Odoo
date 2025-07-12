import { db } from "./index";
import { categories } from "./schema";

export async function seedDatabase() {
  console.log("🌱 Seeding database...");

  try {
    const defaultCategories = [
      { name: "Tops", description: "T-shirts, shirts, blouses, sweaters" },
      { name: "Bottoms", description: "Pants, jeans, shorts, skirts" },
      { name: "Dresses", description: "Casual and formal dresses" },
      { name: "Outerwear", description: "Jackets, coats, blazers" },
      { name: "Shoes", description: "Sneakers, boots, sandals, heels" },
      { name: "Accessories", description: "Bags, jewelry, belts, scarves" },
      { name: "Activewear", description: "Sportswear and workout clothes" },
      { name: "Formal", description: "Business and formal attire" },
    ];

    for (const category of defaultCategories) {
      await db.insert(categories).values(category).onConflictDoNothing();
    }

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

export async function testConnection() {
  try {
    console.log("🔌 Testing database connection...");
    await db.select().from(categories).limit(1);
    console.log("✅ Database connection successful!");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}
