import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema";

const connectionUrl = process.env.DATABASE_URL;
if (!connectionUrl)
	throw new Error("DATABASE_URL environment variable is not set");

export const database = drizzle(connectionUrl, { schema: schema });
