import { relations, sql } from "drizzle-orm";
import {
	boolean,
	date,
	geometry,
	index,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

const primaryKeyUuidV7 = (column = "id") =>
	uuid(column).primaryKey().default(sql`uuidv7()`);

export const users = pgTable("users", {
	id: primaryKeyUuidV7(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at")
		.$onUpdate(() => new Date())
		.notNull(),
	biography: text("biography"),
	height: integer("height"),
	wingspan: integer("wingspan"),
	birthday: date("birthday"),
	startedClimbingAt: date("started_climbing_at"),
});

export const sessions = pgTable(
	"sessions",
	{
		id: primaryKeyUuidV7(),
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at").notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => new Date())
			.notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
	},
	(table) => [index("sessions_userId_idx").on(table.userId)],
);

export const accounts = pgTable(
	"accounts",
	{
		id: primaryKeyUuidV7(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at").notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("accounts_userId_idx").on(table.userId)],
);

export const verifications = pgTable(
	"verifications",
	{
		id: primaryKeyUuidV7(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("verifications_identifier_idx").on(table.identifier)],
);

export const gradeIndices = pgTable("grade_indices", {
	index: integer("index").primaryKey(),
});

export const gradeSystems = pgTable("grade_systems", {
	id: primaryKeyUuidV7(),
	name: varchar("name", { length: 255 }).notNull(),
});

export const gradeNotations = pgTable(
	"grade_notations",
	{
		gradeIndexId: integer("grade_index_id")
			.notNull()
			.references(() => gradeIndices.index),
		gradeSystemId: uuid("grade_system_id")
			.notNull()
			.references(() => gradeSystems.id),
		notation: varchar("notation", { length: 50 }).notNull(),
	},
	(table) => [
		primaryKey({ columns: [table.gradeIndexId, table.gradeSystemId] }),
	],
);

export const areas = pgTable("areas", {
	id: primaryKeyUuidV7(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	city: varchar("city", { length: 255 }),
	country: varchar("country", { length: 255 }),
});

export const sectors = pgTable("sectors", {
	id: primaryKeyUuidV7(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	areaId: uuid("area_id")
		.notNull()
		.references(() => areas.id),
});

export const routes = pgTable("routes", {
	id: primaryKeyUuidV7(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	grade_index: integer("grade_index")
		.notNull()
		.references(() => gradeIndices.index),
	height: integer("height"),
	sectorId: uuid("sector_id")
		.notNull()
		.references(() => sectors.id),
});

export const gradeIndicesRelations = relations(gradeIndices, ({ many }) => ({
	notations: many(gradeNotations),
	routes: many(routes),
}));

export const gradeSystemsRelations = relations(gradeSystems, ({ many }) => ({
	notations: many(gradeNotations),
}));

export const gradeNotationsRelations = relations(gradeNotations, ({ one }) => ({
	gradeIndex: one(gradeIndices, {
		fields: [gradeNotations.gradeIndexId],
		references: [gradeIndices.index],
	}),
	gradeSystem: one(gradeSystems, {
		fields: [gradeNotations.gradeSystemId],
		references: [gradeSystems.id],
	}),
}));
export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	accounts: many(accounts),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	users: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
	users: one(users, {
		fields: [accounts.userId],
		references: [users.id],
	}),
}));

export const areasRelations = relations(areas, ({ many }) => ({
	sectors: many(sectors),
}));

export const sectorsRelations = relations(sectors, ({ one, many }) => ({
	area: one(areas, { fields: [sectors.areaId], references: [areas.id] }),
	routes: many(routes),
}));

export const routesRelations = relations(routes, ({ one }) => ({
	sector: one(sectors, { fields: [routes.sectorId], references: [sectors.id] }),
	gradeIndex: one(gradeIndices, {
		fields: [routes.grade_index],
		references: [gradeIndices.index],
	}),
}));

// example of geometry column with a spatial index
export const stores = pgTable(
	"stores",
	{
		id: uuid("id").primaryKey().default(sql`uuidv7()`),
		name: text("name").notNull(),
		location: geometry("location", {
			type: "point",
			mode: "xy",
			srid: 4326,
		}).notNull(),
	},
	(t) => [index("spatial_index").using("gist", t.location)],
);
