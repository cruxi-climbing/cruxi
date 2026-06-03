import type { Database } from "@/database";
import { gradeIndices, gradeNotations, gradeSystems } from "@/database/schema";

export function createGradesService(database: Database) {
	const getGradeIndices = async () => {
		return await database
			.select({ index: gradeIndices.index })
			.from(gradeIndices)
			.orderBy(gradeIndices.index);
	};

	const getGradeSystems = async () => {
		return await database
			.select({ id: gradeSystems.id, name: gradeSystems.name })
			.from(gradeSystems)
			.orderBy(gradeSystems.name);
	};

	const getGradeNotations = async () => {
		return await database
			.select({
				gradeIndexId: gradeNotations.gradeIndexId,
				gradeSystemId: gradeNotations.gradeSystemId,
				notation: gradeNotations.notation,
			})
			.from(gradeNotations)
			.orderBy(gradeNotations.gradeIndexId);
	};

	const getAllGrades = async () => {
		const [indices, systems, notations] = await Promise.all([
			getGradeIndices(),
			getGradeSystems(),
			getGradeNotations(),
		]);

		return { systems, indices, notations };
	};

	return {
		getGradeIndices,
		getGradeSystems,
		getGradeNotations,
		getAllGrades,
	};
}
