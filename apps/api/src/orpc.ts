import { os } from "@orpc/server";
import type { Database } from "./database";

export const orpc = os.$context<{ headers: Headers; database: Database }>();
