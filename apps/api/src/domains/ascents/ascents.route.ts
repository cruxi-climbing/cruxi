import { authOrpc } from "@/orpc/authorized.orpc";
import { createAscentsService } from "./ascents.service";

export const ascentsListRoute = authOrpc.ascents.list.handler(
	async ({ context }) => {
		const service = createAscentsService(context.database);
		return service.findUserAscents({ userId: context.user.id });
	},
);
