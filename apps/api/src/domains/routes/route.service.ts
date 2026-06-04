import { count, eq, sql } from "drizzle-orm";
import type { Database } from "@/database";
import { ascents, routes, sectors } from "@/database/schema";

export function createRouteService(database: Database) {
	return {
		getById: async (id: string) => {
			const [route] = await database
				.select({
					id: routes.id,
					name: routes.name,
					description: routes.description,
					gradeIndex: routes.gradeIndex,
					height: routes.height,
					sectorId: routes.sectorId,
					sectorName: sectors.name,
					ascentsCount: count(ascents.id),
					avgRating: sql`AVG(${ascents.rating})`.mapWith(Number),
				})
				.from(routes)
				.innerJoin(sectors, eq(routes.sectorId, sectors.id))
				.leftJoin(ascents, eq(ascents.routeId, routes.id))
				.where(eq(routes.id, id))
				.groupBy(
					routes.id,
					routes.name,
					routes.description,
					routes.gradeIndex,
					routes.height,
					routes.sectorId,
					sectors.name,
				)
				.limit(1);

			if (!route) {
				throw new Error("Route not found");
			}

			return route;
		},
	};
}
