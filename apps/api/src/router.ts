import {
	gradesAllRoute,
	gradesIndicesRoute,
	gradesNotationsRoute,
	gradesSystemsRoute,
} from "./domains/grades/grades.route";
import { projectsListRoute } from "./domains/projects/projects.route";
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
	},
	grades: {
		all: gradesAllRoute,
		systems: gradesSystemsRoute,
		indices: gradesIndicesRoute,
		notations: gradesNotationsRoute,
	},
});
