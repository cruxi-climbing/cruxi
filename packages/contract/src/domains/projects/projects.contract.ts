import { oc } from "@orpc/contract";
import z from "zod";
import { uuidV7Schema } from "../../utils";

export const projectSchema = z.object({
	id: uuidV7Schema,
	name: z.string(),
	gradeIndex: z.number(),
	sectorId: uuidV7Schema,
	sectorName: z.string(),
});

export const listProjectsContract = oc.output(z.array(projectSchema));
export const createProjectContract = oc
	.input(z.object({ routeId: uuidV7Schema }))
	.output(z.void());

export const deleteProjectContract = oc
	.input(z.object({ routeId: uuidV7Schema }))
	.output(z.void());
