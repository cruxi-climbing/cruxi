import { desc, eq } from "drizzle-orm";
import type { Database } from "@/database";
import { ascents, routes, sectors } from "@/database/schema";

export function createAscentsService(database: Database) {
	return {
		findUserAscents({ userId }: { userId: string }) {
			return database
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
						sectorId: sectors.id,
						sectorName: sectors.name,
					},
				})
				.from(ascents)
				.innerJoin(routes, eq(ascents.routeId, routes.id))
				.innerJoin(sectors, eq(routes.sectorId, sectors.id))
				.where(eq(ascents.userId, userId))
				.orderBy(desc(ascents.sentAt));
		},
	};
}
