import {
	createClimbingSessionRoute,
	listClimbingSessionsByRoute,
} from "./domains/climbing_sessions/climbing_sessions.route";
import {
	gradesAllRoute,
	gradesIndicesRoute,
	gradesNotationsRoute,
	gradesSystemsRoute,
} from "./domains/grades/grades.route";
import {
	projectsCreateRoute,
	projectsDeleteRoute,
	projectsListRoute,
} from "./domains/projects/projects.route";
import { routeByIdRoute } from "./domains/routes/route.route";
import { searchRoute } from "./domains/search/search.route";
import { baseOrpc } from "./orpc/base.orpc";

export const router = baseOrpc.router({
	search: searchRoute,
	routes: {
		getById: routeByIdRoute,
	},
	projects: {
		list: projectsListRoute,
		create: projectsCreateRoute,
		delete: projectsDeleteRoute,
	},
	climbingSessions: {
		create: createClimbingSessionRoute,
		listByRoute: listClimbingSessionsByRoute,
	},
	grades: {
		all: gradesAllRoute,
		systems: gradesSystemsRoute,
		indices: gradesIndicesRoute,
		notations: gradesNotationsRoute,
	},
});
