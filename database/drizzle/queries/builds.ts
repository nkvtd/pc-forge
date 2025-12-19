import type { Database } from "../db";
import {buildComponentsTable, buildsTable, favoriteBuildsTable, ratingBuildsTable, reviewsTable} from "../schema";
import {eq, desc, and, sql, ilike} from "drizzle-orm";

export async function getPendingBuilds(db: Database) {
    const pendingBuildsList = await db
        .select({
            id: buildsTable.id,
            user_id: buildsTable.userId,
            name: buildsTable.name,
            created_at: buildsTable.createdAt,
            total_price: buildsTable.totalPrice
        })
        .from(buildsTable)
        .where(
            eq(buildsTable.isApproved, false)
        );

    return pendingBuildsList;
}

export async function getUserBuilds(db: Database, userId: number) {
    const userBuildsList = await db
        .select({
            id: buildsTable.id,
            user_id: buildsTable.userId,
            name: buildsTable.name,
            created_at: buildsTable.createdAt,
            total_price: buildsTable.totalPrice
        })
        .from(buildsTable)
        .where(
            eq(buildsTable.userId, userId)
        );

    return userBuildsList;
}

export async function setBuildApprovalStatus(db: Database, buildId: number, isApproved: boolean){
    const result = await db
        .update(buildsTable)
        .set({
            isApproved: isApproved
        })
        .where(
            eq(buildsTable.id, buildId)
        );

    return result.rowCount;
}

export async function getFavoriteBuilds(db: Database, userId: number) {
    const favoriteBuildsList = await db
        .select({
            id: buildsTable.id,
            user_id: buildsTable.userId,
            name: buildsTable.name,
            created_at: buildsTable.createdAt,
            total_price: buildsTable.totalPrice
        })
        .from(buildsTable)
        .innerJoin(
            favoriteBuildsTable,
            eq(buildsTable.id, favoriteBuildsTable.buildId)
        )
        .where(
            eq(favoriteBuildsTable.userId, userId)
        );

    return favoriteBuildsList;
}

export async function getApprovedBuilds(db: Database, limit?: number, q?: string) {
    let queryConditions = [];

    if (q) {
        queryConditions.push(
            ilike(buildsTable.name, `%${q}%`)
        );
    }

    const approvedBuildsList = await db
        .select({
            id: buildsTable.id,
            user_id: buildsTable.userId,
            name: buildsTable.name,
            created_at: buildsTable.createdAt,
            total_price: buildsTable.totalPrice
        })
        .from(buildsTable)
        .where(
            and (
                eq(buildsTable.isApproved, true),
                ...queryConditions
            )
        )
        .orderBy(
            desc(buildsTable.totalPrice)
        )
        .limit(limit || 100); // 100 placeholder

    return approvedBuildsList;
}

export async function getHighestRankedBuilds(db: Database, limit? : number) {
    const highestRankedBuildsList = await db
        .select({
            id: buildsTable.id,
            user_id: buildsTable.userId,
            name: buildsTable.name,
            created_at: buildsTable.createdAt,
            total_price: buildsTable.totalPrice
        })
        .from(buildsTable)
        .innerJoin(
            ratingBuildsTable,
            eq(buildsTable.id, ratingBuildsTable.buildId)
        )
        .where(
            eq(buildsTable.isApproved, true)
        )
        .groupBy(
            buildsTable.id
        )
        .orderBy(
            desc(sql<number>`AVG(${ratingBuildsTable.value}::float)`)
        )
        .limit(limit || 100); // 100 placeholder

    return highestRankedBuildsList;
}

export async function getBuildDetails(db: Database, buildId: number) {
    const buildDetails = await db
        .select()
        .from(buildsTable)
        .where(
            eq(buildsTable.id, buildId)
        )
        .limit(1);

    return buildDetails[0] ?? null;
}

export async function toggleFavoriteBuild(db: Database, userId: number, buildId: number) {
    const existing = await db
        .select()
        .from(favoriteBuildsTable)
        .where(
            and(
                eq(favoriteBuildsTable.userId, userId),
                eq(favoriteBuildsTable.buildId, buildId)
            )
        )
        .limit(1);

    if (existing.length) {
        await db
            .delete(favoriteBuildsTable)
            .where(
                and(
                    eq(favoriteBuildsTable.userId, userId),
                    eq(favoriteBuildsTable.buildId, buildId)
                )
            );

        return { favorite: false };
    }

    await db
        .insert(favoriteBuildsTable)
        .values({
            userId,
            buildId,
        });

    return { favorite: true };
}

export async function setBuildRating(db: Database, userId: number, buildId: number, value: number) {
    const result = await db
        .insert(ratingBuildsTable)
        .values({
            userId,
            buildId,
            value: value.toString()
        })
        .onConflictDoUpdate({
            target: [ratingBuildsTable.userId, ratingBuildsTable.buildId],
            set: {
                value: value.toString(),
            },
        });
}

export async function setBuildReview(db: Database, userId: number,  buildId: number, content: string) {
    const existing = await db
        .select()
        .from(reviewsTable)
        .where(
            and(
                eq(reviewsTable.userId, userId),
                eq(reviewsTable.buildId, buildId)
            )
        )
        .limit(1);

    if (existing.length) {
        const result = await db
            .update(reviewsTable)
            .set({
                content: content,
            })
            .where(
                and(
                    eq(reviewsTable.userId, userId),
                    eq(reviewsTable.buildId, buildId)
                )
            );

        return;
    }

    const result = await db
        .insert(reviewsTable)
        .values({
            userId,
            buildId,
            content,
            createdAt: new Date().toISOString().split('T')[0]
        });
}

export async function cloneBuild(db: Database, userId: number, buildId: number) {
    const [buildToClone] = await db
        .select()
        .from(buildsTable)
        .where(
            eq(buildsTable.id, buildId)
        )
        .limit(1);

    if (!buildToClone) return null;

    const [newBuild] = await db
        .insert(buildsTable)
        .values({
            userId: userId,
            name: `${buildToClone.name} (copy)`,
            createdAt: new Date().toISOString().split('T')[0],
            description: buildToClone.description,
            totalPrice: buildToClone.totalPrice,
            isApproved: false
        })
        .returning({ id: buildsTable.id });

    const components = await db
        .select()
        .from(buildComponentsTable)
        .where(
            eq(buildComponentsTable.buildId, buildId)
        );

    if(components.length) {
        await db
            .insert(buildComponentsTable)
            .values(
                components.map(component => ({
                    buildId: newBuild.id,
                    componentId: component.componentId
                }))
            );
    }

    return newBuild.id;
}



