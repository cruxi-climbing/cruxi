import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema";

const connectionUrl = process.env.DATABASE_URL;
if (!connectionUrl)
	throw new Error("DATABASE_URL environment variable is not set");

export const database = drizzle(connectionUrl, { schema: schema });
export type Database = typeof database;

export async function addReferenceData() {
	try {
		// Check if reference data already exists
		const [indicesCount, systemsCount] = await Promise.all([
			database.$count(schema.gradeIndices),
			database.$count(schema.gradeSystems),
		]);

		const hasData = indicesCount > 0 && systemsCount > 0;

		if (hasData) {
			console.log("Reference data already exists in the database");
			return;
		}

		// Load reference data from JSON files
		const gradeIndicesData = await import(
			"./reference_data/grade_indices.json"
		).then((m) => m.default);
		const gradeSystemsData = await import(
			"./reference_data/grade_systems.json"
		).then((m) => m.default);
		const gradeValuesData = await import(
			"./reference_data/grade_values.json"
		).then((m) => m.default);

		// Insert grade indices
		if (gradeIndicesData.length > 0) {
			await database.insert(schema.gradeIndices).values(gradeIndicesData);
		}

		// Insert grade systems
		if (gradeSystemsData.length > 0) {
			await database.insert(schema.gradeSystems).values(gradeSystemsData);
		}

		if (gradeValuesData.length > 0) {
			const notationsData = gradeValuesData.map((v) => ({
				gradeIndexId: v.grade_index_id,
				gradeSystemId: v.grade_system_id,
				notation: v.notation,
			}));

			await database.insert(schema.gradeNotations).values(notationsData);
		}
	} catch (error) {
		console.error(
			"Error adding reference data:",
			error instanceof Error ? error.message : String(error),
		);
		throw error;
	}
}
