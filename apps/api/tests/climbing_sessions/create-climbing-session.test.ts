import { describe, expect, it } from "bun:test";
import { call } from "@orpc/server";
import { and, eq } from "drizzle-orm";
import { database } from "@/database";
import { climbingSessions } from "@/database/schema";
import { router } from "@/router";
import { createRoute, createTestUser } from "../utils/test.utils";

describe("Create climbing session", () => {
	it("creates multiple climbing sessions", async () => {
		const { headers, user } = await createTestUser();
		const route = await createRoute("Test route", { database });

		await call(
			router.climbingSessions.create,
			{
				routeId: route.id,
				comment: "Test comment",
				sessionDate: "2025-03-12",
			},
			{ context: { headers, database } },
		);

		await call(
			router.climbingSessions.create,
			{
				routeId: route.id,
				comment: "Test comment",
				sessionDate: "2025-03-08",
			},
			{ context: { headers, database } },
		);

		const sessions = await database
			.select()
			.from(climbingSessions)
			.where(
				and(
					eq(climbingSessions.routeId, route.id),
					eq(climbingSessions.userId, user.id),
				),
			);

		expect(sessions).toBeArrayOfSize(2);
	});
});
