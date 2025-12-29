import type { Database } from "../db";
import {
    buildComponentsTable,
    buildsTable,
    componentsTable,
    favoriteBuildsTable,
    ratingBuildsTable,
    reviewsTable, usersTable
} from "../schema";
import {eq, desc, and, sql, ilike, asc} from "drizzle-orm";
import {inArray} from "drizzle-orm/sql/expressions/conditions";
import {addComponentToBuild} from "./components";

export async function getPendingBuilds(db: Database) {
    const pendingBuilds = await db
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
        )
        .orderBy(
            desc(buildsTable.createdAt)
        );

    return pendingBuilds;
}

export async function getUserBuilds(db: Database, userId: number) {
    const userBuilds = await db
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
        )
        .orderBy(
            desc(buildsTable.createdAt)
        );

    return userBuilds;
}

export async function setBuildApprovalStatus(db: Database, buildId: number, isApproved: boolean){
    const [result] = await db
        .update(buildsTable)
        .set({
            isApproved: isApproved
        })
        .where(
            and(
                eq(buildsTable.id, buildId),
                eq(buildsTable.isApproved, !isApproved)
            )
        )
        .returning({
            id: buildsTable.id
        })

    return result?.id ?? null;
}

export async function getFavoriteBuilds(db: Database, userId: number) {
    const favoriteBuilds = await db
        .select({
            id: buildsTable.id,
            user_id: buildsTable.userId,
            name: buildsTable.name,
            created_at: buildsTable.createdAt,
            total_price: buildsTable.totalPrice,
            avgRating: sql<number>`COALESCE(AVG(${ratingBuildsTable.value}::float),0)`
        })
        .from(buildsTable)
        .innerJoin(
            favoriteBuildsTable,
            eq(buildsTable.id, favoriteBuildsTable.buildId)
        )
        .leftJoin(
            ratingBuildsTable,
            eq(buildsTable.id, ratingBuildsTable.buildId)
        )
        .where(
            eq(favoriteBuildsTable.userId, userId)
        )
        .groupBy(
            buildsTable.id,
            buildsTable.userId,
            buildsTable.name,
            buildsTable.createdAt,
            buildsTable.totalPrice
        )
        .orderBy(
            desc(sql<number>`COALESCE(AVG(${ratingBuildsTable.value}::float),0)`)
        );

    return favoriteBuilds;
}

export async function getApprovedBuilds(db: Database, limit?: number, sort?: string, q?: string) {
    let queryConditions = [eq(buildsTable.isApproved, true)];
    let sortCondition:any;

    if (q) {
        queryConditions.push(
            ilike(buildsTable.name, `%${q}%`)
        );
    }

    switch(sort) {
        case 'price_asc':
            sortCondition = asc(buildsTable.totalPrice)
            break;
        case 'price_desc':
            sortCondition = desc(buildsTable.totalPrice)
            break;
        case 'rating_desc':
            sortCondition = desc(sql<number>`COALESCE(AVG(${ratingBuildsTable.value}::float),0)`)
            break;
        case 'oldest':
            sortCondition = asc(buildsTable.createdAt)
            break;
        case 'newest':
            sortCondition = desc(buildsTable.createdAt)
            break;
        default:
            sortCondition = desc(buildsTable.createdAt)
            break;
        }

    const approvedBuilds = await db
        .select({
            id: buildsTable.id,
            user_id: buildsTable.userId,
            name: buildsTable.name,
            created_at: buildsTable.createdAt,
            total_price: buildsTable.totalPrice,
            avgRating: sql<number>`COALESCE(AVG(${ratingBuildsTable.value}::float),0)`
        })
        .from(buildsTable)
        .leftJoin(
            ratingBuildsTable,
            eq(buildsTable.id, ratingBuildsTable.buildId)
        )
        .groupBy(
            buildsTable.id,
            buildsTable.userId,
            buildsTable.name,
            buildsTable.createdAt,
            buildsTable.totalPrice
        )
        .where(
            and (
                ...queryConditions
            )
        )
        .orderBy(
            sortCondition
        )
        .limit(limit || 100); // 100 placeholder

    return approvedBuilds;
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
            reviews: reviews.map(r => ({
                username: r.username,
                content: r.content,
                createdAt: r.createdAt
            })),
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

    if (existing.length > 0) {
        await db
            .delete(favoriteBuildsTable)
            .where(
                and(
                    eq(favoriteBuildsTable.userId, userId),
                    eq(favoriteBuildsTable.buildId, buildId)
                )
            );

        return null;
    }

    await db
        .insert(favoriteBuildsTable)
        .values({
            userId,
            buildId,
        });

    return true;
}

