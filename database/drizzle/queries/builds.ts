import type { Database } from "../db";
import {
    buildComponentsTable,
    buildsTable,
    componentsTable,
    favoriteBuildsTable,
    ratingBuildsTable,
    reviewsTable, usersTable
} from "../schema";
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
    let queryConditions = [eq(buildsTable.isApproved, true)];

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
            total_price: buildsTable.totalPrice,
            avgRating: sql<number>`AVG(${ratingBuildsTable.value}::float)`
        })
        .from(buildsTable)
        .innerJoin(
            ratingBuildsTable,
            eq(buildsTable.id, ratingBuildsTable.buildId)
        )
        .where(
            eq(buildsTable.isApproved, true)
        )
        .groupBy(buildsTable.id)
        .orderBy(
            desc(sql<number>`AVG(${ratingBuildsTable.value}::float)`)
        )
        .limit(limit || 100); // 100 placeholder

    return highestRankedBuildsList;
}

export async function getBuildDetails(db: Database, buildId: number, userId?: number) {
    return db.transaction(async (tx) => {
        const [buildDetails] = await tx
            .select({
                id: buildsTable.id,
                userId: buildsTable.userId,
                name: buildsTable.name,
                createdAt: buildsTable.createdAt,
                description: buildsTable.description,
                totalPrice: buildsTable.totalPrice,
                isApproved: buildsTable.isApproved,
                creator: usersTable.username
            })
            .from(buildsTable)
            .innerJoin(
                usersTable,
                eq(buildsTable.userId, usersTable.id)
            )
            .where(
                eq(buildsTable.id, buildId)
            )
            .limit(1);

        if (!buildDetails) return null;

        const components = await tx
            .select({
                componentId: buildComponentsTable.componentId,
                component: componentsTable
            })
            .from(buildComponentsTable)
            .innerJoin(
                componentsTable,
                eq(buildComponentsTable.componentId, componentsTable.id)
            )
            .where(
                eq(buildComponentsTable.buildId, buildId)
            );

        const reviews = await tx
            .select({
                username: usersTable.username,
                content: reviewsTable.content,
                createdAt: reviewsTable.createdAt
            })
            .from(reviewsTable)
            .innerJoin(
                usersTable,
                eq(reviewsTable.userId, usersTable.id)
            )
            .where(
                eq(reviewsTable.buildId, buildId)
            )
            .orderBy(
                desc(reviewsTable.createdAt)
            );

        let [ratingStatistics] = await tx
            .select({
                averageRating: sql<number>`COALESCE(AVG(${ratingBuildsTable.value}::float), 0)`.as("averageRating"),
                ratingCount: sql<number>`COUNT(${ratingBuildsTable.value})`.as("ratingCount")
            })
            .from(ratingBuildsTable)
            .where(
                eq(ratingBuildsTable.buildId, buildId)
            )
            .groupBy(ratingBuildsTable.buildId);

        ratingStatistics = {
            averageRating: Number(ratingStatistics?.averageRating ?? 0),
            ratingCount: Number(ratingStatistics?.ratingCount ?? 0),
        }

        let userRating = null;
        let isFavorite = false;
        let userReview = null;

        if(userId) {
            const [rating] = await tx
                .select()
                .from(ratingBuildsTable)
                .where(
                    and(
                        eq(ratingBuildsTable.buildId, buildId),
                        eq(ratingBuildsTable.userId, userId)
                    )
                )
                .limit(1);

            userRating = rating?.value ? Number(rating.value) : null;

            const [favorite] = await tx
                .select()
                .from(favoriteBuildsTable)
                .where(
                    and(
                        eq(favoriteBuildsTable.buildId, buildId),
                        eq(favoriteBuildsTable.userId, userId)
                    )
                )
                .limit(1);

            isFavorite = !!favorite;

            const [review] = await tx
                .select()
                .from(reviewsTable)
                .where(
                    and(
                        eq(reviewsTable.buildId, buildId),
                        eq(reviewsTable.userId, userId)
                    )
                )
                .limit(1);

            userReview = review?.content;
        }

        return {
            ...buildDetails,
            components: components.map(c => c.component),
            reviews: reviews,
            ratingStatistics: ratingStatistics,
            userRating,
            userReview,
            isFavorite
        };
    });
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
            value: value
        })
        .onConflictDoUpdate({
            target: [ratingBuildsTable.userId, ratingBuildsTable.buildId],
            set: {
                value: value,
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
