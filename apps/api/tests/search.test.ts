import { describe, expect, it } from "bun:test";
import { call } from "@orpc/server";
import { database } from "@/database";
import { router } from "@/router";
import { createTestUser } from "./utils/test.utils";

describe("Search", () => {
	it("should return search results for a valid query", async () => {
		const { headers } = await createTestUser();

		const res = await call(
			router.search,
			{ search: "test" },
			{ context: { headers, database } },
		);
		expect(res).toBeDefined();
	});
});
