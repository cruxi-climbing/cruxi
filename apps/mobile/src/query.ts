import type { ContractClient } from "@cruxi/contract";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { SimpleCsrfProtectionLinkPlugin } from "@orpc/client/plugins";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { authClient } from "./auth-client";

const url = process.env.API_RPC_URL || "http://localhost:3000/rpc";
const link = new RPCLink({
	url: url,
	headers: () => {
		return {
			Cookie: authClient.getCookie() || "",
		};
	},
	plugins: [new SimpleCsrfProtectionLinkPlugin()],
});

const client: ContractClient = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
