import z from "zod";
import { authOrpc } from "@/orpc/authorized.orpc";
import { createSearchService } from "./search.service";

export const searchRoute = authOrpc
	.input(
		z.object({
			search: z.string().trim().min(2).max(100),
		}),
	)
	.handler(async ({ input, context }) => {
		const service = createSearchService(context.database);
		return await service.search(input.search);
	});
