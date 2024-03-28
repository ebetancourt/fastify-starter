import { serial, text, timestamp, pgTable } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { tokens } from "./tokens";

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name'),
    email: text('email'),
    password: text('password'),
    role: text('role').$type<'admin' | 'customer'>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
    tokens: many(tokens),
}));

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type
