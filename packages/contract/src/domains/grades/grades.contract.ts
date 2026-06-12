import { oc } from "@orpc/contract";
import z from "zod";
import { uuidV7Schema } from "../../utils";

export const gradeIndexSchema = z.object({ index: z.number() });

export const gradeSystemSchema = z.object({
	id: uuidV7Schema,
	name: z.string(),
});

export const gradeNotationSchema = z.object({
	gradeIndexId: z.number(),
	gradeSystemId: uuidV7Schema,
	notation: z.string(),
});

export const listGradeIndicesContract = oc.output(z.array(gradeIndexSchema));
export const listGradeSystemsContract = oc.output(z.array(gradeSystemSchema));
export const listGradeNotations = oc.output(z.array(gradeNotationSchema));

export const listAllGradeEntities = oc.output(
	z.object({
		systems: z.array(gradeSystemSchema),
		indices: z.array(gradeIndexSchema),
		notations: z.array(gradeNotationSchema),
	}),
);
