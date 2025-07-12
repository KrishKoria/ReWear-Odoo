import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
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
  id: text("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const items = pgTable("items", {
  id: text("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  condition: itemConditionEnum("condition").notNull(),
  size: itemSizeEnum("size").notNull(),
  brand: varchar("brand", { length: 100 }),
  color: varchar("color", { length: 50 }),
  pointValue: integer("point_value").notNull(),
  status: itemStatusEnum("status").notNull().default("available"),
  images: text("images").array(), // Array of image URLs/paths
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
