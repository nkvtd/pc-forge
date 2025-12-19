import { Session } from "@auth/core/types";
import type { Database } from "./database/drizzle/db";

declare module "telefunc" {
  namespace Telefunc {
    interface Context {
      db: Database;
      session: Session | null;
      request: Request;
    }
  }
}

declare global {
  namespace Vike {
    interface PageContextServer {
      db: Database;
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
