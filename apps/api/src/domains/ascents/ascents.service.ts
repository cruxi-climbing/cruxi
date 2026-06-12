import { desc, eq } from "drizzle-orm";
import type { Database } from "@/database";
import { ascents, routes, sectors } from "@/database/schema";

export function createAscentsService(database: Database) {
	return {
		async findUserAscents({ userId }: { userId: string }) {
			const foundAscents = await database
				.select({
					id: ascents.id,
					sentAt: ascents.sentAt,
					comment: ascents.comment,
					ascentStyle: ascents.ascentStyle,
					proposedGradeIndex: ascents.proposedGradeIndex,
					rating: ascents.rating,
					route: {
						id: routes.id,
						name: routes.name,
						description: routes.description,
						gradeIndex: routes.gradeIndex,
						height: routes.height,
					},
					sector: {
						id: sectors.id,
						name: sectors.name,
					},
				})
				.from(ascents)
				.innerJoin(routes, eq(ascents.routeId, routes.id))
				.innerJoin(sectors, eq(routes.sectorId, sectors.id))
				.where(eq(ascents.userId, userId))
				.orderBy(desc(ascents.sentAt));

			// move sector from ascent.sector to ascent.route.sector
			return foundAscents.map((ascent) => ({
				...ascent,
				route: { ...ascent.route, sector: ascent.sector },
				sector: undefined,
			}));
		},
	};
}
