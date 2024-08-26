import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { env } from "./env";

// for migrations
// const migrationClient = postgres(env.DATABASE_URL, { max: 1 });
// migrate(drizzle(migrationClient), { migrationsFolder: "../drizzle" });

// for query purposes
const queryClient = postgres(env.DATABASE_URL);
export const db = drizzle(queryClient);

export * from "./schema";
