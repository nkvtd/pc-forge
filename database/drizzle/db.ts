import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

pool.on("connect", (client) => {
    client.query('SET search_path TO pcforge, public');
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;
