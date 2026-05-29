import { beforeEach } from "bun:test";
import { reset } from "drizzle-seed";
import { addReferenceData, database } from "@/database";
import * as schema from "@/database/schema";

export const testDatabase = database;

beforeEach(async () => {
	await reset(testDatabase, schema);
	await addReferenceData();
});
