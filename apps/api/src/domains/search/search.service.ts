import { sql } from "drizzle-orm";
import type { Database } from "@/database";
import { routes } from "@/database/schema";

export function createSearchService(database: Database) {
	return {
		search: async (search: string) => {
			return await database
				.select()
				.from(routes)
				.where(sql`${routes.name} % ${search}`)
				.orderBy(sql`strict_word_similarity(${search}, ${routes.name}) DESC`)
				.limit(10);
		},
	};
}
