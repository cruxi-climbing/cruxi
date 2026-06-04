import { avg, count, eq } from "drizzle-orm";
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
					avgRating: avg(ascents.rating),
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

			console.log("ascents average rating:", route?.avgRating);

			if (!route) {
				throw new Error("Route not found");
			}

			return {
				...route,
				ascentsCount: Number(route.ascentsCount ?? 0),
				avgRating: route.avgRating == null ? null : Number(route.avgRating),
			};
		},
	};
}
