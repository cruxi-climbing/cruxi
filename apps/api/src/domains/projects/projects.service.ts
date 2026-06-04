import { eq, sql } from "drizzle-orm";
import type { Database } from "@/database";
import { routes, sectors, userProjects } from "@/database/schema";

export function createProjectsService(database: Database) {
	return {
		getProjects: async (userId: string) => {
			return await database
				.select({
					id: routes.id,
					name: routes.name,
					gradeIndex: routes.gradeIndex,
					sectorId: routes.sectorId,
					sectorName: sectors.name,
				})
				.from(userProjects)
				.innerJoin(routes, eq(userProjects.routeId, routes.id))
				.innerJoin(sectors, eq(routes.sectorId, sectors.id))
				.where(eq(userProjects.userId, userId))
				.orderBy(sql`${userProjects.createdAt} DESC`);
		},

		createProject: async (userId: string, routeId: string) => {
			await database
				.insert(userProjects)
				.values({ userId, routeId, createdAt: new Date() })
				.onConflictDoNothing({
					target: [userProjects.userId, userProjects.routeId],
				});
		},
	};
}
