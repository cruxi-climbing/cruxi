import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const fallbackDbUrl = "postgresql://admin:admin@localhost:5432/cruxi";
const databaseUrl = process.env.DATABASE_URL || fallbackDbUrl;
if (!process.env.DATABASE_URL)
	console.warn(
		`DATABASE_URL env variable not defined, fallback to ${fallbackDbUrl}`,
	);

export default defineConfig({
	out: "./drizzle",
	schema: "./src/database/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: databaseUrl,
	},
	extensionsFilters: ["postgis"],
});
