import type { RouterClient as RC } from "@orpc/server";
import type { router } from "./src/router";
export type Router = typeof router;

export type RouterClient = RC<Router>;
