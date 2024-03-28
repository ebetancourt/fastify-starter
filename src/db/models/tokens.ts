
import { serial, text, timestamp, pgTable, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const tokens = pgTable('tokens', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    token: text('token').notNull().unique(),
});

export const tokensRelations = relations(tokens, ({ one }) => ({
    owner: one(users, { fields: [tokens.userId], references: [users.id] }),
}));

export type Token = typeof tokens.$inferSelect; // return type when queried
export type NewToken = typeof tokens.$inferInsert; // insert type
