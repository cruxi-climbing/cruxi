import z from "zod";
import { authOrpc } from "@/orpc/authorized.orpc";
import { createRouteService } from "./route.service";

export const routeByIdRoute = authOrpc
	.input(
		z.object({
			id: z.uuid({ version: "v7" }),
		}),
	)
	.handler(async ({ input, context }) => {
		const service = createRouteService(context.database);
		return await service.getById(input.id);
	});
