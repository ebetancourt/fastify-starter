import type { Config } from "drizzle-kit";
import { dbCredentials } from './src/db';

export default {
    schema: "./src/db/models/*",
    out: "./src/db/migrations",
    driver: "pg",
    dbCredentials,
} satisfies Config;
