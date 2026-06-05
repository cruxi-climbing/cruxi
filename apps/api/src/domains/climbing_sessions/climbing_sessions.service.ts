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
	};
}
