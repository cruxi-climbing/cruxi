import { routeByIdRoute } from "./domains/routes/route.route";
import { searchRoute } from "./domains/search/search.route";
import { usersMeProjectsRoute } from "./domains/users/me/projects.route";

export const router = {
	search: searchRoute,
	routes: {
		getById: routeByIdRoute,
	},
	users: {
		me: {
			projects: usersMeProjectsRoute,
		},
	},
};
