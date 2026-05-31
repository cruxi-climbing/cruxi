import { authOrpc } from "@/orpc/authorized.orpc";
import { createRouteService } from "./route.service";

export const routeByIdRoute = authOrpc.routes.getById.handler(
	async ({ input, context }) => {
		const service = createRouteService(context.database);
		return await service.getById(input.id);
	},
);
