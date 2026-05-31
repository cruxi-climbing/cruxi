import { contract } from "@cruxi/contract";
import { implement } from "@orpc/server";
import type { Database } from "@/database";

export const baseOrpc = implement(contract).$context<{
	headers: Headers;
	database: Database;
}>();
