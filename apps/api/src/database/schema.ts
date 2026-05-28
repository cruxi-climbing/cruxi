import { relations, sql } from "drizzle-orm";
import {
	boolean,
	check,
	date,
	geometry,
	index,
	numeric,
	pgEnum,
	pgTable,
	primaryKey,
	smallint,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

const primaryKeyUuidV7 = (column = "id") =>
	uuid(column).primaryKey().default(sql`uuidv7()`);

export const users = pgTable(
	"users",
	{
		id: primaryKeyUuidV7(),
		name: text("name").notNull(),
		email: text("email").notNull().unique(),
		emailVerified: boolean("email_verified").default(false).notNull(),
		image: text("image"),
		createdAt: timestamp("created_at").notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => new Date())
			.notNull(),
		role: text("role"),
		banned: boolean("banned").default(false),
		banReason: text("ban_reason"),
		banExpires: timestamp("ban_expires"),
		biography: text("biography"),
		height: smallint("height"), // centimeters
		wingspan: smallint("wingspan"), // centimeters
		birthday: date("birthday"),
		startedClimbingAt: date("started_climbing_at"),
	},
	(table) => [
		check("height_check", sql`${table.height} > 0`),
		check("wingspan_check", sql`${table.wingspan} > 0`),
	],
);

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
		userId: uuid("user_id")
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
		userId: uuid("user_id")
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
	index: smallint("index").primaryKey(),
});

export const gradeSystems = pgTable("grade_systems", {
	id: primaryKeyUuidV7(),
	name: varchar("name", { length: 255 }).notNull(),
});

export const gradeNotations = pgTable(
	"grade_notations",
	{
		gradeIndexId: smallint("grade_index_id")
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

export const routes = pgTable(
	"routes",
	{
		id: primaryKeyUuidV7(),
		name: varchar("name", { length: 255 }).notNull(),
		description: text("description"),
		gradeIndex: smallint("grade_index")
			.notNull()
			.references(() => gradeIndices.index),
		height: smallint("height"), // centimeters
		sectorId: uuid("sector_id")
			.notNull()
			.references(() => sectors.id),
	},

	(table) => [check("height_check", sql`${table.height} > 0`)],
);

export const userProjects = pgTable("user_projects", {
	id: primaryKeyUuidV7(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	routeId: uuid("route_id")
		.notNull()
		.references(() => routes.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const climbingSessions = pgTable("climbing_sessions", {
	id: primaryKeyUuidV7(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	routeId: uuid("route_id")
		.notNull()
		.references(() => routes.id, { onDelete: "cascade" }),
	sessionDate: date("session_date").notNull(),
	comment: text("comment"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const ascentStyleEnum = pgEnum("ascent_style", [
	"onsight",
	"flash",
	"redpoint",
	"top_rope",
	"send",
]);

export const ascents = pgTable(
	"ascents",
	{
		id: primaryKeyUuidV7(),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		routeId: uuid("route_id")
			.notNull()
			.references(() => routes.id, { onDelete: "cascade" }),
		sentAt: date("sent_at").notNull(),
		rating: numeric("rating", { precision: 3, scale: 2 }),
		ascentStyle: ascentStyleEnum("ascent_style").default("send").notNull(),
		proposedGradeIndex: smallint("proposed_grade_index").references(
			() => gradeIndices.index,
			{ onDelete: "cascade", onUpdate: "cascade" },
		),
		comment: text("comment"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
	},
	(table) => [
		check(
			"rating_limit_and_step",
			sql`${table.rating} >= 0 AND ${table.rating} <= 5 AND (${table.rating} * 4) % 1 = 0`,
		),
	],
);

export const gradeIndicesRelations = relations(gradeIndices, ({ many }) => ({
	notations: many(gradeNotations),
	routes: many(routes),
	ascents: many(ascents),
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

export const routesRelations = relations(routes, ({ many, one }) => ({
	sector: one(sectors, { fields: [routes.sectorId], references: [sectors.id] }),
	grade: one(gradeIndices, {
		fields: [routes.gradeIndex],
		references: [gradeIndices.index],
	}),
	ascents: many(ascents),
	userProjects: many(userProjects),
	climbingSessions: many(climbingSessions),
}));

export const userProjectsRelations = relations(userProjects, ({ one }) => ({
	user: one(users, {
		fields: [userProjects.userId],
		references: [users.id],
	}),
	route: one(routes, {
		fields: [userProjects.routeId],
		references: [routes.id],
	}),
}));

export const climbingSessionsRelations = relations(
	climbingSessions,
	({ one }) => ({
		user: one(users, {
			fields: [climbingSessions.userId],
			references: [users.id],
		}),
		route: one(routes, {
			fields: [climbingSessions.routeId],
			references: [routes.id],
		}),
	}),
);

export const ascentsRelations = relations(ascents, ({ one }) => ({
	user: one(users, {
		fields: [ascents.userId],
		references: [users.id],
	}),
	route: one(routes, {
		fields: [ascents.routeId],
		references: [routes.id],
	}),
	grade: one(gradeIndices, {
		fields: [ascents.proposedGradeIndex],
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
