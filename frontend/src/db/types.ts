import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  user,
  session,
  account,
  verification,
  categories,
  items,
  itemImages,
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

export type Item = InferSelectModel<typeof items>;
export type NewItem = InferInsertModel<typeof items>;

export type ItemImage = InferSelectModel<typeof itemImages>;
export type NewItemImage = InferInsertModel<typeof itemImages>;

export type Swap = InferSelectModel<typeof swaps>;
export type NewSwap = InferInsertModel<typeof swaps>;

export type PointTransaction = InferSelectModel<typeof pointTransactions>;
export type NewPointTransaction = InferInsertModel<typeof pointTransactions>;

export type PointRedemption = InferSelectModel<typeof pointRedemptions>;
export type NewPointRedemption = InferInsertModel<typeof pointRedemptions>;

export type ItemWithCategory = Item & {
  category: Category;
  images: ItemImage[];
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
