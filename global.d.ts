import { Session } from "@auth/core/types";
import type { dbSqlite } from "./database/drizzle/db";

declare module "telefunc" {
  namespace Telefunc {
    interface Context {
      db: ReturnType<typeof dbSqlite>;
    }
  }
}

declare global {
  namespace Vike {
    interface PageContextServer {
      db: ReturnType<typeof dbSqlite>;
    }
  }
}

declare global {
  namespace Vike {
    interface PageContext {
      session?: Session | null;
    }
  }
}

// biome-ignore lint/complexity/noUselessEmptyExport: ensure that the file is considered as a module
export {};
