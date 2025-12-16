import { pgTable, serial, integer, text, numeric, boolean, date, primaryKey } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: serial("id").primaryKey(),
    username: text("username").notNull().unique(),
    passwordHash: text("password").notNull(),
    email: text("email").notNull().unique()
})

export const adminsTable = pgTable("admins", {
    userId: integer("user_id")
        .primaryKey()
        .references(() => usersTable.id, { onDelete: 'cascade', onUpdate: 'cascade' })
})

export const suggestionsTable = pgTable("suggestions", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    adminId: integer("admin_id")
        .references(() => adminsTable.userId, { onDelete: 'set null', onUpdate: 'cascade' }),
    link: text("link").notNull(),
    adminComment: text("admin_comment"),
    description: text("description"),
    status: text("status")
        .notNull()
        .default("pending"), // Pending, Approved, Rejected
    componentType: text("component_type").notNull()
});

export type userItem = typeof usersTable.$inferSelect;
export type userInsert = typeof usersTable.$inferInsert;

export type adminItem = typeof adminsTable.$inferSelect;
export type adminInsert = typeof adminsTable.$inferInsert;

export type suggestionItem = typeof suggestionsTable.$inferSelect;
export type suggestionInsert = typeof suggestionsTable.$inferInsert;