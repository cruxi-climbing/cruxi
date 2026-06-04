import { authOrpc } from "@/orpc/authorized.orpc";
import { createProjectsService } from "./projects.service";

export const projectsListRoute = authOrpc.projects.list.handler(
	async ({ context }) => {
		const user = context.user;
		const service = createProjectsService(context.database);
		return await service.getProjects(user.id);
	},
);

export const projectsCreateRoute = authOrpc.projects.create.handler(
	async ({ input, context }) => {
		const service = createProjectsService(context.database);
		return await service.createProject(context.user.id, input.routeId);
	},
);
