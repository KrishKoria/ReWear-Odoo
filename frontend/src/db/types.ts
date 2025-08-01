// Ensure Item type is available for ItemWithCategory and SwapWithDetails
export type Item = InferSelectModel<typeof items>;
// Shared types for item enums
export type ItemCondition = "excellent" | "good" | "fair" | "poor";
export type ItemSize =
  | "xs"
  | "s"
  | "m"
  | "l"
  | "xl"
  | "xxl"
  | "xxxl"
  | "one-size";
export type ItemStatus = "available" | "reserved" | "swapped" | "removed";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  user,
  session,
  account,
  verification,
  categories,
  items,
  swaps,
  pointTransactions,
  pointRedemptions,
} from "./schema";

// User types
export type User = InferSelectModel<typeof user>;
export type NewUser = InferInsertModel<typeof user>;

export type Session = InferSelectModel<typeof session>;
export type NewSession = InferInsertModel<typeof session>;

export type Account = InferSelectModel<typeof account>;
export type NewAccount = InferInsertModel<typeof account>;

export type Verification = InferSelectModel<typeof verification>;
export type NewVerification = InferInsertModel<typeof verification>;

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export type Swap = InferSelectModel<typeof swaps>;
export type NewSwap = InferInsertModel<typeof swaps>;

export type PointTransaction = InferSelectModel<typeof pointTransactions>;
export type NewPointTransaction = InferInsertModel<typeof pointTransactions>;

export type PointRedemption = InferSelectModel<typeof pointRedemptions>;
export type NewPointRedemption = InferInsertModel<typeof pointRedemptions>;

export type ItemWithCategory = Item & {
  category: Category;
  images: string[];
  user: Pick<User, "id" | "name" | "image">;
};

export type SwapWithDetails = Swap & {
  requester: Pick<User, "id" | "name" | "image">;
  owner: Pick<User, "id" | "name" | "image">;
  offeredItem?: Item;
  requestedItem: Item;
};

export type UserWithStats = User & {
  totalItems: number;
  totalSwaps: number;
  successfulSwaps: number;
};
