import {
	geometry,
	index,
	integer,
	pgTable,
	serial,
	text,
	varchar,
} from "drizzle-orm/pg-core";

// example table
export const usersTable = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }).notNull(),
	age: integer().notNull(),
	email: varchar({ length: 255 }).notNull().unique(),
});

// example of geometry column with a spatial index
export const stores = pgTable(
	"stores",
	{
		id: serial("id").primaryKey(),
		name: text("name").notNull(),
		location: geometry("location", {
			type: "point",
			mode: "xy",
			srid: 4326,
		}).notNull(),
	},
	(t) => [index("spatial_index").using("gist", t.location)],
);
