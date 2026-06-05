import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import {
	CORSPlugin,
	SimpleCsrfProtectionHandlerPlugin,
} from "@orpc/server/plugins";
import { auth } from "@/auth";
import { database } from "./database";
import { router } from "./router";

const handler = new RPCHandler(router, {
	plugins: [new CORSPlugin(), new SimpleCsrfProtectionHandlerPlugin()],
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

	const server = Bun.serve({
		port: port ?? envPort,
		routes: {
			"/api/auth/*": (request) => {
				return auth.handler(request);
			},
			"/health": {
				GET: healthcheck,
			},
		},

		async fetch(request) {
			const { matched, response } = await handler.handle(request, {
				prefix: "/rpc",
				context: { headers: request.headers, database: database },
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

async function healthcheck() {
	try {
		await database.execute("SELECT 1");
		return new Response("ok", { status: 200 });
	} catch (e) {
		console.error(e);
		return new Response("ko", { status: 503 });
	}
}
