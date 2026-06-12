import { type AscentStyle, ascentStyles } from "@cruxi/shared";
import { faker } from "@faker-js/faker";
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

	const users = await database.select().from(schema.users);
	const userIds = users.map((u) => u.id);

	const routes = await database.select().from(schema.routes);
	const routeIds = routes.map((r) => r.id);

	// manually seeding those as they have composite unique constraints that drizzle-seed cannot handle for now
	await seedAscents({ routeIds, userIds, count: 10_000 });
	await seedUserProjects({ routeIds, userIds, count: 10_000 });
}

async function seedRandomData({ userIds }: { userIds: string[] }) {
	await seed(database, {
		users: users,
		areas: areas,
		sectors: sectors,
		routes: routes,
		climbingSessions: climbingSessions,
	}).refine((funcs) => ({
		users: {
			count: 100,
			columns: {
				id: funcs.valuesFromArray({
					values: generateRandomUUIDV7(100),
					isUnique: true,
				}),
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
				id: funcs.valuesFromArray({
					values: generateRandomUUIDV7(100),
					isUnique: true,
				}),
				name: funcs.state(),
				description: funcs.loremIpsum(),
				city: funcs.city(),
				country: funcs.country(),
			},
		},
		sectors: {
			count: 500,
			columns: {
				id: funcs.valuesFromArray({
					values: generateRandomUUIDV7(500),
					isUnique: true,
				}),
				name: funcs.state(),
				description: funcs.loremIpsum(),
			},
		},
		routes: {
			count: 10_000,
			columns: {
				id: funcs.valuesFromArray({
					values: generateRandomUUIDV7(10_000),
					isUnique: true,
				}),
				name: funcs.lastName(),
				description: funcs.loremIpsum(),
				height: funcs.int({ minValue: 5, maxValue: 1000 }),
				gradeIndex: funcs.valuesFromArray({ values: gradeIndices }),
			},
		},
		climbingSessions: {
			count: 1000,
			columns: {
				id: funcs.valuesFromArray({
					values: generateRandomUUIDV7(1000),
					isUnique: true,
				}),
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

async function seedUserProjects({
	routeIds,
	userIds,
	count,
}: {
	routeIds: string[];
	userIds: string[];
	count: number;
}) {
	// pick a unique combination of userId and routeId for each project
	const usedCombinations = new Set<string>();
	while (usedCombinations.size < count) {
		const randomUserId = pickRandom(userIds);
		const randomRouteId = pickRandom(routeIds);
		const combinationKey = `${randomUserId};${randomRouteId}`;
		if (usedCombinations.has(combinationKey)) {
			continue; // skip if this combination has already been used
		}
		usedCombinations.add(combinationKey);
	}

	for (const combination of usedCombinations) {
		const [randomUserId, randomRouteId] = combination.split(";");
		await database.insert(userProjects).values({
			userId: randomUserId as string,
			routeId: randomRouteId as string,
			createdAt: faker.date.past({ years: 10 }),
		});
	}
}

async function seedAscents({
	routeIds,
	userIds,
	count,
}: {
	routeIds: string[];
	userIds: string[];
	count: number;
}) {
	// pick a unique combination of userId and routeId for each ascent
	const usedCombinations = new Set<string>();
	while (usedCombinations.size < count) {
		const randomUserId = pickRandom(userIds);
		const randomRouteId = pickRandom(routeIds);
		const combinationKey = `${randomUserId};${randomRouteId}`;
		if (usedCombinations.has(combinationKey)) {
			continue; // skip if this combination has already been used
		}
		usedCombinations.add(combinationKey);
	}

	for (const combination of usedCombinations) {
		const ascentStyle = pickRandom(ascentStyles as unknown as string[]);
		const randomRating = Math.round(Math.random() * 5 * 4) / 4; // rating between 0 and 5 with 0.25 step

		const [randomUserId, randomRouteId] = combination.split(";");
		await database.insert(ascents).values({
			userId: randomUserId as string,
			routeId: randomRouteId as string,
			ascentStyle: ascentStyle as AscentStyle,
			rating: randomRating,
			comment: faker.lorem.sentences(),
			sentAt: faker.date.past({ years: 10 }).toISOString(),
			createdAt: faker.date.past({ years: 10 }),
		});
	}
}

/**
 * Big workaround to generate uuidv7, as drizzle seed cannot generation custom value
 * https://github.com/drizzle-team/drizzle-orm/issues/4056
 */
function generateRandomUUIDV7(count: number) {
	const uuids: string[] = [];
	for (let i = 0; i < count; i++) {
		uuids.push(Bun.randomUUIDv7());
	}
	return uuids;
}

function pickRandom<T>(array: T[]): T {
	const random = array[Math.floor(Math.random() * array.length)];
	if (!random) throw new Error("Array is empty");
	return random;
}
