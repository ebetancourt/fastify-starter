import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./models";
import { eq, sql } from 'drizzle-orm';

export const dbCredentials = {
    user: "postgres",
    password: "pass",
    host: "127.0.0.1",
    port: 5432,
    database: "app",
};

const client = new Client(dbCredentials);
export type DBConnection = NodePgDatabase<typeof schema>;
let db: DBConnection;
export async function getConnection() {
    if (!db) {
        await client.connect();
        db = await drizzle(client, { schema });
    }
    return db;
}

export function updateFeedTimestamp(db: DBConnection, feedId: number) {
    return db.update(schema.feeds).set({ updatedAt: sql`now()` }).where(eq(schema.feeds.id, feedId));
}

export * from './models';
