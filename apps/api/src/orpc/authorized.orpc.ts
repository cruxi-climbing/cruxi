import { authMiddleware } from "../auth/auth.middleware";
import { baseOrpc } from "./base.orpc";

export const authOrpc = baseOrpc.use(authMiddleware);
