import { oc } from "@orpc/contract";
import z from "zod";
import { uuidV7Schema } from "../../utils";

const sectorSchema = z.object({
	id: uuidV7Schema,
	name: z.string(),
});

export const routeSchema = z.object({
	id: uuidV7Schema,
	name: z.string(),
	description: z.string().nullable(),
	gradeIndex: z.number(),
	height: z.number().nullable(),
	sector: sectorSchema,
});

export const routeWithDetailSchema = routeSchema.extend({
	ascentsCount: z.number(),
	avgRating: z.number().nullable(),
});

export const routeByIdContract = oc
	.input(
		z.object({
			id: uuidV7Schema,
		}),
	)
	.output(routeWithDetailSchema);
