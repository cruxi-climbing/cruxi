import { ORPCError } from "@orpc/server";
import { baseOrpc } from "@/orpc/base.orpc";
import { auth } from ".";

export const authMiddleware = baseOrpc.middleware(async ({ context, next }) => {
	const sessionData = await auth.api.getSession({
		headers: context.headers,
	});

	const bypassAuth = process.env.BYPASS_AUTH === "true";

	if (bypassAuth) {
		console.warn(
			"Bypassing authentication. This should not be used in production.",
		);
		return next({
			context: {
				session: sessionData?.session,
				user: sessionData?.user,
			},
		});
	}

	if (!sessionData?.session || !sessionData?.user) {
		throw new ORPCError("UNAUTHORIZED");
	}

	return next({
		context: {
			session: sessionData.session,
			user: sessionData.user,
		},
	});
});
