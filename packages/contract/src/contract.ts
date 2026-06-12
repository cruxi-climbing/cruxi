import type { ContractRouterClient } from "@orpc/contract";
import { listAscentsContract } from "./domains/ascent.contract";
import {
	createClimbingSessionContract,
	listRouteClimbingSessionsContract,
} from "./domains/climbing_sessions/climbing-sessions.contract";
import {
	listAllGradeEntities,
	listGradeIndicesContract,
	listGradeNotations,
	listGradeSystemsContract,
} from "./domains/grades/grades.contract";
import {
	createProjectContract,
	deleteProjectContract,
	listProjectsContract,
} from "./domains/projects/projects.contract";
import { routeByIdContract } from "./domains/routes/routes.contract";
import { searchRouteContract } from "./domains/search/search.contract";

export const contract = {
	search: searchRouteContract,
	routes: {
		getById: routeByIdContract,
	},
	projects: {
		list: listProjectsContract,
		create: createProjectContract,
		delete: deleteProjectContract,
	},
	climbingSessions: {
		create: createClimbingSessionContract,
		listByRoute: listRouteClimbingSessionsContract,
	},
	ascents: {
		list: listAscentsContract,
	},
	grades: {
		indices: listGradeIndicesContract,
		systems: listGradeSystemsContract,
		notations: listGradeNotations,
		all: listAllGradeEntities,
	},
};

export type ContractClient = ContractRouterClient<typeof contract>;
