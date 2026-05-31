import { type ContractRouterClient, oc } from "@orpc/contract";
import { z } from "zod";

const uuidSchema = z.uuid({ version: "v7" });

const routeSchema = z.object({
	id: uuidSchema,
	name: z.string(),
	description: z.string().nullable(),
	gradeIndex: z.number(),
	height: z.number().nullable(),
	sectorId: uuidSchema,
	sectorName: z.string(),
});

const routeWithDetailSchema = routeSchema.extend({
	ascentsCount: z.number(),
	avgRating: z.number().nullable(),
});

const projectSchema = z.object({
	id: uuidSchema,
	name: z.string(),
	gradeIndex: z.number(),
	sectorId: uuidSchema,
	sectorName: z.string(),
});

const searchRouteContract = oc
	.input(
		z.object({
			search: z.string().trim().min(2).max(100),
		}),
	)
	.output(z.array(routeSchema));

const routeByIdContract = oc
	.input(
		z.object({
			id: uuidSchema,
		}),
	)
	.output(routeWithDetailSchema);

const usersMeProjectsContract = oc.output(z.array(projectSchema));

export const contract = {
	search: searchRouteContract,
	routes: {
		getById: routeByIdContract,
	},
	users: {
		me: {
			projects: usersMeProjectsContract,
		},
	},
};

export type ContractClient = ContractRouterClient<typeof contract>;
