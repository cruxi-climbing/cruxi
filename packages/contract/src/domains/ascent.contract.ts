import { ascentStyles } from "@cruxi/shared";
import { oc } from "@orpc/contract";
import z from "zod";
import { routeSchema } from "./routes/routes.contract";

export const ascentOutputSchema = z.object({
	sentAt: z.iso.date(),
	rating: z.number().nullable(),
	ascentStyle: z.enum(ascentStyles),
	proposedGradeIndex: z.number().nullable(),
	comment: z.string().nullable(),
	route: routeSchema,
});

export const listAscentsContract = oc.output(z.array(ascentOutputSchema));
