import { auth } from "@/auth";
import type { Database } from "@/database";
import { areas, gradeIndices, routes, sectors } from "@/database/schema";

export async function createTestUser() {
	const authCtx = await auth.$context;
	const authTest = authCtx.test;

	const user = authTest.createUser({
		id: Bun.randomUUIDv7(),
	});
	const savedUser = await authTest.saveUser(user);
	const loginResult = await authTest.login({ userId: savedUser.id });
	return loginResult;
}

export async function createRoute(
	name: string,
	{ database }: { database: Database },
) {
	const [gradeIndex] = await database.select().from(gradeIndices).limit(1);
	if (!gradeIndex) throw new Error("Expected reference grade index to exist");

	const areaId = Bun.randomUUIDv7();
	const sectorId = Bun.randomUUIDv7();
	const sectorName = "Test Sector";
	const routeId = Bun.randomUUIDv7();

	await database.insert(areas).values({ id: areaId, name: "Test Area" });
	await database.insert(sectors).values({
		id: sectorId,
		name: sectorName,
		areaId,
	});

	await database.insert(routes).values({
		id: routeId,
		name,
		gradeIndex: gradeIndex.index,
		sectorId,
	});

	return {
		id: routeId,
		name,
		gradeIndex: gradeIndex.index,
		sector: {
			id: sectorId,
			name: sectorName,
		},
	};
}
