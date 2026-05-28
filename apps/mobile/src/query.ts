import type { ApiClient } from "@cruxi/api";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { SimpleCsrfProtectionLinkPlugin } from "@orpc/client/plugins";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

const link = new RPCLink({
	url: process.env.API_URL || "http://localhost:3000/rpc",
	headers: () => ({
		authorization: "Bearer token",
	}),
	plugins: [new SimpleCsrfProtectionLinkPlugin()],
});

const client: ApiClient = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
