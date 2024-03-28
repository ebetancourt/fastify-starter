import { getConnection } from "../index";
import { users, NewUser } from "../models";
import { faker } from "@faker-js/faker";

const main = async () => {
    const db = await getConnection();
    const data: NewUser[] = [];

    for (let i = 0; i < 20; i++) {
        data.push({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            role: i === 0 ? "admin" : "customer",
        });
    }

    console.log("Seed start");
    console.log("Seeding users...");
    const newUsers = await db.insert(users).values(data).returning({ insertedId: users.id });
    console.log("Done seeding users.");

    return process.exit(0);
};

main();
