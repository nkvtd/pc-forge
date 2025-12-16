import { db } from "../database/drizzle/db";
import type { Database } from "../database/drizzle/db";
import { enhance, type UniversalMiddleware } from "@universal-middleware/core";

declare global {
  namespace Universal {
    interface Context {
      db: Database;
    }
  }
}

// Add `db` to the Context
export const dbMiddleware: UniversalMiddleware = enhance(
  async (_request, context) => ({
    ...context,
          db,
  }),
  {
    name: "pc-forge:db-middleware",
    immutable: false,
  },
);
