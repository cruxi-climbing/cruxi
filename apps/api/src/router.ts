import { os } from "@orpc/server";
import z from "zod";

const pingRoute = os.handler(async () => {
	return "pong";
});

const exampleRoute = os
	.input(
		z.object({
			name: z.string(),
		}),
	)
	.output(
		z.object({
			greeting: z.string(),
		}),
	)
	.handler(async ({ input }) => {
		return {
			greeting: `Hello, ${input.name}!`,
		};
	});

export const router = {
	ping: pingRoute,
	example: exampleRoute,
};
