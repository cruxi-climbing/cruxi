import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sql";

export const database = drizzle({
	connection: { url: process.env.DATABASE_URL },
});
