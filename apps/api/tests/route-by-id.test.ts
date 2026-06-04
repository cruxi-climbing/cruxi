import { describe, expect, it } from "bun:test";
import { call } from "@orpc/server";
import { database } from "@/database";
import {
	areas,
	ascents,
	gradeIndices,
	routes,
	sectors,
} from "@/database/schema";
import { router } from "@/router";
import { createTestUser } from "./utils/test.utils";

describe("Routes.byId", () => {
	it("returns route details with sector name and ascent count", async () => {
		const { headers, user } = await createTestUser();
		const { user: user2 } = await createTestUser();
		const route = await createRoute("Test Route A");

		await database.insert(ascents).values([
			{
				userId: user.id,
				routeId: route.id,
				sentAt: "2024-01-01",
				rating: 4.5,
				ascentStyle: "send",
			},
			{
				userId: user2.id,
				routeId: route.id,
				sentAt: "2024-03-01",
				rating: 4,
				ascentStyle: "flash",
			},
		]);

		const response = await call(
			router.routes.getById,
			{ id: route.id },
			{ context: { headers, database } },
		);

		expect(response).toEqual(
			expect.objectContaining({
				id: route.id,
				name: "Test Route A",
				sectorName: "Test Sector",
				ascentsCount: 2,
				avgRating: 4.25,
			}),
		);
	});

	it("returns null avgRating when route has no ascents", async () => {
		const { headers } = await createTestUser();
		const route = await createRoute("Test Route B");

		const response = await call(
			router.routes.getById,
			{ id: route.id },
			{ context: { headers, database } },
		);

		expect(response).toEqual(
			expect.objectContaining({
				id: route.id,
				name: "Test Route B",
				sectorName: "Test Sector",
				ascentsCount: 0,
				avgRating: null,
			}),
		);
	});

	it("throws when the route does not exist", async () => {
		const { headers } = await createTestUser();

		let thrownError: unknown;
		try {
			await call(
				router.routes.getById,
				{ id: Bun.randomUUIDv7() },
				{
					context: { headers, database },
				},
			);
		} catch (error) {
			thrownError = error;
		}

		expect(thrownError).toBeDefined();
	});
});

async function createRoute(name: string) {
	const [gradeIndex] = await database.select().from(gradeIndices).limit(1);
	if (!gradeIndex) throw new Error("Expected reference grade index to exist");

	const areaId = Bun.randomUUIDv7();
	const sectorId = Bun.randomUUIDv7();
	const routeId = Bun.randomUUIDv7();

	await database.insert(areas).values({ id: areaId, name: "Test Area" });
	await database
		.insert(sectors)
		.values({ id: sectorId, name: "Test Sector", areaId });

	await database.insert(routes).values({
		id: routeId,
		name,
		gradeIndex: gradeIndex.index,
		sectorId,
	});

	return { id: routeId, name };
}
