import { Abort, getContext } from "telefunc";
import * as drizzleQueries from "../../database/drizzle/queries";

export function ctx() {
    return getContext();
}

export function parseSessionUserId(sessionUserId: unknown): number | null {
    if (typeof sessionUserId !== "string" && typeof sessionUserId !== "number") return null;
    const n = Number(sessionUserId);
    return Number.isInteger(n) && n > 0 ? n : null;
}

export function requireUser() {
    const c = ctx();
    const userId = parseSessionUserId(c.session?.user?.id);
    if (!userId) throw Abort();
    return { c, userId };
}

export function getAuthState() {
    const c = ctx();
    const userId = parseSessionUserId(c.session?.user?.id);
    return {
        isLoggedIn: Boolean(userId),
        userId: userId ?? null,
        username: c.session?.user?.name ?? null,
        session: c.session,
        db: c.db,
    };
}

export async function requireAdmin() {
    const { c, userId } = requireUser();

    const isAdmin = await drizzleQueries.isAdmin(c.db, userId);

    if (!isAdmin) throw Abort();
    return { c, userId };
}