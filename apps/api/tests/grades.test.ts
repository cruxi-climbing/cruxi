import { describe, expect, it } from "bun:test";
import { call } from "@orpc/server";
import { database } from "@/database";
import { router } from "@/router";
import { createTestUser } from "./utils/test.utils";

describe("Grades", () => {
	it("returns grade indices array", async () => {
		const { headers } = await createTestUser();

		const res = await call(router.grades.indices, undefined, {
			context: { headers, database },
		});

		expect(Array.isArray(res)).toBe(true);
		expect(res.length).toBeGreaterThan(0);
		expect(res[0]).toEqual(
			expect.objectContaining({ index: expect.any(Number) }),
		);
	});

	it("returns grade systems array", async () => {
		const { headers } = await createTestUser();

		const res = await call(router.grades.systems, undefined, {
			context: { headers, database },
		});

		expect(Array.isArray(res)).toBe(true);
		expect(res.length).toBeGreaterThan(0);
		expect(res[0]).toEqual(
			expect.objectContaining({
				id: expect.any(String),
				name: expect.any(String),
			}),
		);
	});

	it("returns grade notations array", async () => {
		const { headers } = await createTestUser();

		const res = await call(router.grades.notations, undefined, {
			context: { headers, database },
		});

		expect(Array.isArray(res)).toBe(true);
		expect(res.length).toBeGreaterThan(0);
		expect(res[0]).toEqual(
			expect.objectContaining({
				gradeIndexId: expect.any(Number),
				gradeSystemId: expect.any(String),
				notation: expect.any(String),
			}),
		);
	});

	it("returns combined grades object", async () => {
		const { headers } = await createTestUser();

		const res = await call(router.grades.all, undefined, {
			context: { headers, database },
		});

		expect(res).toEqual(
			expect.objectContaining({
				systems: expect.any(Array),
				indices: expect.any(Array),
				notations: expect.any(Array),
			}),
		);
	});
});
