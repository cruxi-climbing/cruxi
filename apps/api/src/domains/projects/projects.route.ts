import { authOrpc } from "@/orpc/authorized.orpc";
import { createProjectsListService } from "./projects.service";

export const projectsListRoute = authOrpc.projects.list.handler(
	async ({ context }) => {
		const user = context.user;
		const service = createProjectsListService(context.database);
		return await service.getProjects(user.id);
	},
);
