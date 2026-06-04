import { describe, expect, it } from "bun:test";
import { call } from "@orpc/server";
import { and, eq } from "drizzle-orm";
import { database } from "@/database";
import { userProjects } from "@/database/schema";
import { router } from "@/router";
import { createRoute, createTestUser } from "../utils/test.utils";

describe("Projects.create", () => {
	it("creates a project for the authenticated user", async () => {
		const { headers, user } = await createTestUser();
		const route = await createRoute("Test Route", { database });

		const response = await call(
			router.projects.create,
			{ routeId: route.id },
			{ context: { headers, database } },
		);

		expect(response).toBeUndefined();

		const projects = await database
			.select()
			.from(userProjects)
			.where(
				and(
					eq(userProjects.userId, user.id),
					eq(userProjects.routeId, route.id),
				),
			);

		expect(projects).toHaveLength(1);
		expect(projects[0]).toEqual(
			expect.objectContaining({
				userId: user.id,
				routeId: route.id,
			}),
		);
	});

	it("allows the created project to appear in projects.list", async () => {
		const { headers } = await createTestUser();
		const route = await createRoute("Newly Created Route", { database });

		await call(
			router.projects.create,
			{ routeId: route.id },
			{
				context: { headers, database },
			},
		);

		const projects = await call(router.projects.list, undefined, {
			context: { headers, database },
		});

		expect(projects).toContainEqual(
			expect.objectContaining({
				id: route.id,
				name: "Newly Created Route",
			}),
		);
	});

	it("handles duplicate project creation gracefully (idempotent)", async () => {
		const { headers, user } = await createTestUser();
		const route = await createRoute("Duplicate Route", { database });

		// Create the same project twice
		await call(
			router.projects.create,
			{ routeId: route.id },
			{
				context: { headers, database },
			},
		);

		const response = await call(
			router.projects.create,
			{ routeId: route.id },
			{
				context: { headers, database },
			},
		);

		expect(response).toBeUndefined();

		// Should still only have one project entry
		const projects = await database
			.select()
			.from(userProjects)
			.where(
				and(
					eq(userProjects.userId, user.id),
					eq(userProjects.routeId, route.id),
				),
			);

		expect(projects).toHaveLength(1);
	});

	it("creates separate projects for different routes", async () => {
		const { headers, user } = await createTestUser();
		const route1 = await createRoute("Route 1", { database });
		const route2 = await createRoute("Route 2", { database });

		await call(
			router.projects.create,
			{ routeId: route1.id },
			{
				context: { headers, database },
			},
		);

		await call(
			router.projects.create,
			{ routeId: route2.id },
			{
				context: { headers, database },
			},
		);

		const userProjects_ = await database
			.select()
			.from(userProjects)
			.where(eq(userProjects.userId, user.id));

		expect(userProjects_).toHaveLength(2);
		expect(userProjects_.map((p) => p.routeId)).toEqual(
			expect.arrayContaining([route1.id, route2.id]),
		);
	});

	it("isolates projects by user", async () => {
		const { headers: headers1 } = await createTestUser();
		const { headers: headers2 } = await createTestUser();
		const route = await createRoute("Shared Route", { database });

		// User 1 creates project
		await call(
			router.projects.create,
			{ routeId: route.id },
			{
				context: { headers: headers1, database },
			},
		);

		// User 2 creates project from same route
		await call(
			router.projects.create,
			{ routeId: route.id },
			{
				context: { headers: headers2, database },
			},
		);

		// Each user should see only their own project
		const user1Projects = await call(router.projects.list, undefined, {
			context: { headers: headers1, database },
		});

		const user2Projects = await call(router.projects.list, undefined, {
			context: { headers: headers2, database },
		});

		expect(user1Projects).toHaveLength(1);
		expect(user2Projects).toHaveLength(1);
		expect(user1Projects[0]).toEqual(user2Projects[0]);
	});

	it("sets the createdAt timestamp", async () => {
		const { headers, user } = await createTestUser();
		const route = await createRoute("Timestamped Route", { database });
		const beforeCall = new Date();

		await call(
			router.projects.create,
			{ routeId: route.id },
			{
				context: { headers, database },
			},
		);

		const afterCall = new Date();

		const projects = await database
			.select()
			.from(userProjects)
			.where(
				and(
					eq(userProjects.userId, user.id),
					eq(userProjects.routeId, route.id),
				),
			);

		expect(projects).toHaveLength(1);
		const firstProject = projects[0];
		expect(firstProject?.createdAt).toBeInstanceOf(Date);
		expect(firstProject?.createdAt?.getTime()).toBeGreaterThanOrEqual(
			beforeCall.getTime(),
		);
		expect(firstProject?.createdAt?.getTime()).toBeLessThanOrEqual(
			afterCall.getTime(),
		);
	});
});
