import { authOrpc } from "@/orpc/authorized.orpc";
import { createGradesService } from "./grades.service";

export const gradesIndicesRoute = authOrpc.grades.indices.handler(
	async ({ context }) => {
		const service = createGradesService(context.database);
		return await service.getGradeIndices();
	},
);

export const gradesSystemsRoute = authOrpc.grades.systems.handler(
	async ({ context }) => {
		const service = createGradesService(context.database);
		return await service.getGradeSystems();
	},
);

export const gradesNotationsRoute = authOrpc.grades.notations.handler(
	async ({ context }) => {
		const service = createGradesService(context.database);
		return await service.getGradeNotations();
	},
);

export const gradesAllRoute = authOrpc.grades.all.handler(
	async ({ context }) => {
		const service = createGradesService(context.database);
		return await service.getAllGrades();
	},
);
