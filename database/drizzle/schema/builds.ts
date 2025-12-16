import { pgTable, serial, integer, text, numeric, boolean, date, primaryKey } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { componentsTable } from "./components";

export const buildTable = pgTable("build", {
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

export const buildComponentTable = pgTable("build_component", {
        buildId: integer("build_id")
            .notNull()
            .references(() => buildTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
        componentId: integer("component_id")
            .notNull()
            .references(() => componentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.buildId, t.componentId] }),
    }),
);

export const favoriteBuildTable = pgTable("favorite_build", {
        buildId: integer("build_id")
            .notNull()
            .references(() => buildTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
        userId: integer("user_id")
            .notNull()
            .references(() => usersTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.buildId, t.userId] }),
    }),
);

export const ratingBuildTable = pgTable("rating_build", {
        buildId: integer("build_id")
            .notNull()
            .references(() => buildTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
        userId: integer("user_id")
            .notNull()
            .references(() => usersTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
        value: numeric("value").notNull(),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.buildId, t.userId] }),
    }),
);

export const reviewTable = pgTable("review", {
    id: serial("id").primaryKey(),

    buildId: integer("build_id")
        .notNull()
        .references(() => buildTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    userId: integer("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    content: text("content").notNull(),
    createdAt: date("created_at").notNull(),
});

export type buildItem = typeof buildTable.$inferSelect;
export type buildInsert = typeof buildTable.$inferInsert;

export type buildComponentItem = typeof buildComponentTable.$inferSelect;
export type buildComponentInsert = typeof buildComponentTable.$inferInsert;

export type favoriteBuildItem = typeof favoriteBuildTable.$inferSelect;
export type favoriteBuildInsert = typeof favoriteBuildTable.$inferInsert;

export type ratingBuildItem = typeof ratingBuildTable.$inferSelect;
export type ratingBuildInsert = typeof ratingBuildTable.$inferInsert;

export type reviewItem = typeof reviewTable.$inferSelect;
export type reviewInsert = typeof reviewTable.$inferInsert;