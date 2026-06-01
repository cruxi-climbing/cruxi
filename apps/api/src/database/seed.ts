import { reset, seed } from "drizzle-seed";
import { auth } from "@/auth";
import { addReferenceData, database } from ".";
import gradeIndicesData from "./reference_data/grade_indices.json";
import {
	areas,
	ascents,
	climbingSessions,
	routes,
	sectors,
	userProjects,
	users,
} from "./schema";
import * as schema from "./schema.ts";

main().catch((error) => {
	console.error("Error seeding database:", error);
	process.exit(1);
});

const gradeIndices = gradeIndicesData.map((g) => g.index);

async function main() {
	await reset(database, schema);
	await addReferenceData();
	const staticUsersIds = await seedStaticUsers();
	await seedRandomData({ userIds: staticUsersIds });
}

async function seedRandomData({ userIds }: { userIds: string[] }) {
	await seed(database, {
		users: users,
		areas: areas,
		sectors: sectors,
		routes: routes,
		ascents: ascents,
		userProjects: userProjects,
		climbingSessions: climbingSessions,
	}).refine((funcs) => ({
		users: {
			count: 1000,
			columns: {
				email: funcs.email(),
				emailVerified: funcs.boolean(),
				password: funcs.lastName(),
				banned: funcs.default({ defaultValue: false }),
				banExpiresAt: funcs.default({ defaultValue: null }),
				name: funcs.fullName(),
				role: funcs.default({ defaultValue: "user" }),
				biography: funcs.loremIpsum(),
				height: funcs.int({ minValue: 140, maxValue: 210 }),
				wingspan: funcs.int({ minValue: 140, maxValue: 210 }),
				image: funcs.default({ defaultValue: null }),
			},
		},
		areas: {
			count: 100,
			columns: {
				name: funcs.state(),
				description: funcs.loremIpsum(),
				city: funcs.city(),
				country: funcs.country(),
			},
		},
		sectors: {
			count: 500,
			columns: {
				name: funcs.state(),
				description: funcs.loremIpsum(),
			},
		},
		routes: {
			count: 10_000,
			columns: {
				name: funcs.lastName(),
				description: funcs.loremIpsum(),
				height: funcs.int({ minValue: 5, maxValue: 1000 }),
				gradeIndex: funcs.valuesFromArray({ values: gradeIndices }),
			},
		},
		ascents: {
			count: 2000,
			columns: {
				userId: funcs.valuesFromArray({ values: userIds }),
				rating: funcs.number({ minValue: 0, maxValue: 5, precision: 2 }),
				comment: funcs.loremIpsum(),
				proposedGradeIndex: funcs.weightedRandom([
					{
						weight: 0.5,
						value: funcs.valuesFromArray({ values: gradeIndices }),
					},
					{ weight: 0.5, value: funcs.default({ defaultValue: null }) },
				]),
			},
		},
		userProjects: {
			count: 1000,
			columns: {
				userId: funcs.valuesFromArray({ values: userIds }),
			},
		},
		climbingSessions: {
			count: 1000,
			columns: {
				userId: funcs.valuesFromArray({ values: userIds }),
				comment: funcs.loremIpsum(),
			},
		},
	}));
}

const staticUsers = [
	{
		email: "dev@cruxi.fr",
		emailVerified: true,
		password: "demo",
		name: "Dev User",
		role: "admin" as const,
		data: {
			biography: "I am a developer testing the Cruxi app.",
			height: 165,
			wingspan: 170,
			birthday: "1990-01-01",
			startedClimbingAt: "2010-01-01",
		},
	},
	{
		email: "user@cruxi.fr",
		password: "demo",
		name: "Regular User",
		role: "user" as const,
		data: {
			biography: "I am a regular user of the Cruxi app.",
			height: 170,
			wingspan: 175,
			birthday: "1995-01-01",
			startedClimbingAt: "2015-01-01",
		},
	},
];

async function seedStaticUsers() {
	for (const userData of staticUsers) {
		await auth.api.createUser({ body: userData });
	}

	const users = await database
		.select({
			id: schema.users.id,
		})
		.from(schema.users);

	const userIds = users.map((u) => u.id);
	return userIds;
}
