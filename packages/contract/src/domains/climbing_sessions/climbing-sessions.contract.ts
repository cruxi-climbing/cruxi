import { oc } from "@orpc/contract";
import z from "zod";
import { uuidV7Schema } from "../../utils";

export const climbingSessionSchema = z.object({
	id: uuidV7Schema,
	routeId: uuidV7Schema,
	sessionDate: z.iso.date(),
	comment: z.string().nullable(),
	createdAt: z.date(),
});

export const createClimbingSessionContract = oc.input(
	z.object({
		routeId: uuidV7Schema,
		comment: z.string().trim().optional(),
		sessionDate: z.iso.date(),
	}),
);

export const listRouteClimbingSessionsContract = oc
	.input(z.object({ routeId: uuidV7Schema }))
	.output(z.array(climbingSessionSchema));
