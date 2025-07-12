export * from "./auth-schema";
export * from "./items";
export * from "./swaps";

import { user, session, account, verification } from "./auth-schema";
import { categories, items } from "./items";
import { swaps, pointTransactions, pointRedemptions } from "./swaps";

export const schema = {
  user,
  session,
  account,
  verification,

  categories,
  items,

  swaps,
  pointTransactions,
  pointRedemptions,
};

export type Schema = typeof schema;
