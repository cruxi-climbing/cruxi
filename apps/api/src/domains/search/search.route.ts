import { authOrpc } from "@/orpc/authorized.orpc";
import { createSearchService } from "./search.service";

export const searchRoute = authOrpc.search.handler(
	async ({ input, context }) => {
		const service = createSearchService(context.database);
		return await service.search(input.search);
	},
);
