import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import {
	CORSPlugin,
	SimpleCsrfProtectionHandlerPlugin,
} from "@orpc/server/plugins";
import { auth } from "@/auth";
import { database } from "./database";
import { router } from "./router";
import { getLocalIPAddress } from "./utils/os.utils";

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
			"/": {
				GET: () => new Response("Come on dude"),
			},
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
	console.clear();
	console.log(`🚀 Bun server is running!`);
	console.log(`   - Local:    http://localhost:${server.port}`);
	console.log(`   - Network:  http://${getLocalIPAddress()}:${server.port}`);

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
