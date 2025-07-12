export * from "./auth-schema";
export * from "./items";
export * from "./swaps";

import { user, session, account, verification } from "./auth-schema";
import { categories, items, itemImages } from "./items";
import { swaps, pointTransactions, pointRedemptions } from "./swaps";

export const schema = {
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
};

export type Schema = typeof schema;
