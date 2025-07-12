import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./auth-schema";

export const itemConditionEnum = pgEnum("item_condition", [
  "excellent",
  "good",
  "fair",
  "poor",
]);
export const itemStatusEnum = pgEnum("item_status", [
  "available",
  "reserved",
  "swapped",
  "removed",
]);
export const itemSizeEnum = pgEnum("item_size", [
  "xs",
  "s",
  "m",
  "l",
  "xl",
  "xxl",
  "xxxl",
  "one-size",
]);

export const categories = pgTable("categories", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const items = pgTable("items", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  condition: itemConditionEnum("condition").notNull(),
  size: itemSizeEnum("size").notNull(),
  brand: varchar("brand", { length: 100 }),
  color: varchar("color", { length: 50 }),
  pointValue: integer("pointValue").notNull(),
  status: itemStatusEnum("status").notNull().default("available"),
  images: text("images").array(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  categoryId: uuid("categoryId")
    .notNull()
    .references(() => categories.id),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const itemImages = pgTable("item_images", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  itemId: uuid("itemId")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  imageUrl: text("imageUrl").notNull(),
  altText: varchar("altText", { length: 255 }),
  isPrimary: integer("isPrimary").notNull().default(0), // 1 for primary image, 0 for others
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
