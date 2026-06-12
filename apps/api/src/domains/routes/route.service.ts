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
					ascentsCount: count(ascents.id),
					avgRating: sql`AVG(${ascents.rating})`.mapWith(Number),
					sector: {
						id: sectors.id,
						name: sectors.name,
					},
				})
				.from(routes)
				.innerJoin(sectors, eq(routes.sectorId, sectors.id))
				.leftJoin(ascents, eq(ascents.routeId, routes.id))
				.where(eq(routes.id, id))
				.groupBy(routes.id, sectors.id)
				.limit(1);

			if (!route) {
				throw new Error("Route not found");
			}

			return route;
		},
	};
}
