import type { DefaultSession } from "@auth/core/types";

declare module "@auth/core/types" {
    interface User {
        id: string;
        isAdmin?: boolean;
    }

    interface Session {
        user?: {
            id: string;
            isAdmin?: boolean;
        } & DefaultSession["user"];
    }
}