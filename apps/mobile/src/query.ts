import type { RouterClient } from "@cruxi/api";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

const link = new RPCLink({
	url: process.env.API_URL || "http://localhost:3000/rpc",
	headers: () => ({
		authorization: "Bearer token",
	}),
});

const client: RouterClient = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
