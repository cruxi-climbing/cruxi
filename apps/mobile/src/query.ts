import type { ContractClient } from "@cruxi/contract";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { SimpleCsrfProtectionLinkPlugin } from "@orpc/client/plugins";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { authClient } from "./auth-client";
import { config } from "./config";

const url = config.apiBaseUrl + config.apiRpcPath;
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
