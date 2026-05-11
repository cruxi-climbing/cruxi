import { drizzle } from "drizzle-orm/libsql";

export const database = drizzle({
	connection: {
		url: "file:routes.db",
	},
});

export type Database = typeof database;
