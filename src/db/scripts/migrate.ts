import { migrate } from "drizzle-orm/node-postgres/migrator";
import { getConnection } from "../index";

const runMigrations = () => {
    getConnection().then((db) => {
        console.log("Beginning migrations...");
        return migrate(db, { migrationsFolder: "src/db/migrations" });
    }).then(() => {
        console.log("Migrations complete");
        return process.exit(0);
    });
};

runMigrations();
