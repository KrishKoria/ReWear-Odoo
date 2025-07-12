import { pgTable, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { items } from "./items";

export const swapStatusEnum = pgEnum("swap_status", [
  "pending",
  "accepted",
  "declined",
  "completed",
  "cancelled",
]);
export const transactionTypeEnum = pgEnum("transaction_type", [
  "earn",
  "spend",
  "swap",
  "bonus",
]);

export const swaps = pgTable("swaps", {
  id: text("id").primaryKey(),
  requesterId: text("requester_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  offeredItemId: text("offered_item_id").references(() => items.id, {
    onDelete: "set null",
  }),
  requestedItemId: text("requested_item_id")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  status: swapStatusEnum("status").notNull().default("pending"),
  message: text("message"), // Optional message from requester
  pointsOffered: integer("points_offered").default(0), // Points offered in addition to item
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const pointTransactions = pgTable("point_transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(), // Positive for earning, negative for spending
  type: transactionTypeEnum("type").notNull(),
  description: text("description").notNull(),
  relatedItemId: text("related_item_id").references(() => items.id, {
    onDelete: "set null",
  }),
  relatedSwapId: text("related_swap_id").references(() => swaps.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pointRedemptions = pgTable("point_redemptions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  itemId: text("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  pointsSpent: integer("points_spent").notNull(),
  status: swapStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});
