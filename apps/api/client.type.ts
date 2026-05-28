import type { RouterClient } from "@orpc/server";
import type { router } from "./src/router";
export type Router = typeof router;

export type ApiClient = RouterClient<Router>;
