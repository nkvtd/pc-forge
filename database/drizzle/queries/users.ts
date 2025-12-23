import type { Database } from "../db";
import {adminsTable, suggestionsTable, usersTable} from "../schema";
import {desc, eq} from "drizzle-orm";

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
    const [user] = await db
        .select({
            username: usersTable.username,
            email: usersTable.email,
        })
        .from(usersTable)
        .where(
            eq(usersTable.id, userId)
        )
        .limit(1);

    return user ?? null;
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

export async function getComponentSuggestions(db: Database) {
    const suggestionsList = await db
        .select()
        .from(suggestionsTable)
        .where(
            eq(suggestionsTable.status, 'pending')
        )
        .orderBy(
            desc(suggestionsTable.id)
        )

    return suggestionsList;
}

export async function setComponentSuggestionStatus(db: Database, suggestionId: number, adminId: number, status: string, adminComment: string) {
    const result = await db
        .update(suggestionsTable)
        .set({
            adminId: adminId,
            status: status,
            adminComment: adminComment
        })
        .where(
            eq(suggestionsTable.id, suggestionId)
        );

    return result.rowCount;
}

export async function addNewComponentSuggestion(db: Database, userId: number, link: string, description: string, componentType: string) {
    const [newSuggestion] = await db
        .insert(suggestionsTable)
        .values({
            userId: userId,
            link: link,
            description: description,
            componentType: componentType
        })
        .returning({ id: suggestionsTable.id });

    return newSuggestion.id ?? null;
}