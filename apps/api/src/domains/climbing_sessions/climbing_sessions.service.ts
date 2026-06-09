import { and, desc, eq } from "drizzle-orm";
import type { Database } from "@/database";
import { climbingSessions } from "@/database/schema";

export function createClimbingSessionsService(database: Database) {
	return {
		async createClimbingSession(data: {
			routeId: string;
			userId: string;
			sessionDate: string;
			comment?: string;
		}) {
			return await database.insert(climbingSessions).values(data).returning();
		},

		async findClimbingSessionsByRouteAndUser({
			userId,
			routeId,
		}: {
			userId: string;
			routeId: string;
		}) {
			return await database
				.select()
				.from(climbingSessions)
				.where(
					and(
						eq(climbingSessions.userId, userId),
						eq(climbingSessions.routeId, routeId),
					),
				)
				.orderBy(desc(climbingSessions.sessionDate));
		},
	};
}
