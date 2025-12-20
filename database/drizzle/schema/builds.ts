import {pgTable, serial, integer, text, numeric, boolean, date, primaryKey, check} from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { componentsTable } from "./components";
import {sql} from "drizzle-orm";

export const buildsTable = pgTable("build", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    name: text("name").notNull(),
    createdAt: date("created_at").notNull(),
    description: text("description"),
    totalPrice: numeric("total_price").notNull(),
    isApproved: boolean("is_approved").notNull(),
});

export const buildComponentsTable = pgTable("build_component", {
        buildId: integer("build_id")
            .notNull()
            .references(() => buildsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
        componentId: integer("component_id")
            .notNull()
            .references(() => componentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.buildId, t.componentId] }),
    }),
);

export const favoriteBuildsTable = pgTable("favorite_build", {
        buildId: integer("build_id")
            .notNull()
            .references(() => buildsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
        userId: integer("user_id")
            .notNull()
            .references(() => usersTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.buildId, t.userId] }),
    }),
);

export const ratingBuildsTable = pgTable("rating_build", {
        buildId: integer("build_id")
            .notNull()
            .references(() => buildsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
        userId: integer("user_id")
            .notNull()
            .references(() => usersTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
        value: numeric("value").notNull(),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.buildId, t.userId] }),
        checkValue: check("check_value", sql`${t.value} BETWEEN 1 AND 5`),
    }),
);

export const reviewsTable = pgTable("review", {
    id: serial("id").primaryKey(),

    buildId: integer("build_id")
        .notNull()
        .references(() => buildsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    userId: integer("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    content: text("content").notNull(),
    createdAt: date("created_at").notNull(),
});

export type buildItem = typeof buildsTable.$inferSelect;
export type buildInsert = typeof buildsTable.$inferInsert;

export type buildComponentItem = typeof buildComponentsTable.$inferSelect;
export type buildComponentInsert = typeof buildComponentsTable.$inferInsert;

export type favoriteBuildItem = typeof favoriteBuildsTable.$inferSelect;
export type favoriteBuildInsert = typeof favoriteBuildsTable.$inferInsert;

export type ratingBuildItem = typeof ratingBuildsTable.$inferSelect;
export type ratingBuildInsert = typeof ratingBuildsTable.$inferInsert;

export type reviewItem = typeof reviewsTable.$inferSelect;
export type reviewInsert = typeof reviewsTable.$inferInsert;