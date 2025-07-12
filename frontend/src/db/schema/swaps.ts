import {
  pgTable,
  uuid,
  timestamp,
  integer,
  text,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
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
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  requesterId: uuid("requesterId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  ownerId: uuid("ownerId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  offeredItemId: uuid("offeredItemId").references(() => items.id, {
    onDelete: "set null",
  }),
  requestedItemId: uuid("requestedItemId")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  status: swapStatusEnum("status").notNull().default("pending"),
  message: text("message"), // Optional message from requester
  pointsOffered: integer("pointsOffered").default(0), // Points offered in addition to item
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  completedAt: timestamp("completedAt"),
});

export const pointTransactions = pgTable("point_transactions", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(), // Positive for earning, negative for spending
  type: transactionTypeEnum("type").notNull(),
  description: text("description").notNull(),
  relatedItemId: uuid("relatedItemId").references(() => items.id, {
    onDelete: "set null",
  }),
  relatedSwapId: uuid("relatedSwapId").references(() => swaps.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const pointRedemptions = pgTable("point_redemptions", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  itemId: uuid("itemId")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  pointsSpent: integer("pointsSpent").notNull(),
  status: swapStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  completedAt: timestamp("completedAt"),
});
