import { describe, expect, it } from "bun:test";
import { call } from "@orpc/server";
import { database } from "@/database";
import {
	areas,
	gradeIndices,
	routes,
	sectors,
	userProjects,
} from "@/database/schema";
import { router } from "@/router";
import { createTestUser } from "./utils/test.utils";

describe("Users.me.projects", () => {
	it("returns project routes for the authenticated user only", async () => {
		const { headers, user } = await createTestUser();
		const route = await createRoute("Project Route A");

		await database.insert(userProjects).values({
			id: crypto.randomUUID(),
			userId: user.id,
			routeId: route.id,
		});

		const response = await call(router.users.me.projects, undefined, {
			context: { headers, database },
		});

		expect(response).toEqual([
			expect.objectContaining({
				id: route.id,
				name: "Project Route A",
				sectorName: "Test Sector",
			}),
		]);
	});

	it("returns projects sorted from newest to oldest", async () => {
		const { headers, user } = await createTestUser();
		const firstRoute = await createRoute("Older Route");
		const secondRoute = await createRoute("Newer Route");

		await database.insert(userProjects).values([
			{
				id: crypto.randomUUID(),
				userId: user.id,
				routeId: firstRoute.id,
				createdAt: new Date("2024-01-01T00:00:00.000Z"),
			},
			{
				id: crypto.randomUUID(),
				userId: user.id,
				routeId: secondRoute.id,
				createdAt: new Date("2024-02-01T00:00:00.000Z"),
			},
		]);

		const response = await call(router.users.me.projects, undefined, {
			context: { headers, database },
		});

		expect(response.map((project) => project.name)).toEqual([
			"Newer Route",
			"Older Route",
		]);
	});

	it("does not return projects from another user", async () => {
		const { headers } = await createTestUser();
		const otherUser = (await createTestUser()).user;
		const route = await createRoute("Other User Route");

		await database.insert(userProjects).values({
			id: crypto.randomUUID(),
			userId: otherUser.id,
			routeId: route.id,
		});

		const response = await call(router.users.me.projects, undefined, {
			context: { headers, database },
		});

		expect(response).toEqual([]);
	});
});

async function createRoute(name: string) {
	const [gradeIndex] = await database.select().from(gradeIndices).limit(1);
	if (!gradeIndex) throw new Error("Expected reference grade index to exist");

	const areaId = crypto.randomUUID();
	const sectorId = crypto.randomUUID();
	const routeId = crypto.randomUUID();

	await database.insert(areas).values({ id: areaId, name: "Test Area" });
	await database.insert(sectors).values({
		id: sectorId,
		name: "Test Sector",
		areaId,
	});

	await database.insert(routes).values({
		id: routeId,
		name,
		gradeIndex: gradeIndex.index,
		sectorId,
	});

	return { id: routeId, name };
}
