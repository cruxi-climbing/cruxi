import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { CORSPlugin } from "@orpc/server/plugins";
import { auth } from "@/auth";
import { addReferenceData } from "./database";
import { router } from "./router";

const handler = new RPCHandler(router, {
	plugins: [new CORSPlugin()],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

export async function createServer({ port }: { port?: number } = {}) {
	const envPort = process.env.PORT
		? Number.parseInt(process.env.PORT, 10)
		: 3000;

	try {
		await addReferenceData();
	} catch (error) {
		console.error("Failed to add reference data:", error);
		// don't throw error, we want the server to start even if adding reference data fails
	}

	const server = Bun.serve({
		port: port ?? envPort,
		routes: {
			"/api/auth/*": (request) => {
				return auth.handler(request);
			},
		},

		async fetch(request) {
			const { matched, response } = await handler.handle(request, {
				prefix: "/rpc",
				context: { headers: request.headers },
			});

			if (matched) {
				return response;
			}

			return new Response("Not found", { status: 404 });
		},
	});

	console.info(`Server is running on ${server.url}`);

	return server;
}
