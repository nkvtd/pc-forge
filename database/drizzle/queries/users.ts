import type { Database } from "../db";
import {adminsTable, usersTable } from "../schema";
import { eq } from "drizzle-orm";

export async function createUser(db: Database, username: string, email: string, passwordHash: string) {
    await db
        .insert(usersTable)
        .values({
            username: username,
            email: email,
            passwordHash: passwordHash,
        });
}

export async function getUserProfile(db: Database, userId: number) {
    const user = await db
        .select({
            username: usersTable.username,
            email: usersTable.email,
        })
        .from(usersTable)
        .where(
            eq(usersTable.id, userId)
        )
        .limit(1);

    return user[0] ?? null;
}

export async function isAdmin(db: Database, userId: number) {
    const admin = await db
        .selectDistinct()
        .from(adminsTable)
        .where(
            eq(adminsTable.userId, userId)
        )
        .limit(1);

    return admin.length > 0;
}