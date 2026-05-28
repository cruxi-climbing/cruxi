import { os } from "@orpc/server";
import type { Database } from "@/database";

export const baseOrpc = os.$context<{ headers: Headers; database: Database }>();
