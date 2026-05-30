import { authOrpc } from "@/orpc/authorized.orpc";
import { createUsersMeProjectsService } from "./projects.service";

export const usersMeProjectsRoute = authOrpc.handler(async ({ context }) => {
	const user = context.user;
	const service = createUsersMeProjectsService(context.database);
	return await service.getProjects(user.id);
});
