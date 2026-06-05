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
