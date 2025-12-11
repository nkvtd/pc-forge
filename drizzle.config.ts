import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL in .env file");
}

export default defineConfig({
  dialect: "sqlite",
  schema: "./database/drizzle/schema/*",
  out: "./database/migrations",

  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: exists
    url: process.env.DATABASE_URL!,
  },
});
