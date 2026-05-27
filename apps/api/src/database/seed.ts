import { reset, seed } from "drizzle-seed";
import { auth } from "@/auth";
import { addReferenceData, database } from ".";
import gradeIndicesData from "./reference_data/grade_indices.json";
import { areas, routes, sectors } from "./schema";
import * as schema from "./schema.ts";

main().catch((error) => {
	console.error("Error seeding database:", error);
	process.exit(1);
});

async function main() {
	await reset(database, schema);
	await addReferenceData();
	await seedUsers();
	await seed(database, {
		areas: areas,
		sectors: sectors,
		routes: routes,
	}).refine((funcs) => ({
		areas: {
			columns: {
				name: funcs.state(),
				description: funcs.loremIpsum(),
				city: funcs.city(),
				country: funcs.country(),
			},
		},
		sectors: {
			columns: {
				name: funcs.state(),
				description: funcs.loremIpsum(),
			},
		},
		routes: {
			columns: {
				name: funcs.lastName(),
				description: funcs.loremIpsum(),
				height: funcs.int({ minValue: 5, maxValue: 1000 }),
				gradeIndex: funcs.valuesFromArray({
					values: gradeIndicesData.map((g) => g.index),
				}),
			},
		},
	}));
}

const users = [
	{
		email: "dev@cruxi.fr",
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

async function seedUsers() {
	for (const userData of users) {
		await auth.api.createUser({ body: userData });
	}
}
