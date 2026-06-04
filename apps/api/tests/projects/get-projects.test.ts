import { describe, expect, it } from "bun:test";
import { call } from "@orpc/server";
import { database } from "@/database";
import { userProjects } from "@/database/schema";
import { router } from "@/router";
import { createRoute, createTestUser } from "../utils/test.utils";

describe("Projects.list", () => {
	it("returns project routes for the authenticated user only", async () => {
		const { headers, user } = await createTestUser();
		const route = await createRoute("Project Route A", { database });

		await database.insert(userProjects).values({
			userId: user.id,
			routeId: route.id,
		});

		const response = await call(router.projects.list, undefined, {
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
		const firstRoute = await createRoute("Older Route", { database });
		const secondRoute = await createRoute("Newer Route", { database });

		await database.insert(userProjects).values([
			{
				userId: user.id,
				routeId: firstRoute.id,
				createdAt: new Date("2024-01-01T00:00:00.000Z"),
			},
			{
				userId: user.id,
				routeId: secondRoute.id,
				createdAt: new Date("2024-02-01T00:00:00.000Z"),
			},
		]);

		const response = await call(router.projects.list, undefined, {
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
		const route = await createRoute("Other User Route", { database });

		await database.insert(userProjects).values({
			userId: otherUser.id,
			routeId: route.id,
		});

		const response = await call(router.projects.list, undefined, {
			context: { headers, database },
		});

		expect(response).toEqual([]);
	});
});
