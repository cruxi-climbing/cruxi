import { eq, sql } from "drizzle-orm";
import type { Database } from "@/database";
import { routes, sectors } from "@/database/schema";

export function createSearchService(database: Database) {
	return {
		search: async (search: string) => {
			return await database
				.select({
					id: routes.id,
					name: routes.name,
					description: routes.description,
					gradeIndex: routes.gradeIndex,
					height: routes.height,
					sectorId: routes.sectorId,
					sectorName: sectors.name,
				})
				.from(routes)
				.innerJoin(sectors, eq(routes.sectorId, sectors.id))
				.where(sql`${routes.name} % ${search}`)
				.orderBy(sql`strict_word_similarity(${search}, ${routes.name}) DESC`)
				.limit(10);
		},
	};
}
