import { db } from "../db";
import { categories, items } from "./schema/items";
import { user } from "./schema/auth-schema";
import { swaps } from "./schema/swaps";

async function seedCategories() {
  const sampleCategories = [
    {
      id: "cat-1",
      name: "Men's Clothing",
      description: "Apparel for men",
    },
    {
      id: "cat-2",
      name: "Women's Clothing",
      description: "Apparel for women",
    },
    {
      id: "cat-3",
      name: "Kids",
      description: "Clothing for children",
    },
    {
      id: "cat-4",
      name: "Accessories",
      description: "Bags, hats, jewelry, etc.",
    },
    {
      id: "cat-5",
      name: "Shoes",
      description: "Footwear for all ages",
    },
  ];
  await db.delete(categories); // Clear existing
  await db.insert(categories).values(sampleCategories);
  console.log("Seeded categories.");
}

async function seedUsers() {
  const sampleUsers = [
    {
      id: "user-1",
      name: "Alice Smith",
      email: "alice@example.com",
      emailVerified: false,
      image: null,
      points: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "user-2",
      name: "Bob Johnson",
      email: "bob@example.com",
      emailVerified: true,
      image: null,
      points: 150,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await db.delete(user); // Clear existing
  await db.insert(user).values(sampleUsers);
  console.log("Seeded users.");
}

async function seedItems() {
  const sampleItems = [
    {
      id: "item-1",
      title: "Vintage Denim Jacket",
      description: "Classic blue denim jacket in excellent condition.",
      condition: "excellent" as "excellent", // enum literal
      size: "m" as "m",
      brand: "Levi's",
      color: "Blue",
      pointValue: 120,
      status: "available" as "available",
      images: ["/placeholder.svg?text=Jacket"],
      userId: "user-1",
      categoryId: "cat-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "item-2",
      title: "Red Summer Dress",
      description: "Lightweight red dress, perfect for summer.",
      condition: "good" as "good",
      size: "s" as "s",
      brand: "Zara",
      color: "Red",
      pointValue: 90,
      status: "available" as "available",
      images: ["/placeholder.svg?text=Dress"],
      userId: "user-2",
      categoryId: "cat-2",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "item-3",
      title: "Kids Sneakers",
      description: "Comfortable sneakers for kids, size 32 EU.",
      condition: "fair" as "fair",
      size: "one-size" as "one-size",
      brand: "Nike",
      color: "White",
      pointValue: 60,
      status: "available" as "available",
      images: ["/placeholder.svg?text=Sneakers"],
      userId: "user-1",
      categoryId: "cat-5",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await db.delete(items); // Clear existing
  await db.insert(items).values(sampleItems);
  console.log("Seeded items.");
}

async function seedSwaps() {
  const sampleSwaps = [
    {
      id: "swap-1",
      requesterId: "user-2",
      ownerId: "user-1",
      offeredItemId: "item-2",
      requestedItemId: "item-1",
      status: "pending" as "pending",
      message: "Would you swap for my dress?",
      pointsOffered: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: undefined,
    },
  ];
  await db.delete(swaps); // Clear existing
  await db.insert(swaps).values(sampleSwaps);
  console.log("Seeded swaps.");
}

async function main() {
  await seedCategories();
  await seedUsers();
  await seedItems();
  await seedSwaps();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
