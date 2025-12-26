import type { Adapter } from "@auth/core/adapters";
import { db } from "../../database/drizzle/db";
import { usersTable, adminsTable } from "../../database/drizzle/schema";
import { eq } from "drizzle-orm";

export function AuthDrizzleAdapter(): Adapter {
    return {
        async getUser(id) {
            const userId = parseInt(id);
            if (isNaN(userId)) return null;

            const user = await db.query.usersTable.findFirst({
                where: eq(usersTable.id, userId),
            });

            if (!user) return null;

            const admin = await db.query.adminsTable.findFirst({
                where: eq(adminsTable.userId, user.id),
            });

            return {
                id: String(user.id),
                email: user.email,
                name: user.username,
                emailVerified: null,
                isAdmin: !!admin,
            };
        },

        async getUserByEmail(email) {
            const user = await db.query.usersTable.findFirst({
                where: eq(usersTable.email, email),
            });

            if (!user) return null;

            const admin = await db.query.adminsTable.findFirst({
                where: eq(adminsTable.userId, user.id),
            });

            return {
                id: String(user.id),
                email: user.email,
                name: user.username,
                emailVerified: null,
                isAdmin: !!admin,
            };
        },

        async createUser() { return null as any; },
        async updateUser() { return null as any; },
        async deleteUser() {},
        async getUserByAccount() { return null; },
        async createSession() { return null as any; },
        async getSessionAndUser() { return null; },
        async updateSession() { return null; },
        async deleteSession() {},
        async linkAccount() { return null as any; },
        async unlinkAccount() {},
        async createVerificationToken() { return null as any; },
        async useVerificationToken() { return null; },
    };
}