export async function setBuildRating(db: Database, userId: number, buildId: number, value: number) {
    const [result] = await db
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
        })
        .returning({
            userId: ratingBuildsTable.userId,
            buildId: ratingBuildsTable.buildId,
            value: ratingBuildsTable.value
        })

    return result ?? null;
}

export async function setBuildReview(db: Database, userId: number,  buildId: number, content: string) {
    const [result] = await db
        .insert(reviewsTable)
        .values({
            userId,
            buildId,
            content,
            createdAt: new Date().toISOString().split('T')[0]
        })
        .onConflictDoUpdate({
            target: [reviewsTable.userId, reviewsTable.buildId],
            set: {
                content: content,
                createdAt: new Date().toISOString().split('T')[0]
            },
        })
        .returning({
            userId: reviewsTable.userId,
            buildId: reviewsTable.buildId,
            content: reviewsTable.content,
            createdAt: reviewsTable.createdAt
        })

    return result ?? null;
}

export async function cloneBuild(db: Database, userId: number, buildId: number) {
    return db.transaction(async (tx) => {
        const [buildToClone] = await tx
            .select()
            .from(buildsTable)
            .where(
                eq(buildsTable.id, buildId)
            )
            .limit(1);

        if (!buildToClone) return null;

        const [newBuild] = await tx
            .insert(buildsTable)
            .values({
                userId: userId,
                name: `${buildToClone.name} (copy)`,
                createdAt: new Date().toISOString().split('T')[0],
                description: buildToClone.description,
                totalPrice: buildToClone.totalPrice,
                isApproved: false
            })
            .returning({
                id: buildsTable.id
            });

        if(!newBuild) return null;

        const existing = await tx
            .select({ componentId: buildComponentsTable.componentId })
            .from(buildComponentsTable)
            .where(eq(buildComponentsTable.buildId, buildId));

        if (existing.length > 0) {
            await tx.insert(buildComponentsTable).values(
                existing.map((r) => ({
                    buildId: newBuild.id,
                    componentId: r.componentId,
                })),
            );
        }

        return newBuild.id;
    });
}

export async function deleteBuild(db: Database, userId: number, buildId: number) {
    const [result] = await db
        .delete(buildsTable)
        .where(
            and(
                eq(buildsTable.id, buildId),
                eq(buildsTable.userId, userId)
            )
        )
        .returning({
            id: buildsTable.id
        })

    return result?.id ?? null;
}

export async function addNewBuild(db: Database, userId: number, name: string, description: string) {
    const [newBuild] = await db
        .insert(buildsTable)
        .values({
            userId: userId,
            name: name,
            createdAt: new Date().toISOString().split('T')[0],
            description: description,
            totalPrice: Number(0).toFixed(2),
            isApproved: false
        })
        .returning({
            id: buildsTable.id
        });

    return newBuild?.id ?? null;
}

export async function editBuild(db: Database, userId: number, buildId: number) {
    const [buildToEdit] = await db
        .select()
        .from(buildsTable)
        .where(
            and(
                eq(buildsTable.id, buildId),
                eq(buildsTable.userId, userId)
            )
        )
        .limit(1);

    if (!buildToEdit || buildToEdit.isApproved) return null;


    return buildToEdit?.id ?? null;
}

export async function saveBuildState(db: Database, userId: number, buildId: number, name: string, description: string ) {
    const [build] = await db
        .select({
            id: buildsTable.id,
            isApproved: buildsTable.isApproved
        })
        .from(buildsTable)
        .where(
            and(
                eq(buildsTable.id, buildId),
                eq(buildsTable.userId, userId)
            )
        )
        .limit(1);

    if (!build || build.isApproved) return null;

    const [updated] = await db
        .update(buildsTable)
        .set({
            name,
            description
        })
        .where(
            eq(buildsTable.id, buildId)
        )
        .returning({
            id: buildsTable.id
        });

    return updated?.id ?? null;
}

export async function getBuildState(db: Database, userId: number, buildId: number) {
    return db.transaction(async (tx) => {
        const [build] = await tx
            .select({
                id: buildsTable.id,
                userId: buildsTable.userId,
                isApproved: buildsTable.isApproved,
                name: buildsTable.name,
                description: buildsTable.description,
                totalPrice: buildsTable.totalPrice,
            })
            .from(buildsTable)
            .where(
                and(
                    eq(buildsTable.id, buildId),
                    eq(buildsTable.userId, userId)
                )
            )
            .limit(1);

        if (!build || build.isApproved) return null;

        const components = await tx
            .select({
                componentId: buildComponentsTable.componentId
            })
            .from(buildComponentsTable)
            .where(
                eq(buildComponentsTable.buildId, buildId)
            );

        return {
            build,
            componentIds: components.map(c => c.componentId)
        };
    });
}