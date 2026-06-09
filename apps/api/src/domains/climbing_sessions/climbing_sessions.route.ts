import { authOrpc } from "@/orpc/authorized.orpc";
import { createClimbingSessionsService } from "./climbing_sessions.service";

export const createClimbingSessionRoute =
	authOrpc.climbingSessions.create.handler(({ input, context }) => {
		const service = createClimbingSessionsService(context.database);
		return service.createClimbingSession({
			userId: context.user.id,
			...input,
		});
	});

export const listClimbingSessionsByRoute =
	authOrpc.climbingSessions.listByRoute.handler(({ input, context }) => {
		const service = createClimbingSessionsService(context.database);
		return service.findClimbingSessionsByRouteAndUser({
			userId: context.user.id,
			routeId: input.routeId,
		});
	});
