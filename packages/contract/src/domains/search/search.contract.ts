import { oc } from "@orpc/contract";
import z from "zod";
import { routeSchema } from "../routes/routes.contract";

export const searchRouteContract = oc
	.input(
		z.object({
			search: z.string().trim().min(2).max(100),
		}),
	)
	.output(z.array(routeSchema));
