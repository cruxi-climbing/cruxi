import { describe, expect, it } from "bun:test";
import { call } from "@orpc/server";
import { database } from "@/database";
import { router } from "@/router";

describe("Search", () => {
	it("should return search results for a valid query", async () => {
		const res = await call(
			router.search,
			{ search: "test" },
			{
				context: { headers: new Headers(), database },
			},
		);
		expect(res).toBeDefined();
	});
});
