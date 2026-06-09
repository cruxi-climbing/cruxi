import { authOrpc } from "@/orpc/authorized.orpc";
import { createClimbingSessionsService } from "./climbing_sessions.service";

export const createClimbingSessionRoute =
	authOrpc.climbing_sessions.create.handler(({ input, context }) => {
		const service = createClimbingSessionsService(context.database);
		return service.createClimbingSession({
			userId: context.user.id,
			...input,
		});
	});

export const getRouteClimbingSessionsRoute =
	authOrpc.climbing_sessions.getByRoute.handler(({ input, context }) => {
		const service = createClimbingSessionsService(context.database);
		return service.getClimbingSessionsByRoute({
			userId: context.user.id,
			routeId: input.routeId,
		});
	});
