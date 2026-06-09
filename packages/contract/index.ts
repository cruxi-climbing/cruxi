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

const projectsListContract = oc.output(z.array(projectSchema));

const gradeIndexSchema = z.object({ index: z.number() });
const gradeSystemSchema = z.object({ id: uuidSchema, name: z.string() });
const gradeNotationSchema = z.object({
	gradeIndexId: z.number(),
	gradeSystemId: uuidSchema,
	notation: z.string(),
});

const climbingSessionSchema = z.object({
	id: uuidSchema,
	routeId: uuidSchema,
	sessionDate: z.iso.date(),
	comment: z.string().nullable(),
	createdAt: z.date(),
});

export const contract = {
	search: searchRouteContract,
	routes: {
		getById: routeByIdContract,
	},
	projects: {
		list: projectsListContract,
		create: oc.input(z.object({ routeId: uuidSchema })).output(z.void()),
		delete: oc.input(z.object({ routeId: uuidSchema })).output(z.void()),
	},
	climbingSessions: {
		create: oc.input(
			z.object({
				routeId: uuidSchema,
				comment: z.string().trim().optional(),
				sessionDate: z.iso.date(),
			}),
		),
		getByRoute: oc
			.input(z.object({ routeId: uuidSchema }))
			.output(z.array(climbingSessionSchema)),
	},
	grades: {
		indices: oc.output(z.array(gradeIndexSchema)),
		systems: oc.output(z.array(gradeSystemSchema)),
		notations: oc.output(z.array(gradeNotationSchema)),
		all: oc.output(
			z.object({
				systems: z.array(gradeSystemSchema),
				indices: z.array(gradeIndexSchema),
				notations: z.array(gradeNotationSchema),
			}),
		),
	},
};

export type ContractClient = ContractRouterClient<typeof contract>;
