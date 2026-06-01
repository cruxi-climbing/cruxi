import { describe, expect, it } from "bun:test";
import { call } from "@orpc/server";
import { database } from "@/database";
import { areas, gradeIndices, routes, sectors } from "@/database/schema";
import { router } from "@/router";
import { createTestUser } from "./utils/test.utils";

describe("Search", () => {
	it("should return matching route results for a valid query", async () => {
		const { headers } = await createTestUser();

		await createRoute("Test Route A");
		await createRoute("Best Test Route");
		await createRoute("Unrelated Climb");

		const res = await call(
			router.search,
			{ search: "test" },
			{ context: { headers, database } },
		);

		const names = res.map((route) => route.name);
		expect(names).toEqual(
			expect.arrayContaining(["Test Route A", "Best Test Route"]),
		);
		expect(res.length).toBeGreaterThanOrEqual(2);
	});

	it("should return an empty array when there are no matching results", async () => {
		const { headers } = await createTestUser();

		const res = await call(
			router.search,
			{ search: "no-match-query" },
			{ context: { headers, database } },
		);

		expect(res).toEqual([]);
	});

	it("should reject search queries shorter than the minimum length", async () => {
		const { headers } = await createTestUser();

		let thrownError: unknown;
		try {
			await call(
				router.search,
				{ search: "x" },
				{ context: { headers, database } },
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
	await database.insert(areas).values({ id: areaId, name: "Test Area" });
	await database.insert(sectors).values({
		id: sectorId,
		name: "Test Sector",
		areaId,
	});

	await database.insert(routes).values({
		id: Bun.randomUUIDv7(),
		name,
		gradeIndex: gradeIndex.index,
		sectorId,
	});
}
