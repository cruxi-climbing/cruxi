import { searchRoute } from "./domains/search/search.route";
import { usersMeProjectsRoute } from "./domains/users/me/projects.route";

export const router = {
	search: searchRoute,
	users: {
		me: {
			projects: usersMeProjectsRoute,
		},
	},
};
