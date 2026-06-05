import { describe, expect, it } from "bun:test";
import { call } from "@orpc/server";
import { and, eq } from "drizzle-orm";
import { type Database, database } from "@/database";
import { userProjects } from "@/database/schema";
import { router } from "@/router";
import { createRoute, createTestUser } from "../utils/test.utils";

describe("Projects.delete", () => {
	it("delete a project then recreate it", async () => {
		const { headers, user } = await createTestUser();
		const route = await createRoute("Test Route", { database });
		const userId = user.id;
		const routeId = route.id;

		await createUserProject({ userId, routeId }, { database });

		await call(
			router.projects.delete,
			{ routeId: route.id },
			{ context: { headers, database } },
		);

		expect(
			getUserProject({ userId, routeId }, { database }),
		).resolves.toBeEmpty();

		await createUserProject({ userId, routeId }, { database });
		expect(
			getUserProject({ userId, routeId }, { database }),
		).resolves.not.toBeEmpty();
	});

	it("can delete non existant project without error", async () => {
		const { headers } = await createTestUser();
		const route = await createRoute("Test Route", { database });

		// there is not user project for this route
		const res = await call(
			router.projects.delete,
			{ routeId: route.id },
			{ context: { headers, database } },
		);

		expect(res).toBeEmpty();
	});
});

async function createUserProject(
	{ userId, routeId }: { userId: string; routeId: string },
	{ database }: { database: Database },
) {
	return await database.insert(userProjects).values({ userId, routeId });
}

async function getUserProject(
	{ userId, routeId }: { userId: string; routeId: string },
	{ database }: { database: Database },
) {
	return await database
		.select()
		.from(userProjects)
		.where(
			and(eq(userProjects.userId, userId), eq(userProjects.routeId, routeId)),
		);
}
